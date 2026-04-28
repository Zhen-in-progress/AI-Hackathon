"use client";
import { useEffect } from "react";
import { createOfferStore } from "../stores/offer";

export const GenerateOfferButton = (props: any) => {
  const { numberOfPeople, storeId } = props;
  const { offers, isLoadingOffer, generateOffer } = createOfferStore();
  const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL || "";

  function updateParentSize() {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;

    window.parent.postMessage(
      {
        dimensions: { width, height },
      },
      redirectUrl
    );
  }

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
      await generateOffer(numberOfPeople, storeId);

      if (!offers) return;
      onProductsUpdate(); // Update size after generating offer

      if (redirectUrl) {
        window.parent.postMessage(
          {
            type: "UPDATE_PRODUCTS",
            products: offers,
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
      <span className="text-white text-lg">Helping you out... 🤖</span>
    </div>
  ) : (
    "I'm Feeling Happy 🦄✨"
  );

  // If no offers, just return the button
  if (!offers || Object.keys(offers).length === 0) {
    return (
      <div className="relative">
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
    <div className="relative">
      <button
        onClick={handleClick}
        className="w-[300px] px-6 py-3 text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-transform duration-300 shadow-lg"
        style={{ border: "none" }}
      >
        {buttonContent}
      </button>
    </div>
  );
};
