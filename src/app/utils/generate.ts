export function generateOrderPayload(numberOfPeople: number, storeId: string) {
  const productOptions = [
    "Grilled Ribeye Steak",
    "Garlic Butter Shrimp",
    "Classic Caesar Salad",
    "Mashed Potatoes",
    "Glass of Red Wine",
    "BBQ Chicken Wings",
    "Grilled Salmon",
    "Lemon Tart Dessert",
    "Cauliflower Gratin",
    "Creamy Mushroom Soup",
  ];

  const selectedProducts = [];
  for (let i = 0; i < numberOfPeople; i++) {
    selectedProducts.push({
      name: productOptions[i % productOptions.length],
      quantity: 1,
    });
  }

  return {
    products: selectedProducts,
    guest_count: numberOfPeople.toString(),
    store_reference: storeId,
  };
}
