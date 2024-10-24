const pool = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const addItemToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    console.log('productId: ', productId);

    try {
        // Check if the user already has a cart
        let cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId]
        );

        let cartId;
        if (cartResult.rows.length === 0) {
            // If no cart exists, create a new cart
            cartResult = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
                [userId]
            );
        }

        cartId = cartResult.rows[0].id;

        // Check if the product is already in the cart
        const existingItemResult = await pool.query(
            'SELECT id, quantity FROM cartitems WHERE cart_id = $1 AND product_id = $2',
            [cartId, productId]
        );

        let result;

        if (existingItemResult.rows.length > 0) {
            // Product already in the cart, so update the quantity
            const newQuantity = existingItemResult.rows[0].quantity + quantity;
            result = await pool.query(
                'UPDATE cartitems SET quantity = $1 WHERE id = $2 RETURNING *',
                [newQuantity, existingItemResult.rows[0].id]
            );
        } else {
            // Product not in the cart, so insert a new row
            result = await pool.query(
                'INSERT INTO cartitems (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [cartId, productId, quantity]
            );
        }
        console.log(result);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the user's cart
const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        // Perform a single query to get the cart and its items with product details
        const result = await pool.query(
            `SELECT carts.id as cart_id, cartitems.id as item_id, cartitems.product_id, cartitems.quantity,
                    products.description as product_name, products.item_number as item_number, 
                    CASE
                        WHEN cartitems.quantity >= products.qty3 THEN products.price3
                        WHEN cartitems.quantity >= products.qty2 THEN products.price2
                        ELSE (products.price1)
                    END as unit_price,
                    CASE
                        WHEN cartitems.quantity >= products.qty3 THEN (CAST(products.price3 AS NUMERIC) * cartitems.quantity)
                        WHEN cartitems.quantity >= products.qty2 THEN (CAST(products.price2 AS NUMERIC) * cartitems.quantity)
                        ELSE (CAST(products.price1 AS NUMERIC) * cartitems.quantity)
                    END as product_price
             FROM carts
             LEFT JOIN cartitems ON carts.id = cartitems.cart_id
             LEFT JOIN products ON cartitems.product_id = products.id
             WHERE carts.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0 || result.rows[0].cart_id === null) {
            // If no cart or items exist, return a response indicating an empty cart
            return res.status(200).json({ message: 'Your cart is empty.' });
        }

        const cartItems = result.rows.map(row => ({
            itemId: row.item_id,
            productId: row.product_id,
            productName: row.product_name,
            itemNumber: row.item_number,
            productDescription: row.product_description,
            unitPrice: row.unit_price,
            productPrice: row.product_price,
            quantity: row.quantity
        }));

        let cartQuantity = 0;
        let cartTotal = 0;
        
        for (const item of cartItems) {
            cartQuantity += Number(item.quantity);
            cartTotal += Number(item.productPrice); 
        }

        const cartData = {
            cartId: result.rows[0].cart_id,
            totalQuantity: cartQuantity,
            totalAmount: cartTotal,
            items: cartItems
        };

        res.status(200).json(cartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove an item from the cart
const removeItemFromCart = async (req, res) => {
    const userId = req.user.id;
    const itemId = parseInt(req.params.itemId);

    if (isNaN(itemId)) {
        return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM cartitems WHERE id = $1 AND cart_id = (SELECT id FROM carts WHERE user_id = $2) RETURNING *',
            [itemId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found or not in your cart' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkout = async(req, res) => {
    
    const cartId = parseInt(req.params.cartId);

    try {
        
        const cartResult = await pool.query(
            `SELECT cartitems.product_id, cartitems.quantity,
                    products.description as product_name, products.item_number as item_number, 
                    CASE
                        WHEN cartitems.quantity >= products.qty3 THEN (products.price3 * cartitems.quantity)
                        WHEN cartitems.quantity >= products.qty2 THEN (products.price2 * cartitems.quantity)
                        ELSE (products.price1 * cartitems.quantity)
                    END as product_price
             FROM cartitems 
             LEFT JOIN products ON cartitems.product_id = products.id
             WHERE cartitems.cart_id = $1`,
            [cartId]
        );

        if (cartResult.rows.length === 0) {
            // If no cart or items exist, return a response indicating an empty cart
            return res.status(200).json({ message: 'Your cart is empty.' });
        }

        const cartItems = cartResult.rows.map(row => ({
            productId: row.product_id,
            productName: row.product_name,
            productDescription: row.item_number,
            productPrice: parseFloat(row.product_price),
            quantity: row.quantity
        }));

        let total = 0;
        for (const item of cartItems) {
            total += Number(item.productPrice);
        }

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
            capture_method: 'manual',
        });

        res.status(201).json({ 
            message: 'Awaiting card confirmation', 
            total: total,
            //orderId, 
            clientSecret: paymentIntent.client_secret, // Pass this to the front-end
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const finalizeOrder = async (req, res) => {
    const userId = req.user.id;
    const { paymentIntentId } = req.body;
    const cartId = parseInt(req.params.cartId);

    try {
        // Optionally, retrieve the PaymentIntent to ensure its status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'requires_capture') {
            return res.status(400).json({ error: 'Payment not successful.' });
        }

        const cartResult = await pool.query(
                `SELECT cartitems.product_id, cartitems.quantity,
                        products.description as product_name, products.item_number as item_number, 
                        CASE
                            WHEN cartitems.quantity >= products.qty3 THEN (products.price3 * cartitems.quantity)
                            WHEN cartitems.quantity >= products.qty2 THEN (products.price2 * cartitems.quantity)
                            ELSE (products.price1 * cartitems.quantity)
                        END as product_price
                 FROM cartitems 
                 LEFT JOIN products ON cartitems.product_id = products.id
                 WHERE cartitems.cart_id = $1`,
                [cartId]
        );
    
        if (cartResult.rows.length === 0) {
                // If no cart or items exist, return a response indicating an empty cart
                return res.status(200).json({ message: 'Your cart is empty.' });
        }
    
        const cartItems = cartResult.rows.map(row => ({
                productId: row.product_id,
                productName: row.product_name,
                productDescription: row.item_number,
                productPrice: parseFloat(row.product_price),
                quantity: row.quantity
        }));
    
        let total = 0;
        for (const item of cartItems) {
                total += Number(item.productPrice);
        }
    
        const orderResult = await pool.query(
                `INSERT INTO orders (user_id, total, status)
                VALUES ($1, $2, 'pending') RETURNING id`, 
                [userId, total]
        );
    
        const orderId = orderResult.rows[0].id;
    
        for (const item of cartItems) {
                await pool.query(
                    `INSERT INTO orderitems (order_id, product_id, quantity, price)
                    VALUES ($1, $2, $3, $4)`,
                    [orderId, item.productId, item.quantity, item.productPrice]
                );
        }
    
        await pool.query(
                `DELETE FROM cartitems WHERE cart_id = $1`,
                [cartId]
        );

       

        res.status(200).json({ success: true, orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addItemToCart,
    getCart,
    removeItemFromCart,
    checkout,
    finalizeOrder
};

