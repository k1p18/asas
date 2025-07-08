// "use client"; // This directive makes the component a Client Component in Next.js App Router

// import { useState, useMemo, useEffect } from "react";
// import Head from "next/head"; // For managing document head elements

// interface CartItem {
//   name: string;
//   model: string;
//   hsCode: string;
//   quantity: number;
//   weight: number;
//   perPieceRate: number;
//   totalPrice: number;
//   color: string;
//   deliveryMethod: string;
//   description: string;
//   isEditingDescription: boolean;
//   originalDescription: string;
//   showDescription: boolean;
//   image: string;
// }

// export default function CartPage2() {
//   const [cartItems, setCartItems] = useState([
//     {
//       name: "Laptop",
//       model: "XPS 13",
//       hsCode: "847130",
//       quantity: 1,
//       weight: 2.5,
//       perPieceRate: 999.99,
//       totalPrice: 999.99,
//       color: "Silver",
//       deliveryMethod: "Air",
//       description:
//         "A powerful and lightweight laptop with excellent performance.",
//       isEditingDescription: false,
//       originalDescription: "",
//       showDescription: false,
//       image: "https://via.placeholder.com/150",
//     },
//     {
//       name: "Smartphone",
//       model: "iPhone 14",
//       hsCode: "851712",
//       quantity: 2,
//       weight: 0.5,
//       perPieceRate: 799.99,
//       totalPrice: 1599.98,
//       color: "Black",
//       deliveryMethod: "Ship",
//       description:
//         "The latest iPhone with advanced camera and processing power.",
//       isEditingDescription: false,
//       originalDescription: "",
//       showDescription: false,
//       image: "https://via.placeholder.com/150",
//     },
//   ]);

//   const [shippingMethod, setShippingMethod] = useState("standard");

//   const getColorHex = (color: string): string => {
//     const colorMap: Record<string, string> = {
//       Black: "#000000",
//       Silver: "#C0C0C0",
//       Blue: "#0047AB",
//       Red: "#FF0000",
//       White: "#FFFFFF",
//     };
//     return colorMap[color] || "#000000";
//   };

//   const updateCartItem = (index: number, updates: Partial<CartItem>) => {
//     setCartItems((prevItems) => {
//       const newItems = [...prevItems];
//       newItems[index] = { ...newItems[index], ...updates };
//       return newItems;
//     });
//   };

//   const removeItem = (index: number) => {
//     if (window.confirm("Are you sure you want to remove this item?")) {
//       setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
//     }
//   };

//   const clearCart = () => {
//     if (window.confirm("Are you sure you want to clear your cart?")) {
//       setCartItems([]);
//     }
//   };

//   const incrementQuantity = (index: number) => {
//     const item = cartItems[index];
//     updateCartItem(index, {
//       quantity: item.quantity + 1,
//       totalPrice: item.perPieceRate * (item.quantity + 1),
//     });
//   };

//   const decrementQuantity = (index: number) => {
//     const item = cartItems[index];
//     if (item.quantity > 1) {
//       updateCartItem(index, {
//         quantity: item.quantity - 1,
//         totalPrice: item.perPieceRate * (item.quantity - 1),
//       });
//     }
//   };

//   const handleQuantityChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     const newQuantity = parseInt(e.target.value, 10);
//     if (!isNaN(newQuantity) && newQuantity >= 1) {
//       updateCartItem(index, {
//         quantity: newQuantity,
//         totalPrice: cartItems[index].perPieceRate * newQuantity,
//       });
//     }
//   };

//   const toggleDescription = (index: number) => {
//     updateCartItem(index, {
//       showDescription: !cartItems[index].showDescription,
//     });
//   };

//   const startEditingDescription = (index: number) => {
//     updateCartItem(index, {
//       originalDescription: cartItems[index].description,
//       isEditingDescription: true,
//     });
//   };

//   const saveDescription = (index: number) => {
//     updateCartItem(index, { isEditingDescription: false });
//     console.log(`Description updated for ${cartItems[index].name}`);
//   };

