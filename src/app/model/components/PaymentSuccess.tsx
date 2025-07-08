"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(10);
  const redirectUrl = "/";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectUrl;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center animate-fade-in-scale">
          <div className="mx-auto flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-green-100 mb-6">
            <svg
              className="h-12 w-12 sm:h-16 sm:w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Thank you for your purchase. Your order is being processed and you
            will receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-8">
            <p className="text-gray-700">
              You will be automatically redirected to Home in{" "}
              <span className="font-semibold text-red-600">{countdown}</span>{" "}
              seconds.
            </p>
          </div>

          <Link
            href={redirectUrl}
            className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200 underline"
          >
            Go to Home Now
          </Link>
        </div>

        <style jsx>{`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in-scale {
            animation: fadeInScale 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default PaymentSuccess;
