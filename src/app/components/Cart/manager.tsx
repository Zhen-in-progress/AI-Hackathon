"use client";
import React from "react";
import { createOfferStore } from "../../stores/offer";

export const ManagerCart = () => {
  const { managerOffers } = createOfferStore();

  const handleConfirmOrder = () => {};

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-lg p-6 backdrop-blur-sm">
      {managerOffers && (
        <h2 className="text-[#C26D53] text-xl font-bold mb-4 flex items-center whitespace-nowrap">
          Manager Gift For Member!
        </h2>
      )}

      {/* managerOffers section */}
      <div className="w-full">
        {managerOffers && managerOffers.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
              <span className="text-gray-700 text-[16px] font-medium flex items-center whitespace-nowrap">
                <span className="mr-2">👥</span>
                Forecast Customer Value: $
                {managerOffers.length > 0 &&
                  managerOffers.map((item: any) =>
                    item.CUSTOMER_VALUE.toFixed()
                  )}
              </span>
            </div>
            <div className="space-y-4">
              {managerOffers.map((item: any, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center py-3 px-4 border-b border-gray-100 hover:cursor-pointer hover:bg-white rounded-lg transition-all duration-200">
                    <div className="text-gray-800 font-medium flex items-center">
                      <span className="mr-3">🎁</span>
                      {item?.PRODUCT_NAME || ""}
                    </div>
                    <div className="text-[#C26D53] font-semibold bg-[#C26D53]/10 px-5 py-1 rounded-full">
                      x{item.quantity || managerOffers.length}
                    </div>
                  </div>
                  {/* Variant items */}
                  {/* {item.variant &&
                    item.variant.map((variant, vIndex) => (
                      <div
                        key={vIndex}
                        className="ml-8 flex justify-between items-center py-2 px-4"
                      >
                        <div className="text-gray-600 font-medium flex items-center">
                          <span className="mr-3">➕</span>
                          {variant || ""}
                        </div>
                      </div>
                    ))} */}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <span className="text-gray-700 text-lg font-medium flex items-center whitespace-nowrap">
              No items available.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
