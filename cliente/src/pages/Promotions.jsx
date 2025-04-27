import React, { useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './Promotions.module.css';

const Promotions = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
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

            <h1>🎉 Productos en promoción 🎉</h1>
            <div className={styles.productList}>
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className={styles.productCard}>
                            <Link to={`/product/${product._id}`}>
                                <div className={styles.imageContainer}>
                                    <img
                                        src={`${product.srcImage[0]}`}
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
