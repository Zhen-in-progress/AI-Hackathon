import { toast } from "react-toastify";
import { create } from "zustand";
import { apiKey, apiBaseUrl } from "../config";
import {
  sampleOfferData,
  sampleSignUpOfferData,
  sampleManagerOfferData,
} from "./sample-data";

interface IProduct {
  product_name: string;
  quantity: number;
  variant: string[];
}

export type IOfferPayload = IProduct[];

// Sign Up Offer
export type ISignUpOfferPayload = Array<{
  product_name: string;
  product_id: string;
  quantity: number;
}>;

interface OfferStore {
  offers: IOfferPayload | null;
  setOffers: (offers: IOfferPayload) => void;
  signUpOffers: ISignUpOfferPayload | null;
  managerOffers: IOfferPayload | null;
  isLoadingOffer: boolean;
  setIsLoadingOffer: (value: boolean) => void;
  showGif: boolean;
  setShowGif: (value: boolean) => void;
  // API
  generateOffer: (numberOfPeople: number, storeId: string) => void;
  generateSignUpOffer: (orderId: string) => void;
  generateManagerOffer: (
    storeReference: string,
    amount: number,
    percentage: number
  ) => void;
  insertData: (data: any) => void;
}

export const createOfferStore = create<OfferStore>()((set) => ({
  offers: null,
  setOffers: (newOffers) => set({ offers: newOffers }),
  signUpOffers: null,
  managerOffers: null,
  isLoadingOffer: false,
  setIsLoadingOffer: (isLoadingOffer: boolean) => set({ isLoadingOffer }),
  showGif: false,
  setShowGif: (showGif: boolean) => set({ showGif }),
  generateOffer: async (numberOfPeople, storeId) => {
    try {
      set({ isLoadingOffer: true });
      if (!numberOfPeople || !storeId) return;

      if (!apiBaseUrl) {
        toast.error("api config not found");
        return;
      }
      const response = await fetch(
        `${apiBaseUrl}/store_reference=${storeId}/guest_count=${numberOfPeople}/${apiKey}/`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            store_reference: storeId,
            guest_count: numberOfPeople.toString(),
          }),
        }
      );
      set({ isLoadingOffer: false });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: IOfferPayload = await response.json();

      if (!data) {
        set({ offers: sampleOfferData });
      } else {
        set({ offers: data });
      }
    } catch (err) {
      set({ isLoadingOffer: false });
      toast.error("failed to create order");
    }
  },

  generateSignUpOffer: async (orderId: string) => {
    try {
      set({ isLoadingOffer: true });
      if (!orderId) return;
      if (!apiBaseUrl) {
        toast.error("api config not found");
        return;
      }

      const response: any = await fetch(
        `${apiBaseUrl}/order_id=${orderId}/${apiKey}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      set({ isLoadingOffer: false });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ISignUpOfferPayload = await response.json();

      if (!data) {
        set({ signUpOffers: sampleSignUpOfferData });
      }
      set({ signUpOffers: data });
    } catch (err) {
      set({ isLoadingOffer: false });
      toast.error("failed to create sign up offer");
    }
  },
  generateManagerOffer: async (storeReference, amount, percentage) => {
    try {
      set({ isLoadingOffer: true });
      if (!storeReference || !amount || !percentage) return;

      if (!apiBaseUrl) {
        toast.error("api config not found");
        return;
      }

      const response = await fetch(
        `${apiBaseUrl}/gift/store_reference=${storeReference}/${apiKey}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            store_reference: storeReference,
          }),
        }
      );

      set({ isLoadingOffer: false });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: IOfferPayload = await response.json();

      if (!data) {
        set({ managerOffers: sampleManagerOfferData });
      } else {
        set({ managerOffers: data });
      }
    } catch (err) {
      set({ isLoadingOffer: false });
      toast.error("failed to get manager offer");
    }
  },

  insertData: async (data: any) => {
    try {
      if (!apiBaseUrl) {
        toast.error("api config not found");
        return;
      }
      const {
        storeId,
        tableGuest,
        orderId,
        productName,
        sequenceNo,
        dayName,
        productTag,
      } = data;

      const response = await fetch(`${apiBaseUrl}/insert_data`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          store_id: storeId,
          table_guest: tableGuest,
          order_id: orderId,
          product_name: productName,
          sequence_no: sequenceNo,
          day_name: dayName,
          product_tag: productTag,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("your cart has been updated!");
    } catch (err) {
      set({ isLoadingOffer: false });
    }
  },
}));
