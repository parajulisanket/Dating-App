// import { useMemo } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// export default function useAxiosAuth() {
//   // use the provided `useAuth` hook which throws if not inside provider and has correct typings
//   const { authTokens, logout, storeLoginToken } = useAuth();

//   const api = useMemo(() => {
//     const instance = axios.create({ baseURL: BASE_URL });

//     // 1. Request: attach token
//     instance.interceptors.request.use((config: any) => {
//       console.log("authtokens", authTokens);
//       // ensure headers object exists then attach Authorization
//       config.headers = config.headers || {};
//       if (authTokens?.access) {
//         config.headers.Authorization = `Bearer ${authTokens.access}`;
//         console.log("Authorization header set:", config.headers.Authorization);
//       } else {
//         console.log("No auth token found");
//       }
//       return config;
//     });

//     return instance;
//   }, [authTokens, logout, storeLoginToken]);

//   return api;
// }

// app/hook/useAxiosAuth.ts
"use client";

import { useMemo } from "react";
import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function useAxiosAuth() {
  const { authTokens } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
    });

    // Request interceptor: attach token
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // make sure headers object exists
        const headers = (config.headers ??= {} as any);

        if (authTokens?.access) {
          headers.Authorization = `Bearer ${authTokens.access}`;
          console.log(
            "[axios] Authorization header set:",
            headers.Authorization
          );
        } else {
          console.log("[axios] No auth token found");
        }

        console.log(
          "[axios] Request URL:",
          `${config.baseURL ?? ""}${config.url ?? ""}`
        );

        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [authTokens]);

  return api;
}
