"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image || "",
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}