"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  model: string;
  hsCode: string;
  volume: string;
  material: string;
  color: string;
  printTime: string;
  weight: string;
  dimensions: string;
  infill: number;
  totalCost: number;
  quantity: number;
  perPieceRate: number;
  deliveryMethod: string;
  description: string;
  showDescription: boolean;
  isEditingDescription: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    item: Omit<CartItem, "id" | "showDescription" | "isEditingDescription">
  ) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  toggleDescription: (id: string) => void;
  startEditingDescription: (id: string) => void;
  cancelEditingDescription: (id: string) => void;
  saveDescription: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    item: Omit<CartItem, "id" | "showDescription" | "isEditingDescription">
  ) => {
    const newItem: CartItem = {
      ...item,
      id: uuidv4(),
      showDescription: false,
      isEditingDescription: false,
    };
    setCartItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const setQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              totalCost: item.perPieceRate * quantity,
            }
          : item
      )
    );
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const toggleDescription = (id: string) => {
    updateCartItem(id, {
      showDescription: !cartItems.find((item) => item.id === id)
        ?.showDescription,
    });
  };

  const startEditingDescription = (id: string) => {
    updateCartItem(id, { isEditingDescription: true });
  };

  const cancelEditingDescription = (id: string) => {
    updateCartItem(id, { isEditingDescription: false });
  };

  const saveDescription = (id: string) => {
    updateCartItem(id, { isEditingDescription: false });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        setQuantity,
        updateCartItem,
        toggleDescription,
        startEditingDescription,
        cancelEditingDescription,
        saveDescription,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// "use client";
// // App/context/CartContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from "react";

// interface CartItem {
//   name: string;
//   volume: string;
//   dimensions: string;
//   weight: string;
//   printTime: string;
//   totalCost: string;
//   color: string;
//   material: string;
//   image: string;
//   quantity: number;
// }

// interface CartContextProps {
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (name: string) => void;
//   updateQuantity: (name: string, delta: number) => void;
// }

// const CartContext = createContext<CartContextProps | undefined>(undefined);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within CartProvider");
//   return context;
// };

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // const addToCart = (item: CartItem) => {
//   //   setCart((prev) => [...prev, item]);
//   // };

//   const addToCart = (item: CartItem) => {
//     const cleanCost = parseFloat(item.totalCost.replace(/[^\d.]/g, ""));
//     const cost = isNaN(cleanCost) ? "0.00" : cleanCost.toFixed(2);

//     setCart((prev) => [
//       ...prev,
//       {
//         ...item,
//         totalCost: cost,

//       },
//     ]);
//   };

//   const removeFromCart = (name: string) => {
//     setCart((prev) => prev.filter((item) => item.name !== name));
//   };

//   const updateQuantity = (name: string, delta: number) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.name === name
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };
//   // const updateQuantity = (name: string, delta: number) => {
//   //   setCart((prev) =>
//   //     prev.map((item) =>
//   //       item.name === name
//   //         ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//   //         : item
//   //     )
//   //   );
//   // };

//   return (
//     <CartContext.Provider
//       value={{ cart, addToCart, removeFromCart, updateQuantity }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// context/CartContext.tsx

// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";

// export interface CartItem {
//   id: string;
//   name: string;
//   image: string;
//   material: string;
//   color: string;
//   printTime: string;
//   weight: string;
//   dimensions: string;
//   infill: number;
//   totalCost: number;
//   quantity: number;
//   volume: string;
//   hsCode?: string;
//   model?: string;
//   deliveryMethod?: string;
//   perPieceRate?: number;
//   description?: string;
//   originalDescription?: string;
//   isEditingDescription?: boolean;
//   showDescription?: boolean;
// }

// export interface CartContextType {
//   cartItems: CartItem[]; // ✅ Needed
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   setQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void; // ✅ Needed
// }

// // interface CartContextType {
// //   cart: CartItem[];
// //   addToCart: (item: CartItem) => void;
// //   updateQuantity: (name: string, delta: number) => void;
// //   removeFromCart: (name: string) => void;
// // }

// export const CartContext = createContext<CartContextType>({
//   cartItems: [],
//   addToCart: () => {},
//   removeFromCart: () => {},
//   updateQuantity: () => {},
//   setQuantity: () => {},
//   clearCart: () => {},
// });

// // const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const setQuantity = (id: string, quantity: number) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
//       )
//     );
//   };

//   const addToCart = (item: CartItem) => {
//     setCart((prev) => {
//       const existingItem = prev.find((i) => i.id === item.id);
//       if (existingItem) {
//         return prev.map((i) =>
//           i.id === item.id
//             ? { ...i, quantity: i.quantity + (item.quantity || 1) }
//             : i
//         );
//       }
//       return [...prev, { ...item, quantity: item.quantity || 1 }];
//     });
//   };

//   const updateQuantity = (id: string, delta: number) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

//   const removeFromCart = (id: string) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const clearCart = () => setCart([]);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems: cart,
//         addToCart,
//         updateQuantity,
//         removeFromCart,
//         setQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };
