import axios from "axios";

const BASE_URL = "https://porfolio-backend-7rr7.onrender.com/api/v1";

export const fetchProjects = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}/projects?page=${page}&limit=${limit}`);
    return response.data; // Assuming your API returns a JSON with a projects array
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
