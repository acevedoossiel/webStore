import React from "react";
import { motion } from "framer-motion";
import styles from "./CartSidebar.module.css";
import { useCart } from "../contexts/CartContext";

const getPriceWithPromotion = (price, productId, cartItems, promotions) => {
    if (!promotions || promotions.length === 0) return price;

    const totalQuantity = cartItems
        .filter(item => item.id === productId)
        .reduce((sum, item) => sum + item.quantity, 0);

    const applicablePromotion = promotions
        .filter(promo => totalQuantity >= promo.quantity)
        .sort((a, b) => b.quantity - a.quantity)[0];

    return applicablePromotion ? applicablePromotion.price : price;
};

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, getTotalItems, incrementItemQuantity, decrementItemQuantity } = useCart();
    const totalQuantity = getTotalItems();

    const totalPrice = cartItems.reduce((total, item) =>
        total + getPriceWithPromotion(item.price, item.id, cartItems, item.promotions) * item.quantity, 0);

    const handleCheckout = () => {
        let message = "¡Hola! Quiero hacer un pedido:\n\n";
        cartItems.forEach(item => {
            message += `Producto: ${item.name}\n`;
            message += `Sabor: ${item.flavor}\n`;
            message += `Precio unitario: ${getPriceWithPromotion(item.price, item.id, cartItems, item.promotions).toFixed(2)} MX\n`;
            message += `Cantidad: ${item.quantity}\n`;
            const itemTotal = getPriceWithPromotion(item.price, item.id, cartItems, item.promotions) * item.quantity;
            message += `Precio total: $${itemTotal.toFixed(2)}\n\n`;
        });
        message += `Precio total del pedido: $${totalPrice.toFixed(2)}\n\nGracias por su atención!`;

        const encodedMessage = encodeURIComponent(message);

        const phoneNumber = "46513"; // Reemplaza con el número de teléfono real

        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.location.href = whatsappLink;
    };

    return (
        <motion.div
            className={styles.cartSidebar}
            initial={{ x: "100%" }}
            animate={{ x: isOpen ? 0 : "100%" }}
            transition={{ duration: 0.3 }}
        >
            <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Cerrar carrito"
            >
                ✖
            </button>
            <h2 className={styles.title}>Carrito de Compras</h2>

            {cartItems.length === 0 ? (
                <p className={styles.emptyCart}>Tu carrito está vacío.</p>
            ) : (
                <ul className={styles.cartList}>
                    {cartItems.map((item) => (
                        <li key={`${item.id}-${item.flavor}`} className={styles.cartItem}>
                            <img
                                src={`${process.env.REACT_APP_API_URL}${item.image}`}
                                alt={item.name}
                                className={styles.itemImage}
                            />
                            <div className={styles.itemDetails}>
                                <p className={styles.itemName}>{item.name}</p>
                                <p className={styles.itemName}>{item.flavor}</p>
                                <div className={styles.itemPrice}>
                                    {item.promotions && item.promotions.length > 0 && totalQuantity >= item.promotions[0].quantity ? (
                                        <>
                                            <span className={styles.originalPrice}>
                                                ${item.price.toFixed(2)}
                                            </span>
                                            <span className={styles.discountedPrice}>
                                                ${getPriceWithPromotion(item.price, item.id, cartItems, item.promotions).toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className={styles.price}>${item.price.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className={styles.itemQuantityContainer}>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => decrementItemQuantity(item.id, item.flavor)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <p className={styles.itemQuantity}>Cantidad: {item.quantity}</p>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => incrementItemQuantity(item.id, item.flavor)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className={styles.removeButton}
                                    onClick={() => removeFromCart(item.id, item.flavor)}
                                    aria-label={`Eliminar ${item.name} del carrito`}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {cartItems.length > 0 && (
                <>
                    <div className={styles.totalPrice}>
                        <span>Total: ${totalPrice.toFixed(2)} MX</span>
                        <br />
                        <span>Total de Productos: {totalQuantity}</span>
                    </div>
                    <button
                        className={styles.checkoutButton}
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                    >
                        Ir a Pagar
                    </button>
                </>
            )}
        </motion.div>
    );
};

export default CartSidebar;
