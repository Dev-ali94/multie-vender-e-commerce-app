import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export const CartProvider  = ({ children }) => {
    const [storeSlug, setStoreSlug] = useState("");
    const [cart, setCart] = useState([]);

    // Sync with localStorage when storeSlug changes
    useEffect(() => {
        if (!storeSlug) return;
        try {
            const saved = localStorage.getItem(`storeifly_cart_${storeSlug}`);
            if (saved) {
                setCart(JSON.parse(saved));
            } else {
                setCart([]);
            }
        } catch {
            setCart([]);
        }
    }, [storeSlug]);

    // Save to localStorage
    useEffect(() => {
        if (!storeSlug) return;
        localStorage.setItem(`storeifly_cart_${storeSlug}`, JSON.stringify(cart));
    }, [cart, storeSlug]);

    const addToCart = (item) => {
        setCart((prev) => {
            const existingIndex = prev.findIndex((i) => i.productId === item.productId && i.variant === item.variant);
            if (existingIndex > -1) {
                const updated = [...prev];
                const newQty = Math.min(updated[existingIndex].quantity + item.quantity, item.stock);
                updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
                return updated;
            } else {
                return [...prev, item];
            }
        });
    };

    const updateQuantity = (productId, variant, delta) => {
        setCart((prev) => {
            return prev
                .map((item) => {
                    if (item.productId === productId && item.variant === variant) {
                        const newQty = item.quantity + delta;
                        if (newQty <= 0) return null;
                        return { ...item, quantity: Math.min(newQty, item.stock) };
                    }
                    return item;
                })
                .filter(Boolean);
        });
    };

    const removeFromCart = (productId, variant) => {
        setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variant === variant)));
    };

    const clearCart = () => {
        setCart([]);
        if (storeSlug) {
            localStorage.removeItem(`storeifly_cart_${storeSlug}`);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                subtotal,
                itemsCount,
                storeSlug,
                setStoreSlug,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
