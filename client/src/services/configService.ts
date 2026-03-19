import axios from "../api/axios";

export const getSizes = () => axios.get("/config/sizes");
export const addSize = (name: string) =>
  axios.post("/config/sizes", { name });

export const getColors = () => axios.get("/config/colors");
export const addColor = (name: string, hex?: string) =>
  axios.post("/config/colors", { name, hex });

export const getCategories = () => axios.get("/config/categories");
export const addCategory = (name: string) =>
  axios.post("/config/categories", { name });
