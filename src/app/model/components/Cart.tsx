// "use client";

// import { useCart } from "@/app/context/CartContext";
// import Link from "next/link";

// const Cart = () => {
//   const { cart, updateQuantity, removeFromCart } = useCart();

//   const subtotal = cart.reduce(
//     (sum, item) => sum + parseFloat(item.totalCost) * item.quantity,
//     0
//   );

//   const shipping = 2.0;
//   const tax = 0.18 * subtotal;
//   const total = subtotal + shipping + tax;

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
//       <div className="max-w-7xl mx-auto p-4 w-full">
//         <h1 className="text-xl font-semibold text-slate-900">Shopping Cart</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//           <div className="space-y-6">
//             {cart.length === 0 ? (
//               <p className="text-slate-600 text-center">Your cart is empty.</p>
//             ) : (
//               cart.map((item) => (
//                 <div
//                   key={item.name}
//                   className="flex justify-between gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200"
//                 >
//                   <div className="flex gap-4">
//                     <div className="w-24 h-24 shrink-0">
//                       <img
//                         src={item.image || "/placeholder.jpg"}
//                         alt={item.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>

//                     <div className="flex flex-col justify-between">
//                       <div>
//                         <h3 className="text-base font-semibold text-slate-900">
//                           {item.name}
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           Material: {item.material}
//                         </p>
//                         <p className="text-sm text-slate-500">
//                           Color:{" "}
//                           <span
//                             className="inline-block w-4 h-4 rounded-sm"
//                             style={{ backgroundColor: item.color }}
//                           ></span>
//                         </p>
//                         <p className="text-sm text-slate-500">
//                           Print Time: {item.printTime}
//                         </p>
//                         <p className="text-sm text-slate-500">
//                           Weight: {item.weight}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-2 mt-2">
//                         <button
//                           className="px-2 py-1 bg-gray-200 rounded"
//                           onClick={() => updateQuantity(item.name, -1)}
//                         >
//                           -
//                         </button>
//                         <span className="text-sm font-medium">
//                           {item.quantity}
//                         </span>
//                         <button
//                           className="px-2 py-1 bg-gray-200 rounded"
//                           onClick={() => updateQuantity(item.name, 1)}
//                         >
//                           +
//                         </button>
//                       </div>

//                       <button
//                         className="mt-2 text-xs text-red-500 hover:underline"
//                         onClick={() => removeFromCart(item.name)}
//                       >
//                         Remove
//                       </button>

//                       <p className="text-sm font-semibold text-slate-900 mt-2">
//                         ₹
//                         {(parseFloat(item.totalCost) * item.quantity).toFixed(
//                           2
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Summary */}
//           <div className="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
//             <ul className="text-slate-500 font-medium space-y-4 text-sm">
//               <li className="flex justify-between">
//                 Subtotal{" "}
//                 <span className="font-semibold text-slate-900">
//                   ₹{subtotal.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between">
//                 Shipping{" "}
//                 <span className="font-semibold text-slate-900">
//                   ₹{shipping.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between">
//                 Tax{" "}
//                 <span className="font-semibold text-slate-900">
//                   ₹{tax.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between font-semibold text-slate-900 border-t pt-2">
//                 Total <span>₹{total.toFixed(2)}</span>
//               </li>
//             </ul>

//             <div className="mt-8 flex flex-col space-y-4 text-center">
//               <Link
//                 href="/checkout"
//                 className={`px-4 py-2.5 text-white rounded-md ${
//                   cart.length === 0
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-slate-800"
//                 }`}
//                 aria-disabled={cart.length === 0}
//               >
//                 Buy Now
//               </Link>
//               <Link
//                 href="/uploader"
//                 className="px-4 py-2.5 bg-slate-100 text-slate-900 border border-gray-300 rounded-md"
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Cart;

// components/Cart.tsx
// components/Cart.tsx

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { CART_CONSTANTS } from "@/app/config";

