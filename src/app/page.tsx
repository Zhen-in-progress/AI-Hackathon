"use client";
import { useEffect } from "react";
import { GenerateOfferButton } from "./components/GenerateOfferButton";
import { useSearchParams } from "next/navigation";
import { HomeCart } from "./components/Cart/home";
import { createOfferStore } from "./stores/offer";
import { toast } from "react-toastify";

export default function Home() {
  const searchParams = useSearchParams();
  const numberOfPeople = searchParams.get("number_of_people") || "1";
  const storeId =
    searchParams.get("store_id") || "cc43a6e5-613c-49f8-b390-e457827e9d37";
  const { isLoadingOffer, offers } = createOfferStore();

  useEffect(() => {
    if (!numberOfPeople || !storeId) {
      toast.warn("Required URL parameters are missing.");
    }
  }, [numberOfPeople, storeId]);

  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center p-4">
      <GenerateOfferButton numberOfPeople={numberOfPeople} storeId={storeId} />

      {!isLoadingOffer && offers && (
        <div className="mt-4 w-fit min-w-[350px]">
          <HomeCart />
        </div>
      )}
    </div>
  );
}
