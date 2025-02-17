import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el producto');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError('Error al obtener el producto');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p className={styles.loading}>Cargando...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.productDetailContainer}>
            {product && (
                <div className={styles.productDetail}>
                    {/* Carrusel de imágenes */}
                    <div className={styles.imageContainer}>
                        <Swiper
                            navigation={true}
                            modules={[Navigation]}
                            className={styles.swiperContainer}
                        >
                            {product.srcImage.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${img}`}
                                        alt={`${product.modelo} ${index}`}
                                        className={styles.productImage}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Información del producto */}
                    <div className={styles.productInfo}>
                        <h1>{product.brand} {product.modelo} {product.capacity}</h1>
                        <p className={styles.price}><strong>MX ${product.price}</strong></p>
                        <p className={styles.description}>{product.description}</p>

                        {/* Sabores en escalera */}
                        <h2>Sabor:</h2>
                        <div className={styles.flavorsContainer}>
                            {product.flavors.map((flavor, index) => (
                                <span key={index} className={`${styles.flavor} ${index % 2 === 0 ? styles.flavorLeft : styles.flavorRight}`}>
                                    {flavor}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para ver la imagen en grande */}
            {selectedImage && (
                <div className={styles.modal} onClick={() => setSelectedImage(null)}>
                    <div className={styles.modalContent}>
                        <img src={`${process.env.REACT_APP_API_URL}${selectedImage}`} alt="Producto ampliado" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
