"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SignUpButton } from "@/app/components/SignUpButton";
import { createOfferStore } from "../stores/offer";
import { SignUpCart } from "../components/Cart/sign-up";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const orderId =
    searchParams.get("order_id") || "d40087b2-65d3-479d-87bb-08797997a994";
  const { signUpOffers } = createOfferStore();

  useEffect(() => {
    if (!orderId) {
      toast.warn("Required order_id is missing.");
    }
  }, [orderId]);

  return (
    <main className="w-full mx-auto flex flex-col items-center justify-center p-4">
      <SignUpButton orderId={orderId} />

      {signUpOffers && signUpOffers.length > 0 && (
        <div className="mt-4 w-fit min-w-[350px]">
          <SignUpCart />
        </div>
      )}
    </main>
  );
}
