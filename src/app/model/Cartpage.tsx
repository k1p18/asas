// "use client";

// import React, { useState } from "react";

// const initialItems = [
//   {
//     name: "Laptop",
//     model: "XPS 13",
//     hsCode: "847130",
//     quantity: 1,
//     weight: 2.5,
//     perPieceRate: 999.99,
//     totalPrice: 999.99,
//     color: "Silver",
//     deliveryMethod: "Air",
//     description: "A powerful and lightweight laptop with excellent performance.",
//     isEditingDescription: false,
//     originalDescription: "",
//     showDescription: false,
//     image: "https://source.unsplash.com/random/150x150?laptop"
//   },
//   {
//     name: "Smartphone",
//     model: "iPhone 14",
//     hsCode: "851712",
//     quantity: 2,
//     weight: 0.5,
//     perPieceRate: 799.99,
//     totalPrice: 1599.98,
//     color: "Black",
//     deliveryMethod: "Ship",
//     description: "The latest iPhone with advanced camera and processing power.",
//     isEditingDescription: false,
//     originalDescription: "",
//     showDescription: false,
//     image: "https://source.unsplash.com/random/150x150?smartphone"
//   }
// ];

// export default function CartPage1() {
//   const [cartItems, setCartItems] = useState(initialItems);
//   const [shippingMethod, setShippingMethod] = useState("standard");
//   const [promoCode, setPromoCode] = useState("");
//   const [promoMessage, setPromoMessage] = useState("");
//   const [promoValid, setPromoValid] = useState(false);
//   const [discount, setDiscount] = useState(0);

//   const removeItem = (index) => {
//     if (confirm("Are you sure you want to remove this item?")) {
//       const updated = [...cartItems];
//       updated.splice(index, 1);
//       setCartItems(updated);
//     }
//   };

//   const clearCart = () => {
//     if (confirm("Are you sure you want to clear your cart?")) {
//       setCartItems([]);
//     }
//   };

//   const incrementQuantity = (index) => {
//     const updated = [...cartItems];
//     updated[index].quantity++;
//     updated[index].totalPrice = updated[index].quantity * updated[index].perPieceRate;
//     setCartItems(updated);
//   };

//   const decrementQuantity = (index) => {
//     const updated = [...cartItems];
//     if (updated[index].quantity > 1) {
//       updated[index].quantity--;
//       updated[index].totalPrice = updated[index].quantity * updated[index].perPieceRate;
//       setCartItems(updated);
//     }
//   };

//   const applyPromoCode = () => {
//     const promoCodes = {
//       SAVE10: { discount: 0.1, message: "10% discount applied!" },
//       FREESHIP: { discount: 0, message: "Free shipping applied!", freeShipping: true },
//       WELCOME20: { discount: 0.2, message: "20% discount applied!" }
//     };

//     if (promoCode.trim() === "") {
//       setPromoMessage("Please enter a promo code");
//       setPromoValid(false);
//       return;
//     }

//     const promo = promoCodes[promoCode.toUpperCase()];
//     if (promo) {
//       setPromoValid(true);
//       setPromoMessage(promo.message);
//       if (promo.discount) {
//         setDiscount(subtotal * promo.discount);
//       }
//     } else {
//       setPromoValid(false);
//       setPromoMessage("Invalid promo code");
//       setDiscount(0);
//     }
//   };

//   const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

//   const shippingCost = {
//     standard: 5,
//     express: 15,
//     overnight: 25
//   }[shippingMethod] || 5;

//   const calculateTax = () => (subtotal - discount) * 0.075;

//   const total = subtotal + shippingCost + calculateTax() - discount;

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
//         <div className="bg-blue-600 text-white px-3 py-1 rounded-full">
//           🛒 {cartItems.length} items
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//         <div className="md:col-span-2">
//           <div className="flex gap-4 mb-6">
//             <button
//               onClick={clearCart}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//             >
//               Clear Cart
//             </button>
//             <button
//               onClick={() => window.location.href = "/"}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
//             >
//               Continue Shopping
//             </button>
//           </div>