//   const cancelEditingDescription = (index: number) => {
//     updateCartItem(index, {
//       description: cartItems[index].originalDescription,
//       isEditingDescription: false,
//     });
//   };

//   const subtotal = useMemo(() => {
//     return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
//   }, [cartItems]);

//   const shippingCost = useMemo(() => {
//     const shippingRates: Record<string, number> = {
//       standard: 5,
//       express: 15,
//       overnight: 25,
//     };

//     return shippingRates[shippingMethod] || 5;
//   }, [shippingMethod]);

//   const calculateTax = useMemo(() => {
//     return subtotal * 0.075;
//   }, [subtotal]);

//   const total = useMemo(() => {
//     return subtotal + shippingCost + calculateTax;
//   }, [subtotal, shippingCost, calculateTax]);

//   return (
//     <div className="bg-gray-100 font-sans min-h-screen">
//       <Head>
//         <meta charSet="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Cart Page</title>
//         <script src="https://cdn.tailwindcss.com"></script>
//         <link
//           rel="stylesheet"
//           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
//         />
//       </Head>

//       <div className="container mx-auto p-4 max-w-6xl">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
//             Shopping Cart
//           </h1>
//           <div className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center">
//             <i className="fas fa-shopping-cart mr-2"></i>
//             <span>{cartItems.length}</span>{" "}
//             <span className="hidden sm:inline ml-1">items</span>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {cartItems.length === 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6 text-center">
//               <i className="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
//               <p className="text-xl text-gray-500">Your cart is empty</p>
//               <a
//                 href="#"
//                 className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Continue Shopping
//               </a>
//             </div>
//           )}

//           <div className="sm:hidden">
//             {cartItems.map((item, index) => (
//               <div
//                 key={`mobile-item-${index}`}
//                 className="bg-white rounded-lg shadow-md p-4 mb-4"
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex items-start space-x-3">
//                     <img
//                       src={item.image || "https://via.placeholder.com/80"}
//                       alt="Product"
//                       className="w-20 h-20 object-cover rounded"
//                     />
//                     <div>
//                       <h2 className="font-semibold text-lg">{item.name}</h2>
//                       <p className="text-sm text-gray-600">{item.model}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => removeItem(index)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <i className="fas fa-trash"></i>
//                   </button>
//                 </div>

//                 <div className="mt-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">HS Code:</span>
//                     <span>{item.hsCode}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Color:</span>
//                     <div className="flex items-center">
//                       <select
//                         value={item.color}
//                         onChange={(e) =>
//                           updateCartItem(index, { color: e.target.value })
//                         }
//                         className="text-sm border rounded p-1"
//                       >
//                         <option value="Black">Black</option>
//                         <option value="Silver">Silver</option>
//                         <option value="Blue">Blue</option>
//                         <option value="Red">Red</option>
//                         <option value="White">White</option>
//                       </select>
//                       <div
//                         className="w-4 h-4 ml-2 rounded-full"
//                         style={{ backgroundColor: getColorHex(item.color) }}
//                       ></div>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Quantity:</span>
//                     <div className="flex items-center border rounded">
//                       <button
//                         onClick={() => decrementQuantity(index)}
//                         className="px-2 py-1 text-gray-500"
//                       >
//                         <i className="fas fa-minus text-xs"></i>
//                       </button>
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => handleQuantityChange(e, index)}
//                         min="1"
//                         className="w-12 text-center border-x"
//                       />
//                       <button
//                         onClick={() => incrementQuantity(index)}
//                         className="px-2 py-1 text-gray-500"
//                       >
//                         <i className="fas fa-plus text-xs"></i>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Weight:</span>
//                     <span>{item.weight} kg</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Delivery:</span>
//                     <select
//                       value={item.deliveryMethod}
//                       onChange={(e) =>
//                         updateCartItem(index, {
//                           deliveryMethod: e.target.value,
//                         })
//                       }
//                       className="text-sm border rounded p-1"
//                     >
//                       <option value="Air">Air</option>
//                       <option value="Ship">Ship</option>
//                       <option value="Express">Express</option>
//                     </select>
//                   </div>

