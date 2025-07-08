

"use client";

import { useState, useMemo } from "react";
import Head from "next/head";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  LockClosedIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function CartPage2() {
  const { cartItems, setQuantity, removeFromCart, clearCart, updateCartItem } =
    useCart();
  const [removedItemId, setRemovedItemId] = useState<string | null>(null);

  const [shippingMethod, setShippingMethod] = useState("standard");

  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      Black: "#000000",
      Silver: "#C0C0C0",
      Blue: "#0047AB",
      Red: "#FF0000",
      White: "#FFFFFF",
    };
    return colorMap[color] || "#000000";
  };

  const incrementQuantity = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) setQuantity(id, item.quantity + 1);
  };

  const decrementQuantity = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.quantity > 1) setQuantity(id, item.quantity - 1);
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) setQuantity(id, value);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalCost, 0);
  }, [cartItems]);

  const shippingCost = useMemo(() => {
    const shippingRates: Record<string, number> = {
      standard: 5,
      express: 15,
      overnight: 25,
    };
    return shippingRates[shippingMethod] || 5;
  }, [shippingMethod]);

  const calculateTax = useMemo(() => subtotal * 0.075, [subtotal]);

  const total = useMemo(
    () => subtotal + shippingCost + calculateTax,
    [subtotal, shippingCost, calculateTax]
  );

  const handleRemove = (id: string) => {
    setRemovedItemId(id);
    toast.success("Item removed from cart");
    setTimeout(() => {
      removeFromCart(id);
      setRemovedItemId(null);
    }, 300);
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <Head>
        <title>Cart Page</title>
      </Head>

      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
            Shopping Cart
          </h1>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center">
           <ShoppingCartIcon className="w-5 h-5 text-blue mr-2" />
            <span>{cartItems.length}</span>
            <span className="hidden sm:inline ml-1">items</span>
          </div>
        </div>

        <div className="space-y-6">
          {cartItems.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <ShoppingCartIcon className="w-5 h-5 text-blue mr-2" />
              <p className="text-xl text-gray-500">Your cart is empty</p>
              <Link
                href="/"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          {/* MOBILE VIEW */}
          <div className="sm:hidden">
            {cartItems.map((item) => (
              <div
                key={`mobile-item-${item.id}`}
                className="bg-white rounded-lg shadow-md p-4 mb-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt="Product"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p className="text-sm text-gray-600">{item.model}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5 mr-1 text-black" />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">HS Code:</span>
                    <span>{item.hsCode}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center">
                      <select
                        value={item.color}
                        onChange={(e) =>
                          updateCartItem(item.id, { color: e.target.value })
                        }
                        className="text-sm border rounded p-1"
                      >
                        {["Black", "Silver", "Blue", "Red", "White"].map(
                          (c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          )
                        )}
                      </select>
                      <div
                        className="w-4 h-4 ml-2 rounded-full"
                        style={{ backgroundColor: getColorHex(item.color) }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quantity:</span>
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-2 py-1 text-gray-500"
                      >
                          <MinusIcon className="w-4 h-4 text-gray-500" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(e, item.id)}
                        min="1"
                        className="w-12 text-center border-x"
                      />
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-2 py-1 text-gray-500"
                      >
                        <PlusIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span>{item.weight} kg</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <select
                      value={item.deliveryMethod}
                      onChange={(e) =>
                        updateCartItem(item.id, {
                          deliveryMethod: e.target.value,
                        })
                      }
                      className="text-sm border rounded p-1"
                    >
                      {["Air", "Ship", "Express"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between font-medium">
                    <span>Price:</span>
                    <span>₹{item.perPieceRate?.toFixed(2) ?? "0.00"}</span>
                  </div>

                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{item.totalCost?.toFixed(2) ?? "0.00"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden sm:block">
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-center">Color</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  {/* <th className="py-3 px-4 text-right">Total</th> */}
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={`desktop-item-${item.id}`}
                    className={`border-t hover:bg-gray-50 transition-opacity duration-300 ${
                      removedItemId === item.id ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt="Product"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="text-xl font-medium mb-2">
                            {item.name}
                          </h3>
                          {/* <p className="text-xs text-gray-500">
                            {item.material} | {item.weight} | {item.infill}%
                            infill
                          </p> */}
                          <p className="text-[14px] text-gray-500 ">
                            <li>Material : {item.material}</li>
                            <li>Weight : {item.weight}</li>
                            <li>Infill : {item.infill}</li>
                            <li>Print Time : {item.printTime}</li>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: getColorHex(item.color) }}
                        ></div>
                        <select
                          value={item.color}
                          onChange={(e) =>
                            updateCartItem(item.id, { color: e.target.value })
                          }
                          className="text-sm border rounded p-1"
                        >
                          {["Black", "Silver", "Blue", "Red", "White"].map(
                            (c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            )
                          )}
                        </select>
                        {/* <span>{item.color}</span> */}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="px-2 py-1 text-gray-500 border rounded-l"
                        >
                          <MinusIcon className="w-4 h-4 text-gray-500" />

                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(e, item.id)}
                          min="1"
                          className="w-12 text-center border-y"
                        />
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="px-2 py-1 text-gray-500 border rounded-r"
                        >
                           <PlusIcon className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      ₹{item.totalCost?.toFixed(2) ?? "0.00"}
                    </td>
                    {/* <td className="py-4 px-4 text-right">
                      ₹
                      {(item.totalCost && item.quantity
                        ? item.totalCost * item.quantity
                        : 0
                      ).toFixed(2)}
                    </td> */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 cursor-pointer hover:text-red-100 transition duration-200 ease-in-out transform hover:scale-110"
                        title="Remove from cart"
                      >
                        <span>
                          <TrashIcon className="w-5 h-5 mr-1 text-black" />
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ORDER SUMMARY + SHIPPING */}
          {cartItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Shipping Options
                  </h2>
                  <div className="space-y-3">
                    {["standard", "express", "overnight"].map((method) => (
                      <label
                        key={method}
                        className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method}
                          checked={shippingMethod === method}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-grow">
                          <div className="font-medium capitalize">
                            {method} shipping
                          </div>
                          <div className="text-sm text-gray-600">
                            {method === "standard" &&
                              "Delivery in 5–7 business days"}
                            {method === "express" &&
                              "Delivery in 1–3 business days"}
                            {method === "overnight" && "Next day delivery"}
                          </div>
                        </div>
                        <div className="ml-auto font-medium">
                          ₹
                          {method === "standard"
                            ? "5.00"
                            : method === "express"
                            ? "15.00"
                            : "25.00"}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ₹{subtotal?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        ₹{shippingCost?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-medium">
                        ₹{calculateTax?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total?.toFixed(2) ?? "0.00"}</span>
                      </div>
                    </div>
                  </div>
                  {cartItems.length > 0 ? (
                    <Link href="/payment">
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center cursor-pointer">
                        <LockClosedIcon className="w-5 h-5 mr-2 text-white" />{" "}
                        Proceed to Checkout
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center opacity-50 cursor-not-allowed"
                    >
                      <LockClosedIcon className="w-5 h-5 mr-2 text-white" />{" "}
                      Proceed to Checkout
                    </button>
                  )}
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                    <ShieldCheckIcon className="w-5 h-5 mr-2 text-gray-600" />
                    Secure Checkout
                  </div>
                  <div className="flex justify-center space-x-2 mt-4">
                    <img src="/icons/Visa_Inc.svg" alt="Visa" className="h-6" />
                    <img
                      src="/icons/Mastercard-logo.svg"
                      alt="MasterCard"
                      className="h-7"
                    />
                    {/* <img src="/icons/amex.svg" alt="Amex" className="h-6" />
                    <img src="/icons/paypal.svg" alt="PayPal" className="h-6" /> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <Link
                href="/"
                className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800"
              >
                <ShoppingCartIcon className="w-5 h-5 text-blue mr-2" />

                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="cursor-pointer text-red-600 hover:text-red-800 flex items-center"
              >
                <TrashIcon className="w-5 h-5 text-red-500 mr-2 " />Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

