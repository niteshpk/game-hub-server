import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";

dotenv.config();

interface RAWGConfig extends AxiosRequestConfig {
  params?: Record<string, string | number | boolean | undefined>;
}

interface RAWGResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: process.env.RAWG_API_KEY,
  },
});

class RAWGApiClient {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll<T>(config?: RAWGConfig): Promise<RAWGResponse<T>> {
    const response = await axiosInstance.get<RAWGResponse<T>>(
      this.endpoint,
      config
    );
    return response.data;
  }

  async get<T>(id: string): Promise<T> {
    const response = await axiosInstance.get<T>(`${this.endpoint}/${id}`);
    return response.data;
  }
}

export default RAWGApiClient;
