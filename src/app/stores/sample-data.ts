import { IOfferPayload, ISignUpOfferPayload } from "./offer";

export const sampleOfferData: IOfferPayload = {
  products: [
    {
      product: {
        product_name: "Cappuccino-Small",
        product_id: "4d5dade8-8b99-483c-9ec7-800ccf7f3734",
      },
      quantity: 2,
      variant: [
        {
          product_name: "Add Chips",
          product_id: "c52ccb4c-db35-4b88-9509-04ca0cc19d4f",
        },
        {
          product_name: "Milkshake",
          product_id: "3605e14a-8940-4dcf-8866-b3cecea5bdce",
        },
      ],
    },
    {
      product: {
        product_name: "Cappuccino-Large",
        product_id: "4d5dade8-8b99-483c-9ec7-800ccf7f3735",
      },
      quantity: 3,
      variant: [
        {
          product_name: "Add Donut",
          product_id: "c52ccb4c-db35-4b88-9509-04ca0cc19d4d",
        },
        {
          product_name: "Milkshake",
          product_id: "3605e14a-8940-4dcf-8866-b3cecea5bdcf",
        },
        {
          product_name: "Add Sugar",
          product_id: "c52ccb4c-db35-4b88-9509-04ca0cc19d4g",
        },
      ],
    },
  ],
};

export const sampleSignUpOfferData: ISignUpOfferPayload = [
  {
    product_name: "Mix and Match Skewers",
    product_id: "e8825707-5f51-4ae2-bcff-1d14f4fe782d",
    quantity: 1,
  },
  {
    product_name: "Chicken Skin",
    product_id: "1f9ca7e4-b55f-43a6-bbbd-6596a3b226c7",
    quantity: 1,
  },
  {
    product_name: "Chicken Inasal Combo",
    product_id: "bda629b9-07bb-47b7-95e4-f3984bc6b722",
    quantity: 1,
  },
  {
    product_name: "Pork Skewer",
    product_id: "2e58ec00-5cc6-4098-be61-539f12bb141b",
    quantity: 1,
  },
  {
    product_name: "Chicken Skewer",
    product_id: "98ccd3ca-06e1-4b51-99b2-92cb5875509e",
    quantity: 1,
  },
  {
    product_name: ".Pork Skewer",
    product_id: "bcd27d54-e436-4227-b0a1-cc381d0db3d5",
    quantity: 1,
  },
  {
    product_name: "Vinegar",
    product_id: "e480aacc-153a-4455-b75c-0fe54033e8c7",
    quantity: 1,
  },
  {
    product_name: "Beef Bone Soup",
    product_id: "1c0d73cb-33dc-4fc5-b0ed-0e9a35643e84",
    quantity: 2,
  },
  {
    product_name: "Plain Rice",
    product_id: "645e8ae6-3187-491d-a9de-09674c0b08ad",
    quantity: 1,
  },
];

export const sampleManagerOfferData: IOfferPayload = {
  products: [
    {
      product: {
        product_name: "Latte-Large",
        product_id: "4fba32c6-0dc0-4009-b0bd-90ef10b57b93",
      },
      quantity: 1,
      variant: [],
    },
  ],
};