interface CartItem {
  name: string;
  image: string;
  material: string;
  color: string;
  printTime: string;
  weight: string;
  dimensions: string;
  infill: number;
  totalCost: number;
  quantity: number;
  volume: string;
}

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.totalCost * item.quantity, 0),
    [cartItems]
  );
  const shipping = CART_CONSTANTS.SHIPPING_COST;
  const tax = CART_CONSTANTS.TAX_RATE * subtotal;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (name: string, delta: number) => {
    const item = cartItems.find((i) => i.name === name);
    if (item && item.quantity + delta >= 1) {
      updateQuantity(name, delta);
    }
  };

  const handleRemove = (name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the cart?`)) {
      removeFromCart(name);
    }
  };

  const handleFavorite = (name: string) => {
    // Placeholder for favorite functionality (e.g., add to wishlist)
    console.log(`Added ${name} to favorites`);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto p-4 w-full">
        <h1 className="text-xl font-semibold text-slate-900">Shopping Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-slate-600 text-center">
                <p>Your cart is empty.</p>
                <Link
                  href="/uploader"
                  className="text-blue-500 hover:underline"
                >
                  Start shopping now
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 shrink-0">
                      <img
                        src={item.image || "/fallback-image.png"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) =>
                          (e.currentTarget.src = "/fallback-image.png")
                        }
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Material: {item.material}
                        </p>
                        <p className="text-sm text-slate-500">
                          Color: {item.color}
                          <span
                            className="inline-block w-4 h-4 rounded-sm ml-2"
                            style={{ backgroundColor: item.color }}
                            aria-hidden="true"
                          ></span>
                        </p>
                        <p className="text-sm text-slate-500">
                          Infill: {(item.infill * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-slate-500">
                          Dimensions: {item.dimensions}
                        </p>
                        <p className="text-sm text-slate-500">
                          Print Time: {item.printTime}
                        </p>
                        <p className="text-sm text-slate-500">
                          Weight: {item.weight}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-400 outline-none rounded-full"
                          onClick={() => handleQuantityChange(item.name, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-2 fill-white"
                            viewBox="0 0 124 124"
                          >
                            <path
                              d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                              data-original="#000000"
                            ></path>
                          </svg>
                        </button>
                        <span
                          className="font-semibold text-base leading-[18px]"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-800 outline-none rounded-full"
                          onClick={() => handleQuantityChange(item.name, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-2 fill-white"
                            viewBox="0 0 42 42"
                          >
                            <path
                              d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                              data-original="#000000"
                            ></path>
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-start gap-4 mt-2">
                        <button
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => handleRemove(item.name)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-pink-600 inline-block"
                          viewBox="0 0 64 64"
                          onClick={() => handleFavorite(item.name)}
                          aria-label={`Add ${item.name} to favorites`}
                        >
                          <path
                            d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                            data-original="#000000"
                          ></path>
                        </svg>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 mt-2">
                        ₹{(item.totalCost * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Order Summary
            </h2>
            <ul className="text-slate-500 font-medium space-y-4 text-sm">
              {cartItems.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-col gap-2 border-b border-gray-200 pb-2"
                >
                  <div className="flex flex-wrap gap-4">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="ml-auto font-semibold text-slate-900">
                      ₹{(item.totalCost * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    <p>Material: {item.material}</p>
                    <p>Color: {item.color}</p>
                    <p>Infill: {(item.infill * 100).toFixed(0)}%</p>
                    <p>Dimensions: {item.dimensions}</p>
                    <p>Print Time: {item.printTime}</p>
                    <p>Weight: {item.weight}</p>
                  </div>
                </li>
              ))}
              <li className="flex flex-wrap gap-4">
                Subtotal
                <span className="ml-auto font-semibold text-slate-900">
                  ₹{subtotal.toFixed(2)}
                </span>
              </li>
              <li className="flex flex-wrap gap-4">
                Shipping
                <span className="ml-auto font-semibold text-slate-900">
                  ₹{shipping.toFixed(2)}
                </span>
              </li>
              {/* <li className="flex flex-wrap gap-4">
                Tax ({CART_CONSTANTS.TAX_RATE * 100}%)
                <span className="ml-auto font-semibold text-slate-900">
                  ₹{tax.toFixed(2)}
                </span>
              </li> */}
              <hr className="border-slate-300" />
              <li className="flex flex-wrap gap-4 text-sm font-semibold text-slate-900">
                Total
                <span className="ml-auto">₹{total.toFixed(2)}</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-col space-y-4 text-center">
              <Link
                href="/payment"
                className={`text-sm px-4 py-2.5 w-full font-medium tracking-wide text-white rounded-md ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-slate-800 hover:bg-slate-900"
                }`}
                aria-disabled={cartItems.length === 0}
              >
                Buy Now
              </Link>
              <Link
                href="/uploader"
                className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-slate-50 hover:bg-slate-100 text-slate-900 border border-gray-300 rounded-md"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-4">
              <img
                src="https://readymadeui.com/images/master.webp"
                alt="MasterCard"
                className="w-10 object-contain"
              />
              <img
                src="https://readymadeui.com/images/visa.webp"
                alt="Visa"
                className="w-10 object-contain"
              />
              <img
                src="https://readymadeui.com/images/american-express.webp"
                alt="American Express"
                className="w-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;

// app/pages/Cart.tsx (or wherever your cart page is)
// "use client";

// import { useCart } from "@/app/context/CartContext";
// import Link from "next/link";

// const Cart = () => {
//   const { cart, updateQuantity, removeFromCart } = useCart();

//   const subtotal = cart.reduce(
//     (sum, item) => sum + parseFloat(item.totalCost) * item.quantity,
//     0
//   );
//   const shipping = 2.0;
//   const tax = 0.18 * subtotal;
//   const total = subtotal + shipping + tax;

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
//       <div className="max-w-7xl mx-auto p-4 w-full">
//         <h1 className="text-xl font-semibold text-slate-900">Shopping Cart</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

//           <div className="space-y-6">
//             {cart.length === 0 ? (
//               <p className="text-slate-600 text-center">Your cart is empty.</p>
//             ) : (
//               cart.map((item) => (
//                 <div
//                   key={item.name}
//                   className="flex justify-between gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200"
//                 >
//                   <div className="flex gap-4">
//                     <div className="w-24 h-24 shrink-0">
//                       <img
//                         src={item.image || "/placeholder.jpg"}
//                         alt={item.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>

//                     <div className="flex flex-col justify-between">
//                       <div>
//                         <h3 className="text-base font-semibold text-slate-900">
//                           {item.name}
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           Material: {item.material}
//                         </p>
//                         <p className="text-sm text-slate-500">
//                           Color:{" "}
//                           <span
//                             className="inline-block w-4 h-4 rounded-sm"
//                             style={{ backgroundColor: item.color }}
//                           ></span>
//                         </p>
//                         <p className="text-sm text-slate-500">
//                           Print Time: {item.printTime}
//                         </p>
//                         <p className="text-sm text-slate-500">
//                           Weight: {item.weight}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-2 mt-2">
//                         <button
//                           className="px-2 py-1 bg-gray-200 rounded"
//                           onClick={() => updateQuantity(item.name, -1)}
//                         >
//                           -
//                         </button>
//                         <span className="text-sm font-medium">{item.quantity}</span>
//                         <button
//                           className="px-2 py-1 bg-gray-200 rounded"
//                           onClick={() => updateQuantity(item.name, 1)}
//                         >
//                           +
//                         </button>
//                       </div>

//                       <button
//                         className="mt-2 text-xs text-red-500 hover:underline"
//                         onClick={() => removeFromCart(item.name)}
//                       >
//                         Remove
//                       </button>

//                       <p className="text-sm font-semibold text-slate-900 mt-2">
//                         ₹{(parseFloat(item.totalCost) * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Summary */}
//           <div className="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
//             <ul className="text-slate-500 font-medium space-y-4 text-sm">
//               <li className="flex justify-between">
//                 Subtotal{" "}
//                 <span className="font-semibold text-slate-900">
//                   ₹{subtotal.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between">
//                 Shipping{" "}
//                 <span className="font-semibold text-slate-900">
//                   ₹{shipping.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between">
//                 Tax{" "}
//                 <span className="font-semibold text-slate-900">
//                   ₹{tax.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between font-semibold text-slate-900 border-t pt-2">
//                 Total <span>₹{total.toFixed(2)}</span>
//               </li>
//             </ul>

//             <div className="mt-8 flex flex-col space-y-4 text-center">
//               <Link
//                 href="#"
//                 className="px-4 py-2.5 bg-slate-800 text-white rounded-md"
//               >
//                 Buy Now
//               </Link>
//               <Link
//                 href="/uploader"
//                 className="px-4 py-2.5 bg-slate-100 text-slate-900 border border-gray-300 rounded-md"
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Cart;

// import Link from "next/link";
// import React from "react";

// const Cart = () => {
//   return (
//     <>
//       <section className="min-h-screen flex items-center justify-center  ">
//         <div className="max-w-7xl max-lg:max-w-5xl mx-auto p-4">
//           <h1 className="text-xl font-semibold text-slate-900">
//             Shopping Cart
//           </h1>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="space-y-6">
//               <div className="flex justify-evenly  gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200">
//                 <div className="flex  gap-6 sm:gap-4 max-sm:flex-col">
//                   <div className="w-44 h-24 max-sm:w-24 max-sm:h-24 shrink-0">
//                     <img
//                       src="https://readymadeui.com/images/watch1.webp"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <div>
//                       <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                         Stylish Golden Watch
//                       </h3>
//                       <p className="text-[13px] font-medium text-slate-500 mt-2 flex items-center gap-2">
//                         Color:{" "}
//                         <span className="inline-block w-4 h-4 rounded-sm bg-[#ac7f48]"></span>
//                       </p>
//                     </div>
//                     <div className="mt-auto">
//                       <h3 className="text-sm font-semibold text-slate-900">
//                         $120.00
//                       </h3>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="ml-auto flex flex-col">
//                   <div className="flex items-start gap-4 justify-end">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-pink-600 inline-block"
//                       viewBox="0 0 64 64"
//                     >
//                       <path
//                         d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
//                         data-original="#000000"
//                       ></path>
//                     </svg>

//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-red-600 inline-block"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
//                         data-original="#000000"
//                       ></path>
//                       <path
//                         d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
//                         data-original="#000000"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="flex items-center gap-3 mt-auto">
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-400 outline-none rounded-full"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-2 fill-white"
//                         viewBox="0 0 124 124"
//                       >
//                         <path
//                           d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
//                           data-original="#000000"
//                         ></path>
//                       </svg>
//                     </button>
//                     <span className="font-semibold text-base leading-[18px]">
//                       2
//                     </span>
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-800 outline-none rounded-full"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-2 fill-white"
//                         viewBox="0 0 42 42"
//                       >
//                         <path
//                           d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
//                           data-original="#000000"
//                         ></path>
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200">
//                 <div className="flex gap-6 sm:gap-4 max-sm:flex-col">
//                   <div className="w-24 h-24 max-sm:w-24 max-sm:h-24 shrink-0">
//                     <img
//                       src="https://readymadeui.com/images/watch5.webp"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <div>
//                       <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                         Stylish Smart Watch
//                       </h3>
//                       <p className="text-[13px] font-medium text-slate-500 mt-2 flex items-center gap-2">
//                         Color:{" "}
//                         <span className="inline-block w-4 h-4 rounded-sm bg-[#e8dcdc]"></span>
//                       </p>
//                     </div>
//                     <div className="mt-auto">
//                       <h3 className="text-sm font-semibold text-slate-900">
//                         $70.00
//                       </h3>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="ml-auto flex flex-col">
//                   <div className="flex items-start gap-4 justify-end">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-pink-600 inline-block"
//                       viewBox="0 0 64 64"
//                     >
//                       <path
//                         d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
//                         data-original="#000000"
//                       ></path>
//                     </svg>

//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-red-600 inline-block"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
//                         data-original="#000000"
//                       ></path>
//                       <path
//                         d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
//                         data-original="#000000"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="flex items-center gap-3 mt-auto">
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-400 outline-none rounded-full"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-2 fill-white"
//                         viewBox="0 0 124 124"
//                       >
//                         <path
//                           d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
//                           data-original="#000000"
//                         ></path>
//                       </svg>
//                     </button>
//                     <span className="font-semibold text-base leading-[18px]">
//                       1
//                     </span>
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-800 outline-none rounded-full"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-2 fill-white"
//                         viewBox="0 0 42 42"
//                       >
//                         <path
//                           d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
//                           data-original="#000000"
//                         ></path>
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200">
//                 <div className="flex gap-6 sm:gap-4 max-sm:flex-col">
//                   <div className="w-24 h-24 max-sm:w-24 max-sm:h-24 shrink-0">
//                     <img
//                       src="https://readymadeui.com/images/sunglass6.webp"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <div>
//                       <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                         Round Glass
//                       </h3>
//                       <p className="text-[13px] font-medium text-slate-500 mt-2 flex items-center gap-2">
//                         Color:{" "}
//                         <span className="inline-block w-4 h-4 rounded-sm bg-black"></span>
//                       </p>
//                     </div>
//                     <div className="mt-auto">
//                       <h3 className="text-sm font-semibold text-slate-900">
//                         $20.00
//                       </h3>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="ml-auto flex flex-col">
//                   <div className="flex items-start gap-4 justify-end">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-pink-600 inline-block"
//                       viewBox="0 0 64 64"
//                     >
//                       <path
//                         d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
//                         data-original="#000000"
//                       ></path>
//                     </svg>

//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-red-600 inline-block"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
//                         data-original="#000000"
//                       ></path>
//                       <path
//                         d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
//                         data-original="#000000"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="flex items-center gap-3 mt-auto">
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-400 outline-none rounded-full"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-2 fill-white"
//                         viewBox="0 0 124 124"
//                       >
//                         <path
//                           d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
//                           data-original="#000000"
//                         ></path>
//                       </svg>
//                     </button>
//                     <span className="font-semibold text-base leading-[18px]">
//                       1
//                     </span>
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-slate-800 outline-none rounded-full"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-2 fill-white"
//                         viewBox="0 0 42 42"
//                       >
//                         <path
//                           d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
//                           data-original="#000000"
//                         ></path>
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
//               <ul className="text-slate-500 font-medium space-y-4">
//                 <li className="flex flex-wrap gap-4 text-sm">
//                   Subtotal{" "}
//                   <span className="ml-auto font-semibold text-slate-900">
//                     $200.00
//                   </span>
//                 </li>
//                 <li className="flex flex-wrap gap-4 text-sm">
//                   Shipping{" "}
//                   <span className="ml-auto font-semibold text-slate-900">
//                     $2.00
//                   </span>
//                 </li>
//                 <li className="flex flex-wrap gap-4 text-sm">
//                   Tax{" "}
//                   <span className="ml-auto font-semibold text-slate-900">
//                     $4.00
//                   </span>
//                 </li>
//                 <hr className="border-slate-300" />
//                 <li className="flex flex-wrap gap-4 text-sm font-semibold text-slate-900">
//                   Total <span className="ml-auto">$206.00</span>
//                 </li>
//               </ul>
//               <div className="mt-8 flex flex-col space-y-4 text-center">
//                 <Link
//                   href=""
//                   className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-slate-800 hover:bg-slate-900 text-white rounded-md cursor-pointer"
//                 >
//                   Buy Now
//                 </Link>
//                 <Link
//                   href="/uploader"
//                   className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-slate-50 hover:bg-slate-100 text-slate-900 border border-gray-300 rounded-md cursor-pointer"
//                 >
//                   Continue Shopping
//                 </Link>
//               </div>
//               <div className="mt-5 flex flex-wrap justify-center gap-4">
//                 <img
//                   src="https://readymadeui.com/images/master.webp"
//                   alt="card1"
//                   className="w-10 object-contain"
//                 />
//                 <img
//                   src="https://readymadeui.com/images/visa.webp"
//                   alt="card2"
//                   className="w-10 object-contain"
//                 />
//                 <img
//                   src="https://readymadeui.com/images/american-express.webp"
//                   alt="card3"
//                   className="w-10 object-contain"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Cart;
