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
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [quantity, setQuantity] = useState(1); // Nuevo estado para la cantidad

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

    const handleQuantityChange = (value) => {
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const addToCart = () => {
        if (selectedFlavor) {
            console.log(`Producto seleccionado: nombre:${product.brand} ${product.modelo} ${product.capacity},
                sabor: ${selectedFlavor},
                cantidad: ${quantity},
                precio total: MX $${(product.price * quantity).toFixed(2)}`);
        } else {
            console.log('Por favor, selecciona un sabor.');
        }
    };

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

                        {/* Sabores */}
                        <div className={styles.quantityContainer}>
                        <span>Sabor:</span>
                        </div>
                        <div className={styles.flavorsContainer}>
                            {product.flavors.map((flavor, index) => (
                                <button
                                    key={index}
                                    className={styles.flavorButton}
                                    onClick={() => setSelectedFlavor(flavor)}
                                    style={{
                                        background: selectedFlavor === flavor ? '#00517D' : '#00AEF2'
                                    }}
                                >
                                    {flavor}
                                </button>
                            ))}
                        </div>

                        {/* Selector de cantidad */}
                        <div className={styles.quantityContainer}>
                            <span>Cantidad:</span>
                            <div className={styles.quantitySelector}>
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className={styles.quantityInput}
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                    min="1"
                                />
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <br />
                        <button className={styles.addToCartButton} onClick={addToCart}>
                            Agregar al carrito
                        </button>
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
