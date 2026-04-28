"use client";
import { useEffect } from "react";
import { createOfferStore } from "../stores/offer";
import { ManagerCart } from "../components/Cart/manager";

interface IManagerGiftButtonProps {
  storeReference: string;
  amount: number;
  percentage: number;
}

export const ManagerGiftButton = (props: IManagerGiftButtonProps) => {
  const { storeReference, amount, percentage } = props;
  const { managerOffers, generateManagerOffer, isLoadingOffer } =
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

  function onProductsUpdate() {
    // Let the DOM update first
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
      await generateManagerOffer(storeReference, amount, percentage);

      if (!managerOffers) return;
      onProductsUpdate();

      if (redirectUrl) {
        window.parent.postMessage(
          {
            type: "UPDATE_PRODUCTS",
            products: managerOffers,
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
      <span className="text-white text-lg">Generating Gift... 🤖</span>
    </div>
  ) : (
    "Manager Offer ✨"
  );

  // If no offers, just return the button
  if (!managerOffers || Object.keys(managerOffers).length === 0) {
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

      <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full min-w-[350px]">
        <ManagerCart />
      </div>
    </div>
  );
};
