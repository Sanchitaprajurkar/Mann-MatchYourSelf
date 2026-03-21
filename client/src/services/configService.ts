import API from "../utils/api";

export const getSizes = () => API.get("/api/config/sizes");
export const addSize = (name: string) =>
  API.post("/api/config/sizes", { name });

export const getColors = () => API.get("/api/config/colors");
export const addColor = (name: string, hex?: string) =>
  API.post("/api/config/colors", { name, hex });

export const getCategories = () => API.get("/api/config/categories");
export const addCategory = (name: string) =>
  API.post("/api/config/categories", { name });
