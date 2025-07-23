// "use client";

// import { useState, useEffect } from "react";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";
// import { useRouter } from "next/router";

// const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

// const StripePayment = ({ amount }: { amount: number }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [clientSecret, setClientSecret] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     axios
//       .post("/api/stripe/create-intent/", { amount })
//       .then((res) => setClientSecret(res.data.clientSecret))
//       .catch((err) => console.error(err));
//   }, [amount]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement)!,
//       },
//     });

//     if (result.error) {
//       alert("❌ Payment failed: " + result.error.message);
//     } else if (result.paymentIntent.status === "succeeded") {
//       // alert("✅ Payment successful!");
//       router.push("/paymentsucces");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 mt-6">
//       <CardElement className="border px-4 py-3 rounded-xl" />
//       <button
//         type="submit"
//         disabled={!stripe}
//         className="cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 text-black py-3 px-6 rounded-xl font-semibold shadow-lg hover:text-white hover:from-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 duration-300 w-full"
//       >
//         Pay Securely
//       </button>
//     </form>
//   );
// };

// const Order = () => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     city: "",
//     state: "",
//     zip: "",
//     upiId: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const subtotal = 120;
//   const shipping = 10;
//   const tax = 5;
//   const total = subtotal + shipping + tax;

//   const validate = () => {
//     const newErrors: Record<string, string> = {};

//     if (!form.firstName.trim()) newErrors.firstName = "First name is required";
//     if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!form.address.trim()) newErrors.address = "Address is required";
//     if (!form.city.trim()) newErrors.city = "City is required";
//     if (!form.state.trim()) newErrors.state = "State is required";

//     if (!form.zip || !/^\d{5,6}$/.test(form.zip)) {
//       newErrors.zip = "ZIP code must be 5 or 6 digits";
//     }

//     if (paymentMethod === "upi") {
//       if (!/^[\w.-]+@[\w.-]+$/.test(form.upiId)) {
//         newErrors.upiId = "Enter a valid UPI ID (e.g. name@bank)";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validate()) {
//       if (paymentMethod === "upi") {
//         alert(`✅ Order placed using UPI: ${form.upiId}`);
//         // Optional: send order to backend
//       }
//     }
//   };

//   const inputStyle = (key: string) =>
//     `w-full px-4 py-3 border ${
//       errors[key] ? "border-red-500" : "border-gray-300"
//     } rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition`;

//   return (
//     <section className="min-h-screen flex items-center justify-center px-4 py-12">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden transition-transform transform hover:scale-105 duration-300 p-8"
//       >
//         <h1 className="text-3xl font-semibold text-slate-900 mb-6">Checkout</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//           <div>
//             <h2 className="text-xl font-semibold mb-4 text-slate-800">
//               Shipping Address
//             </h2>
//             <div className="grid md:grid-cols-2 gap-4">
//               {["firstName", "lastName"].map((field) => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
//                     {field.replace("Name", " Name")}
//                   </label>
//                   <input
//                     className={inputStyle(field)}
//                     value={form[field as keyof typeof form]}
//                     onChange={(e) =>
//                       setForm({ ...form, [field]: e.target.value })
//                     }
//                   />
//                   {errors[field] && (
//                     <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//             {["address", "city", "state", "zip"].map((field) => (
//               <div className="mt-4" key={field}>
//                 <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
//                   {field}
//                 </label>
//                 <input
//                   className={inputStyle(field)}
//                   value={form[field as keyof typeof form]}
//                   onChange={(e) =>
//                     setForm({ ...form, [field]: e.target.value })
//                   }
//                 />
//                 {errors[field] && (
//                   <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-4 text-slate-800">
//               Payment Method
//             </h2>
//             <div className="flex gap-4 mb-6">
//               {["card", "upi"].map((method) => (
//                 <label
//                   key={method}
//                   className={`cursor-pointer px-4 py-2 border rounded-xl text-sm font-medium transition ${
//                     paymentMethod === method
//                       ? "bg-pink-500 text-white border-pink-600"
//                       : "bg-white border-gray-300 text-gray-700 hover:bg-pink-100"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value={method}
//                     checked={paymentMethod === method}
//                     onChange={() => setPaymentMethod(method as any)}
//                     className="hidden"
//                   />
//                   {method === "card" ? "Credit/Debit Card" : "UPI"}
//                 </label>
//               ))}
//             </div>

//             {paymentMethod === "card" && (
//               <Elements stripe={stripePromise}>
//                 <StripePayment amount={total} />
//               </Elements>
//             )}

