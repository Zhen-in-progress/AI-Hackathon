"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { createOfferStore } from "../../stores/offer";
import { useSearchParams } from "next/navigation";

export const HomeCart = () => {
  const { offers, setOffers, insertData } = createOfferStore((state) => state);

  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  useEffect(() => {
    const updateParentHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        window.parent.postMessage(
          {
            type: "RESIZE_IFRAME",
            height: height + 24,
          },
          "*"
        );
      }
    };

    updateParentHeight();

    window.addEventListener("resize", updateParentHeight);
    return () => window.removeEventListener("resize", updateParentHeight);
  }, [offers]);

  const handleConfirmOrder = async () => {
    const productIds = offers
      ? offers.map((_, index) => index + 1).join(",")
      : "";
    const amounts = offers ? offers.map((item) => item.quantity).join(",") : "";

    if (!offers || !amounts) {
      toast.warn("offers or amounts not found");
      return;
    }

    const numberOfPeople = searchParams.get("number_of_people");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL;
    const separator = baseUrl?.includes("?") ? "&" : "?";

    window.open(
      `${baseUrl}${separator}productIds=${productIds}&amounts=${amounts}&redirectUrl=${redirectUrl}`,
      "_self"
    );

    // update database mockData
    await insertData({
      storeId: "store_a",
      tableGuest: numberOfPeople,
      orderId: "abc",
      productName: "abc",
      sequenceNo: "1",
      dayName: "abc",
      productTag: "abc",
    });
  };

  const handleVariantClick = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => {
      return prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId];
    });
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (!offers) return;

    const updatedProducts = offers.filter(
      (_, index) => index !== indexToRemove
    );

    setOffers({ ...offers, ...updatedProducts });
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-white rounded-xl border border-gray-200 shadow-lg p-6 backdrop-blur-sm"
    >
      <h2 className="text-[#C26D53] text-xl font-bold mb-4 flex items-center">
        <div className="mt-6 w-full text-center">
          <h2 className="text-m font-bold text-[#C26D53] mb-2">
            🦄 Unicorn thinks you would love these special dishes from us!
          </h2>
        </div>
      </h2>

      <div className="w-full">
        {offers && offers.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
              <span className="text-gray-700 text-lg font-medium flex items-center whitespace-nowrap">
                <span className="mr-2">👥</span>
                Your Group: {offers.length}
              </span>
            </div>
            <div className="space-y-4">
              {offers.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center py-3 px-4 border-b border-gray-100 hover:cursor-pointer hover:bg-white rounded-lg transition-all duration-200">
                    <div className="text-gray-800 font-medium flex items-center">
                      <span className="mr-3">🎁</span>
                      {item.product_name}
                    </div>
                    <div className="text-[#C26D53] font-semibold bg-[#C26D53]/10 px-5 py-1 rounded-full">
                      x{item.quantity}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* {item.variant &&
                    item.variant.map((variant, vIndex) => (
                      <div
                        key={vIndex}
                        className="ml-8 flex justify-between items-center py-2 px-4 my-1 hover:bg-white rounded-lg transition-all duration-200"
                      >
                        <div className="text-gray-600 font-medium flex items-center w-full">
                          <button
                            className={`flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-100 ${
                              selectedVariants.includes(variant)
                                ? "shadow-lg"
                                : ""
                            }`}
                            onClick={() => handleVariantClick(variant, vIndex)}
                          >
                            <div className="flex items-center">
                              <span className="mr-3 text-[#C26D53]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                              {variant}
                            </div>
                            <span className="pl-m text-sm text-gray-400">
                              Click to modify
                            </span>
                          </button>
                        </div>
                      </div>
                    ))} */}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Your cart is empty
          </div>
        )}
      </div>

      {offers && offers.length > 0 && (
        <div className="mt-6 w-full">
          <button
            onClick={() => handleConfirmOrder()}
            className="w-full py-3 bg-gradient-to-r from-[#C26D53] to-[#B25D43] text-white font-semibold rounded-lg hover:cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
          >
            <span className="mr-2">✨</span>
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};
