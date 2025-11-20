"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

interface AuthContextType {
  authTokens: { access: string } | null;
  storeLoginToken: (access: string) => void;
  verifyEmail: (access: string) => void;
  logout: () => void;
  authReady: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authTokens, setAuthTokens] = useState<{ access: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const encryptedAccess = Cookies.get("access_token");
    const init = () => {
      if (encryptedAccess) {
        try {
          if (SECRET_KEY) {
            const decryptedAccess = CryptoJS.AES.decrypt(
              encryptedAccess,
              SECRET_KEY
            ).toString(CryptoJS.enc.Utf8);
            setAuthTokens({ access: decryptedAccess });
          } else {
            console.warn("SECRET_KEY not found in environment variables.");
          }
        } catch (error) {
          console.error("Access token decryption failed!", error);
        }
      }
      setAuthReady(true);
    };
    init();
  }, []);

  const storeLoginToken = (access: string) => {
    if (access) {
      const encryptedAccess = CryptoJS.AES.encrypt(
        access,
        SECRET_KEY!
      ).toString();
      Cookies.set("access_token", encryptedAccess, { path: "/" });
      setAuthTokens({ access });
    }
  };

  const verifyEmail = (access: string) => {
    storeLoginToken(access);
  };

  const logout = () => {
    setAuthTokens(null);
    Cookies.remove("access_token", { path: "/" });
  };

  return (
    <AuthContext.Provider
      value={{ authTokens, storeLoginToken, verifyEmail, logout, authReady }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
