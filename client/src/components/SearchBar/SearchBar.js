import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../redux/products/productsSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './SearchBar.module.css';

const SearchBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            dispatch(searchProducts(searchTerm));
            navigate(`search/${searchTerm}`);
        } 
    };

    return (
        <form onSubmit={handleSearch} className={styles.searchContainer} >
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
            />
            <button type="submit" className={styles.searchButton} >
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </form>
    );
};

export default SearchBar;