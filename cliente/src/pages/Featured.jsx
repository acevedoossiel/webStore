import React, { useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './Featured.module.css';

const Featured = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/featured`);
                if (!response.ok) {
                    throw new Error('Error al obtener productos destacados');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError('Error al obtener los productos destacados');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const goBack = () => {
        navigate(-1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.FeaturedContainer}>
            <button className={styles.goBackButton} onClick={goBack}>
                <AiOutlineArrowLeft size={24} /> Volver
            </button>
            <h1>Productos destacados 🔥</h1>
            <div className={styles.productList}>
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className={styles.productCard}>
                            <Link to={`/product/${product._id}`}>
                                <img
                                    src={`${product.srcImage[0]}`}
                                    alt={product.modelo}
                                />
                                <h3>{product.brand} {product.modelo} {product.capacity}</h3>
                                <p>MX ${product.price}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron productos destacados.</p>
                )}
            </div>
        </div>
    );
};

export default Featured;