//                   <div className="flex justify-between font-medium">
//                     <span>Price:</span>
//                     <span>${item.perPieceRate.toFixed(2)}</span>
//                   </div>

//                   <div className="flex justify-between font-bold">
//                     <span>Total:</span>
//                     <span>${item.totalPrice.toFixed(2)}</span>
//                   </div>

//                   <div className="pt-2 border-t mt-2">
//                     <button
//                       onClick={() => toggleDescription(index)}
//                       className="text-blue-600 text-sm flex items-center"
//                     >
//                       <span>
//                         {item.showDescription
//                           ? "Hide Description"
//                           : "Show Description"}
//                       </span>
//                       <i
//                         className={`fas ml-1 ${
//                           item.showDescription
//                             ? "fa-chevron-up"
//                             : "fa-chevron-down"
//                         }`}
//                       ></i>
//                     </button>

//                     {item.showDescription && (
//                       <div className="mt-2">
//                         {!item.isEditingDescription ? (
//                           <div>
//                             <p className="text-sm text-gray-600">
//                               {item.description}
//                             </p>
//                             <button
//                               onClick={() => startEditingDescription(index)}
//                               className="text-xs text-blue-600 mt-1"
//                             >
//                               <i className="fas fa-edit mr-1"></i> Edit
//                             </button>
//                           </div>
//                         ) : (
//                           <div>
//                             <textarea
//                               value={item.description}
//                               onChange={(e) =>
//                                 updateCartItem(index, {
//                                   description: e.target.value,
//                                 })
//                               }
//                               className="w-full text-sm border rounded p-2 mt-1"
//                               rows={3}
//                             ></textarea>
//                             <div className="flex justify-end space-x-2 mt-2">
//                               <button
//                                 onClick={() => cancelEditingDescription(index)}
//                                 className="text-xs px-2 py-1 border rounded"
//                               >
//                                 Cancel
//                               </button>
//                               <button
//                                 onClick={() => saveDescription(index)}
//                                 className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
//                               >
//                                 Save
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="hidden sm:block">
//             <div className="responsive-table">
//               {cartItems.length > 0 && (
//                 <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
//                   <thead className="bg-gray-50 text-gray-700">
//                     <tr>
//                       <th className="py-3 px-4 text-left">Product</th>
//                       <th className="py-3 px-4 text-left">Details</th>
//                       <th className="py-3 px-4 text-center">Quantity</th>
//                       <th className="py-3 px-4 text-right">Price</th>
//                       <th className="py-3 px-4 text-right">Total</th>
//                       <th className="py-3 px-4 text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cartItems.map((item, index) => (
//                       <>
//                         <tr
//                           key={`desktop-item-${index}`}
//                           className="border-t border-gray-200 hover:bg-gray-50 transition"
//                         >
//                           <td className="py-4 px-4">
//                             <div className="flex items-center space-x-3">
//                               <img
//                                 src={
//                                   item.image || "https://via.placeholder.com/80"
//                                 }
//                                 alt="Product"
//                                 className="w-16 h-16 object-cover rounded"
//                               />
//                               <div>
//                                 <h3 className="font-medium">{item.name}</h3>
//                                 <p className="text-sm text-gray-600">
//                                   {item.model}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   HS: {item.hsCode}
//                                 </p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4">
//                             <div className="space-y-2">
//                               <div className="flex items-center">
//                                 <span className="text-sm text-gray-600 mr-2">
//                                   Color:
//                                 </span>
//                                 <select
//                                   value={item.color}
//                                   onChange={(e) =>
//                                     updateCartItem(index, {
//                                       color: e.target.value,
//                                     })
//                                   }
//                                   className="text-sm border rounded p-1"
//                                 >
//                                   <option value="Black">Black</option>
//                                   <option value="Silver">Silver</option>
//                                   <option value="Blue">Blue</option>
//                                   <option value="Red">Red</option>
//                                   <option value="White">White</option>
//                                 </select>
//                                 <div
//                                   className="w-4 h-4 ml-2 rounded-full"
//                                   style={{
//                                     backgroundColor: getColorHex(item.color),
//                                   }}
//                                 ></div>
//                               </div>
//                               <div className="flex items-center">
//                                 <span className="text-sm text-gray-600 mr-2">
//                                   Delivery:
//                                 </span>
//                                 <select
//                                   value={item.deliveryMethod}
//                                   onChange={(e) =>
//                                     updateCartItem(index, {
//                                       deliveryMethod: e.target.value,
//                                     })
//                                   }
//                                   className={`text-sm border rounded p-1 ${
//                                     item.deliveryMethod === "Air"
//                                       ? "bg-blue-50 text-blue-800"
//                                       : item.deliveryMethod === "Ship"
//                                       ? "bg-green-50 text-green-800"
//                                       : item.deliveryMethod === "Express"
//                                       ? "bg-purple-50 text-purple-800"
//                                       : ""
//                                   }`}
//                                 >
//                                   <option value="Air">Air</option>
//                                   <option value="Ship">Ship</option>
//                                   <option value="Express">Express</option>
//                                 </select>
//                               </div>
//                               <div className="flex items-center">
//                                 <span className="text-sm text-gray-600 mr-2">
//                                   Weight:
//                                 </span>
//                                 <span className="text-sm">
//                                   {item.weight} kg
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => toggleDescription(index)}
//                                 className="text-xs text-blue-600 flex items-center mt-1"
//                               >
//                                 <span>
//                                   {item.showDescription
//                                     ? "Hide Description"
//                                     : "Show Description"}
//                                 </span>
//                                 <i
//                                   className={`fas ml-1 ${
//                                     item.showDescription
//                                       ? "fa-chevron-up"
//                                       : "fa-chevron-down"
//                                   }`}
//                                 ></i>
//                               </button>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4 text-center">
//                             <div className="flex items-center justify-center">
//                               <button
//                                 onClick={() => decrementQuantity(index)}
//                                 className="px-2 py-1 text-gray-500 border rounded-l"
//                               >
//                                 <i className="fas fa-minus text-xs"></i>
//                               </button>
//                               <input
//                                 type="number"
//                                 value={item.quantity}
//                                 onChange={(e) => handleQuantityChange(e, index)}
//                                 min="1"
//                                 className="w-12 text-center border-y"
//                               />
//                               <button
//                                 onClick={() => incrementQuantity(index)}
//                                 className="px-2 py-1 text-gray-500 border rounded-r"
//                               >
//                                 <i className="fas fa-plus text-xs"></i>
//                               </button>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4 text-right">
//                             <span className="font-medium">
//                               ${item.perPieceRate.toFixed(2)}
//                             </span>
//                           </td>
//                           <td className="py-4 px-4 text-right">
//                             <span className="font-bold">
//                               ${item.totalPrice.toFixed(2)}
//                             </span>
//                           </td>
//                           <td className="py-4 px-4 text-center">
//                             <button
//                               onClick={() => removeItem(index)}
//                               className="text-red-500 hover:text-red-700 p-1"
//                             >
//                               <i className="fas fa-trash"></i>
//                             </button>
//                           </td>
//                         </tr>
//                         {item.showDescription && (
//                           <tr
//                             key={`desktop-description-${index}`}
//                             className="bg-gray-50"
//                           >
//                             <td colSpan={6} className="py-3 px-6">
//                               {!item.isEditingDescription ? (
//                                 <div>
//                                   <p className="text-sm text-gray-700">
//                                     {item.description}
//                                   </p>
//                                   <button
//                                     onClick={() =>
//                                       startEditingDescription(index)
//                                     }
//                                     className="text-xs text-blue-600 mt-1"
//                                   >
//                                     <i className="fas fa-edit mr-1"></i> Edit
//                                     Description
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div>
//                                   <textarea
//                                     value={item.description}
//                                     onChange={(e) =>
//                                       updateCartItem(index, {
//                                         description: e.target.value,
//                                       })
//                                     }
//                                     className="w-full text-sm border rounded p-2"
//                                     rows={2}
//                                   ></textarea>
//                                   <div className="flex justify-end space-x-2 mt-2">
//                                     <button
//                                       onClick={() =>
//                                         cancelEditingDescription(index)
//                                       }
//                                       className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
//                                     >
//                                       Cancel
//                                     </button>
//                                     <button
//                                       onClick={() => saveDescription(index)}
//                                       className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                                     >
//                                       Save
//                                     </button>
//                                   </div>
//                                 </div>
//                               )}
//                             </td>
//                           </tr>
//                         )}
//                       </>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>

