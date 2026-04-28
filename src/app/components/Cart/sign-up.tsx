"use client";
import React from "react";
import { createOfferStore } from "../../stores/offer";

export const SignUpCart = () => {
  const { showGif, signUpOffers } = createOfferStore();

  const handleConfirmOrder = () => {};

  return (
    <div className="relative">
      <div
        className={`w-full bg-white rounded-xl border border-gray-200 shadow-lg p-6 backdrop-blur-sm ${
          showGif ? "blur-sm" : ""
        }`}
      >
        {signUpOffers && (
          <h2 className="text-[#C26D53] text-xl font-bold mb-4 flex items-center whitespace-nowrap">
            Free Gift For Member!
          </h2>
        )}

        <div className="w-full">
          {signUpOffers && (
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                <span className="text-gray-700 text-lg font-medium flex items-center whitespace-nowrap">
                  <span className="mr-2">👥</span>
                  {signUpOffers.length} Free gift is ready!
                </span>
              </div>
              <div className="space-y-4">
                {signUpOffers.map((product: any, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 px-4 border-b border-gray-100 last:border-b-0 hover:cursor-pointer hover:bg-white rounded-lg transition-all duration-200"
                  >
                    <div className="text-gray-800 font-medium flex items-center">
                      <span className="mr-3">🎁</span>
                      {product.product_name}
                    </div>
                    <div className="text-[#C26D53] font-semibold bg-[#C26D53]/10 px-5 py-1 rounded-full">
                      x{product.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Order Button */}
        <div className="mt-6 w-full">
          <button
            onClick={() => handleConfirmOrder()}
            className="w-full py-3 bg-gradient-to-r from-[#C26D53] to-[#B25D43] text-white font-semibold rounded-lg hover:cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
          >
            <span className="mr-2">✨</span>
            Become Member
          </button>
        </div>
      </div>

      {showGif && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20" />
          <img
            src="/gift.gif"
            alt="gift-animation"
            className="w-32 h-32 animate-scale-down relative"
          />
        </div>
      )}
    </div>
  );
};
