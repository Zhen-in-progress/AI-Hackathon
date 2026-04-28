"use client";
import React from "react";
import { useEffect } from "react";
import { createOfferStore } from "../stores/offer";
import { SignUpCart } from "./Cart/sign-up";

interface ISignUpButtonProps {
  orderId: string;
}

export const SignUpButton = (props: ISignUpButtonProps) => {
  const { orderId } = props;
  const { signUpOffers, setShowGif, isLoadingOffer, generateSignUpOffer } =
    createOfferStore();
  const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL || "";

  function updateParentSize() {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;

    if (redirectUrl) {
      window.parent.postMessage(
        {
          dimensions: { width, height },
        },
        redirectUrl
      );
    }
  }

  // Let the DOM update first
  function onProductsUpdate() {
    setTimeout(updateParentSize, 0);
  }

  useEffect(() => {
    updateParentSize();

    const resizeObserver = new ResizeObserver(() => {
      updateParentSize();
    });
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  // Notify parent of initial empty products
  useEffect(() => {
    if (redirectUrl) {
      window.parent.postMessage(
        {
          type: "UPDATE_PRODUCTS",
          products: [],
        },
        redirectUrl
      );
    }
  }, []);

  const handleClick = async () => {
    try {
      setShowGif(true);

      // Wait for 4 seconds, then redirect to cart
      setTimeout(() => {
        setShowGif(false);
      }, 3000);
      //
      await generateSignUpOffer(orderId);
      if (!signUpOffers) return;
      onProductsUpdate(); // Update size after generating offer

      if (redirectUrl) {
        window.parent.postMessage(
          {
            type: "UPDATE_PRODUCTS",
            products: signUpOffers,
          },
          redirectUrl
        );
      }
    } catch (error) {
      console.log("Error fetching the offer:", error);
    }
  };

  const buttonContent = isLoadingOffer ? (
    <div className="flex justify-center items-center">
      <span className="text-white text-lg">You're almost there... 🎉</span>
    </div>
  ) : (
    "Free items for signing up 🎁"
  );

  // If no offers, just return the button
  if (!signUpOffers || Object.keys(signUpOffers).length === 0) {
    return (
      <div className="relative flex justify-center items-center">
        <button
          onClick={handleClick}
          className="w-[300px] px-6 py-3 text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-transform duration-300 shadow-lg"
          style={{ border: "none" }}
        >
          {buttonContent}
        </button>
      </div>
    );
  }

  // If there are offers, show the button and cart
  return (
    <div className="relative flex justify-center items-center">
      <button
        onClick={handleClick}
        className="w-[300px] px-6 py-3 text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-transform duration-300 shadow-lg"
        style={{ border: "none" }}
      >
        {buttonContent}
      </button>

      <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full min-w-[350px]">
        <SignUpCart />
      </div>
    </div>
  );
};
