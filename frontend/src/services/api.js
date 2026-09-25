import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//get guests list
export const getGuests = async () => {
  try {
    const response = await api.get("/");
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("error:", error);
  }
  return [];
};

export const updateGuest = async (guestId, updatedData) => {
  try {
    const response = await api.patch(`/${guestId}/status`, updatedData);
    return response.data;
  } catch (error) {
    console.error("error:", error);
  }
};

export const addGuest = async (guestData) => {
  try {
    const response = await api.post("/guest", guestData);
    return response.data;
  } catch (error) {
    console.error("error adding guest:", error);
    throw error;
  }
};
