import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState({ price: 0, quantity: 0 });

    const addProduct = (product) => {
        setTotal({ price: total.price + product.price, quantity: total.quantity + 1 });
        const isInCart = cart.some((item) => item.id === product.id);
        if (isInCart) {
            setCart(
                cart.map((item) =>
                    item.id === product.id ? { ...item, count: item.count + 1 } : item
                )
            );
        }
        if (!isInCart) {
            setCart([...cart, { ...product, count: 1 }]);
        }
    };

    const removeProduct = (product) => {
        const productIndex = cart.findIndex((item) => item.id === product.id);
        if (cart[productIndex].count !== 0) {
            setTotal({ price: total.price - product.price, quantity: total.quantity - 1 });
            setCart(
                cart.map((item) =>
                    item.id === product.id && item.count !== 1
                        ? { ...item, count: item.count - 1 }
                        : item
                )
            );
        }
        if (cart[productIndex].count === 1) {
            deleteProduct(product);
        }
    };

    const deleteProduct = (product) => {
        setCart(cart.filter((item) => item.id !== product.id));
    };

    return (
        <CartContext.Provider value={{ cart, total, addProduct, deleteProduct, removeProduct }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);