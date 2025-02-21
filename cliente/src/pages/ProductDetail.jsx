import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlavor, setSelectedFlavor] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el producto');
                }
                const data = await response.json();
                setProduct(data);
                if (Array.isArray(data.srcImage) && data.srcImage.length > 0) {
                    setSelectedImage(data.srcImage[0]);
                }
            } catch (err) {
                setError('Error al obtener el producto');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    }, [isModalOpen]);

    const getImageUrl = (img) => `${process.env.REACT_APP_API_URL}${img}`;

    const handleFlavorClick = (flavor) => {
        setSelectedFlavor(flavor === selectedFlavor ? null : flavor);
    };

    if (loading) return <p className={styles.loading}>Cargando...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.productDetailContainer}>
            {product && (
                <div className={styles.productDetail}>
                    <div className={styles.imageContainer} onClick={() => setIsModalOpen(true)}>
                        {selectedImage && (
                            <Swiper spaceBetween={10} navigation pagination={{ clickable: true }}>
                                {product.srcImage.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={getImageUrl(img)} alt={`Producto ${index}`} className={styles.productImage} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    <div className={styles.productInfo}>
                        <h1>{product.brand} {product.modelo} {product.capacity}</h1>
                        <p className={styles.price}><strong>MX ${product.price}</strong></p>
                        <p className={styles.description}>{product.description}</p>

                        <h2>Sabor:</h2>
                        <div className={styles.flavorsContainer}>
                            {product.flavors.map((flavor, index) => (
                                <button
                                    key={index}
                                    className={`${styles.flavor} ${selectedFlavor === flavor ? styles.selected : ''}`}
                                    onClick={() => handleFlavorClick(flavor)}
                                >
                                    {flavor}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>✖</button>
                        <Swiper spaceBetween={10} navigation pagination={{ clickable: true }}>
                            {product.srcImage.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img src={getImageUrl(img)} alt={`Producto ${index}`} className={styles.productImage} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
