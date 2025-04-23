"use client";

import { Cookies } from "@/constants/constant";
import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";

const baseURL = process.env.SERVICE_BASE_URL;
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = getCookie(Cookies.accessToken);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error.response);
  }
);

export { api };