//             {paymentMethod === "upi" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-2">
//                   UPI ID
//                 </label>
//                 <input
//                   className={inputStyle("upiId")}
//                   placeholder="yourname@bank"
//                   value={form.upiId}
//                   onChange={(e) => setForm({ ...form, upiId: e.target.value })}
//                 />
//                 {errors.upiId && (
//                   <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
//                 )}
//               </div>
//             )}
//             <div className="mt-6 border-t pt-4">
//               <h3 className="text-lg font-semibold text-slate-800 mb-3">
//                 Order Summary
//               </h3>
//               <div className="space-y-2 text-gray-700 text-sm">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping</span>
//                   <span>${shipping.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Tax</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-semibold text-base border-t pt-2">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             {paymentMethod === "upi" && (
//               <button
//                 type="submit"
//                 className="mt-6 cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 text-black py-3 px-6 rounded-xl font-semibold shadow-lg hover:text-white hover:from-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 duration-300 w-full"
//               >
//                 Place UPI Order
//               </button>
//             )}
//           </div>
//         </div>
//       </form>
//     </section>
//   );
// };

// export default Order;

"use client";

import { useCart } from "@/app/context/CartContext";
import { useMemo, useState } from "react";

const Order = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
    upiId: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { cartItems } = useCart();

  
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalCost, 0);
  }, [cartItems]);

  const shipping = 10;
  const tax = useMemo(() => subtotal * 0.075, [subtotal]);
  const total = useMemo(
    () => subtotal + shipping + tax,
    [subtotal, shipping, tax]
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";

    if (!form.zip || !/^\d{5,6}$/.test(form.zip)) {
      newErrors.zip = "ZIP code must be 5 or 6 digits";
    }

    if (paymentMethod === "card") {
      if (!/^\d{16}$/.test(form.cardNumber)) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      if (!/^\d{2}\/\d{2}$/.test(form.expDate)) {
        newErrors.expDate = "Expiration must be MM/YY";
      }
      if (!/^\d{3}$/.test(form.cvv)) {
        newErrors.cvv = "CVV must be 3 digits";
      }
    }

    if (paymentMethod === "upi") {
      if (!/^[\w.-]+@[\w.-]+$/.test(form.upiId)) {
        newErrors.upiId = "Enter a valid UPI ID (e.g. name@bank)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert(`Order placed using ${paymentMethod.toUpperCase()}!`);
      // Submit to backend
    }
  };

  const inputStyle = (key: string) =>
    `w-full px-4 py-3 border ${
      errors[key] ? "border-red-500" : "border-gray-300"
    } rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition`;

  return (
    <>
      <section className="min-h-screen flex items-center justify-center  px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden transition-transform transform hover:scale-105 duration-300 p-8"
        >
          <h1 className="text-3xl font-semibold text-slate-900 mb-6">
            Checkout
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Shipping Address
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {["firstName", "lastName"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
                      {field.replace("Name", " Name")}
                    </label>
                    <input
                      className={inputStyle(field)}
                      value={form[field as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {["address", "city", "state", "zip"].map((field) => (
                <div className="mt-4" key={field}>
                  <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
                    {field}
                  </label>
                  <input
                    className={inputStyle(field)}
                    value={form[field as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Payment Method
              </h2>
              <div className="flex gap-4 mb-6">
                {["card", "upi"].map((method) => (
                  <label
                    key={method}
                    className={`cursor-pointer px-4 py-2 border rounded-xl text-sm font-medium transition ${
                      paymentMethod === method
                        ? "bg-pink-500 text-white border-pink-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-pink-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method as any)}
                      className="hidden"
                    />
                    {method === "card" ? "Credit/Debit Card" : "UPI"}
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Card Number
                    </label>
                    <input
                      className={inputStyle("cardNumber")}
                      value={form.cardNumber}
                      onChange={(e) =>
                        setForm({ ...form, cardNumber: e.target.value })
                      }
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Expiration
                    </label>
                    <input
                      className={inputStyle("expDate")}
                      placeholder="MM/YY"
                      value={form.expDate}
                      onChange={(e) =>
                        setForm({ ...form, expDate: e.target.value })
                      }
                    />
                    {errors.expDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.expDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      CVV
                    </label>
                    <input
                      className={inputStyle("cvv")}
                      value={form.cvv}
                      onChange={(e) =>
                        setForm({ ...form, cvv: e.target.value })
                      }
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    UPI ID
                  </label>
                  <input
                    className={inputStyle("upiId")}
                    placeholder="yourname@bank"
                    value={form.upiId}
                    onChange={(e) =>
                      setForm({ ...form, upiId: e.target.value })
                    }
                  />
                  {errors.upiId && (
                    <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/")}
                  className="cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 text-black py-3 px-6 rounded-xl font-semibold shadow-lg hover:text-white hover:from-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 duration-300"
                >
                  Go Home
                </button>

                <button
                  type="submit"
                  className="cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 text-black py-3 px-6 rounded-xl font-semibold shadow-lg hover:text-white hover:from-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 duration-300"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Order;
