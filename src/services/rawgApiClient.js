import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: process.env.RAWG_API_KEY,
  },
});

class RAWGApiClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  getAll(config) {
    return axiosInstance.get(this.endpoint, config).then((res) => res.data);
  }

  get(id) {
    return axiosInstance.get(`${this.endpoint}/${id}`).then((res) => res.data);
  }
}

export default RAWGApiClient;