//           {cartItems.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="md:col-span-2">
//                 <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
//                   <h2 className="text-lg font-semibold mb-4">
//                     Shipping Options
//                   </h2>
//                   <div className="space-y-3">
//                     <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
//                       <input
//                         type="radio"
//                         name="shippingMethod"
//                         value="standard"
//                         checked={shippingMethod === "standard"}
//                         onChange={(e) => setShippingMethod(e.target.value)}
//                         className="mr-3"
//                       />
//                       <div>
//                         <div className="font-medium">Standard Shipping</div>
//                         <div className="text-sm text-gray-600">
//                           Delivery in 5-7 business days
//                         </div>
//                       </div>
//                       <div className="ml-auto font-medium">$5.00</div>
//                     </label>

//                     <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
//                       <input
//                         type="radio"
//                         name="shippingMethod"
//                         value="express"
//                         checked={shippingMethod === "express"}
//                         onChange={(e) => setShippingMethod(e.target.value)}
//                         className="mr-3"
//                       />
//                       <div>
//                         <div className="font-medium">Express Shipping</div>
//                         <div className="text-sm text-gray-600">
//                           Delivery in 1-3 business days
//                         </div>
//                       </div>
//                       <div className="ml-auto font-medium">$15.00</div>
//                     </label>

//                     <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
//                       <input
//                         type="radio"
//                         name="shippingMethod"
//                         value="overnight"
//                         checked={shippingMethod === "overnight"}
//                         onChange={(e) => setShippingMethod(e.target.value)}
//                         className="mr-3"
//                       />
//                       <div>
//                         <div className="font-medium">Overnight Shipping</div>
//                         <div className="text-sm text-gray-600">
//                           Next day delivery
//                         </div>
//                       </div>
//                       <div className="ml-auto font-medium">$25.00</div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="md:col-span-1">
//                 <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
//                   <h2 className="text-xl font-bold mb-4">Order Summary</h2>
//                   <div className="space-y-3 mb-4">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal</span>
//                       <span className="font-medium">
//                         ${subtotal.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Shipping</span>
//                       <span className="font-medium">
//                         ${shippingCost.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-gray-600">
//                       <span>Tax</span>
//                       <span className="font-medium">
//                         ${calculateTax.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="border-t pt-3 mt-3">
//                       <div className="flex justify-between font-bold text-lg">
//                         <span>Total</span>
//                         <span>${total.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center ${
//                       cartItems.length === 0
//                         ? "opacity-50 cursor-not-allowed"
//                         : ""
//                     }`}
//                     disabled={cartItems.length === 0}
//                   >
//                     <i className="fas fa-lock mr-2"></i> Proceed to Checkout
//                   </button>
//                   <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
//                     <i className="fas fa-shield-alt mr-2"></i> Secure Checkout
//                   </div>
//                   <div className="flex justify-center space-x-2 mt-4">
//                     <i className="fab fa-cc-visa text-2xl text-blue-900"></i>
//                     <i className="fab fa-cc-mastercard text-2xl text-red-600"></i>
//                     <i className="fab fa-cc-amex text-2xl text-blue-500"></i>
//                     <i className="fab fa-cc-paypal text-2xl text-blue-700"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {cartItems.length > 0 && (
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//               <a
//                 href="#"
//                 className="flex items-center text-blue-600 hover:text-blue-800"
//               >
//                 <i className="fas fa-arrow-left mr-2"></i>
//                 Continue Shopping
//               </a>
//               <button
//                 onClick={clearCart}
//                 className="text-red-600 hover:text-red-800"
//               >
//                 <i className="fas fa-trash mr-1"></i> Clear Cart
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }