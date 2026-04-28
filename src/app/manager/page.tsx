"use client";
import { useSearchParams } from "next/navigation";
import { ManagerGiftButton } from "../components/ManagerGiftButton";

export default function ManagerPage() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("store_id") || "";
  const amount = 100;
  const percentage = 1;

  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center p-4">
      <ManagerGiftButton
        storeReference={storeId}
        amount={amount}
        percentage={percentage}
      />
    </div>
  );
}
