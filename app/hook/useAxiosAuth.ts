// src/hooks/useAxiosAuth.js
import { useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_API_BASE_URL;

export default function useAxiosAuth() {
  // use the provided `useAuth` hook which throws if not inside provider and has correct typings
  const { authTokens, logout, storeLoginToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: BASE_URL });

    // 1. Request: attach token
    instance.interceptors.request.use((config: any) => {
      console.log("authtokens", authTokens);
      // ensure headers object exists then attach Authorization
      config.headers = config.headers || {};
      if (authTokens?.access) {
        config.headers.Authorization = `Bearer ${authTokens.access}`;
        console.log("Authorization header set:", config.headers.Authorization);
      } else {
        console.log("No auth token found");
      }
      return config;
    });

    return instance;
  }, [authTokens, logout, storeLoginToken]);

  return api;
}