//           {cartItems.map((item, index) => (
//             <div key={index} className="flex items-center border-b py-4 gap-4">
//               <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
//               <div className="flex-1">
//                 <div className="font-semibold text-gray-800">{item.name}</div>
//                 <div className="text-sm text-gray-500">Model: {item.model}</div>
//                 <div className="text-sm text-gray-500">Color: {item.color}</div>
//                 <div className="text-sm text-gray-500">Delivery: {item.deliveryMethod}</div>
//                 <div className="text-sm text-gray-500">HS Code: {item.hsCode}</div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button onClick={() => decrementQuantity(index)} className="px-2 py-1 bg-gray-200 rounded">-</button>
//                 <span>{item.quantity}</span>
//                 <button onClick={() => incrementQuantity(index)} className="px-2 py-1 bg-gray-200 rounded">+</button>
//               </div>
//               <div className="w-24 text-right font-medium">${item.totalPrice.toFixed(2)}</div>
//               <button onClick={() => removeItem(index)} className="text-red-500 ml-4">Remove</button>
//             </div>
//           ))}
//         </div>

//         <div className="md:col-span-1">
//           <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>

//             <div className="space-y-3 mb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-medium">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span className="font-medium">${shippingCost.toFixed(2)}</span>
//               </div>
//               {discount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Discount</span>
//                   <span className="font-medium">-${discount.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between text-gray-600">
//                 <span>Tax</span>
//                 <span className="font-medium">${calculateTax().toFixed(2)}</span>
//               </div>
//               <div className="border-t pt-3 mt-3">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <button
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
//               disabled={cartItems.length === 0}
//             >
//               <i className="fas fa-lock mr-2" /> Proceed to Checkout
//             </button>

//             <div className="mt-6">
//               <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
//               <select
//                 value={shippingMethod}
//                 onChange={(e) => setShippingMethod(e.target.value)}
//                 className="w-full border rounded p-2"
//               >
//                 <option value="standard">Standard ($5)</option>
//                 <option value="express">Express ($15)</option>
//                 <option value="overnight">Overnight ($25)</option>
//               </select>
//             </div>

//             <div className="mt-6">
//               <h3 className="text-lg font-semibold mb-2">Promo Code</h3>
//               <div className="flex">
//                 <input
//                   type="text"
//                   value={promoCode}
//                   onChange={(e) => setPromoCode(e.target.value)}
//                   placeholder="Enter promo code"
//                   className="flex-grow border rounded-l p-2"
//                 />
//                 <button
//                   onClick={applyPromoCode}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
//                 >
//                   Apply
//                 </button>
//               </div>
//               {promoMessage && (
//                 <p className={`mt-2 text-sm ${promoValid ? "text-green-600" : "text-red-600"}`}>
//                   {promoMessage}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/context/CartContext";

const CartPage1 = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce(
    (total: number, item: CartItem) => total + item.totalCost * item.quantity,
    0
  );

  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Shopping Cart</h1>

        {/* Continue Shopping & Clear */}
        {cartItems.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
              <span className="mr-2">←</span> Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-red-600 hover:text-red-800">
              🗑️ Clear Cart
            </button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cartItems.map((item: CartItem, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4 grid sm:grid-cols-[120px_1fr] gap-4"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="object-contain w-full h-full rounded"
                  />
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-slate-800">{item.name}</h2>
                    <p className="text-sm text-gray-600">Material: {item.material}</p>
                    <p className="text-sm text-gray-600">Color: {item.color}</p>
                    <p className="text-sm text-gray-600">Volume: {item.volume}</p>
                    <p className="text-sm text-gray-600">Weight: {item.weight}</p>
                    <p className="text-sm text-gray-600">Print Time: {item.printTime}</p>
                    <p className="text-sm text-gray-600">Cost: ₹{item.totalCost.toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-sm text-gray-700">Qty:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.name, parseInt(e.target.value))
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeFromCart(item.name)}
                        className="text-red-500 hover:text-red-700 ml-auto text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="cursor-pointer w-full mt-6 bg-black text-white py-3 px-6 rounded-full hover:bg-gray-900"
                onClick={() => alert("Checkout coming soon")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage1;
