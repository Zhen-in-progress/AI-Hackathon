export const setHeader = (token: string) => {
  return {
    headers: {
      Api_key: token,
      "Content-Type": "application/json",
    },
  };
};
