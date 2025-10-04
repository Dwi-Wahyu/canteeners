// utils/api-client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
