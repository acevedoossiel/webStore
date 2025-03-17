import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Promotions.module.css';

const Promotions = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/promotion`);
                if (!response.ok) {
                    throw new Error('Error al obtener productos en promocion');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError('Error al obtener los productos en promocion');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Loading...</p>; 
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.FeaturedContainer}>
            <h1>🎉 Productos en promoción 🎉</h1>
            <div className={styles.productList}>
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className={styles.productCard}>
                            <Link to={`/product/${product._id}`}>
                                <div className={styles.imageContainer}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${product.srcImage[0]}`}
                                        alt={product.modelo}
                                    />
                                    <div className={styles.offerBadge}>
                                        <img src="/assets/images/logos/oferta.png" alt="Oferta especial" />
                                    </div>
                                </div>
                                <h3>{product.brand} {product.modelo} {product.capacity}</h3>
                                <p>MX ${product.price}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron productos en promoción.</p>
                )}
            </div>
        </div>
    );
};

export default Promotions;
