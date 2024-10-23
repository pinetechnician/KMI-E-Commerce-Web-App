const pool = require('../config/database'); // assuming you have a db.js file that sets up your pg Pool

// Get all products, optionally filter by category
const getProducts = (req, res) => {
  const categoryId = req.query.category;
  let query = `
    SELECT 
      products.*, 
      COALESCE(
        json_agg(
          json_build_object(
            'image_url', product_images.image_url,
            'image_type', product_images.image_type
          )
        ) FILTER (WHERE product_images.image_url IS NOT NULL), 
        '[]'
      ) AS images
    FROM products
    LEFT JOIN product_images ON products.item_number = product_images.item_number
  `;

  const params = [];

  // Add category filtering if provided
  if (categoryId) {
    query += `
      JOIN product_categories AS pc ON products.id = pc.product_id 
      JOIN categories AS ct ON pc.category_id = ct.id 
      WHERE ct.id = $1
    `;
    params.push(categoryId);
  }

  // Add GROUP BY to aggregate the images for each product
  query += `
    GROUP BY products.id
  `;

  pool.query(query, params, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
};

// Get a single product by ID
const getProductById = (req, res) => {
  const productId = parseInt(req.params.productId);

  pool.query('SELECT * FROM products WHERE id = $1', [productId], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const searchProducts = async (req, res) => {
  const searchQuery = req.query.searchQuery || '';
  
  try {
      // Perform SQL query to search by description or item number
      const result = await pool.query(
        `SELECT * FROM products WHERE description ILIKE $1 OR item_number ILIKE $1`, 
        [`%${searchQuery}%`]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No products found.' });
      }

      res.status(200).json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
};
