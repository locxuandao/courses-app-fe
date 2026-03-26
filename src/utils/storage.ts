export const removeItemFromStorage = (key: any) => localStorage.removeItem(key);

const setTokens = (tokens: {}) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
};

const getTokens = () => {
  const tokens = localStorage.getItem("tokens") || '{"error": "null"}';

  if (tokens === "undefined") {
    removeItemFromStorage("tokens");
    window.location.replace("/");
  }

  return JSON.parse(tokens);
};

export { getTokens, setTokens };
