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
  verifyEmail: (access: string) => void;
  logout: () => void;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authTokens, setAuthTokens] = useState<{ access: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const encryptedAccess = Cookies.get("access_token");
    const init = () => {
      if (encryptedAccess) {
        try {
          const decryptedAccess = CryptoJS.AES.decrypt(
            encryptedAccess,
            SECRET_KEY!
          ).toString(CryptoJS.enc.Utf8);

          setAuthTokens({ access: decryptedAccess });
        } catch (error) {
          console.error("Access token decryption failed!", error);
        }
      }
      setAuthReady(true);
    };
    init();
  }, []);

  const verifyEmail = (access: string) => {
    console.log("hello", access);

    if (access) {
      console.log("inside if");
      console.log("SECRET_KEY", SECRET_KEY);

      const encryptedAccess = CryptoJS.AES.encrypt(
        access,
        SECRET_KEY!
      ).toString();

      console.log("encryptedAccess", encryptedAccess);

      console.log({ access });
      Cookies.set("access_token", encryptedAccess, {
        path: "/",
      });
      setAuthTokens({ access });
    }
  };

  const logout = () => {
    setAuthTokens(null);
    Cookies.remove("access_token");
  };

  return (
    <AuthContext.Provider
      value={{ authTokens, verifyEmail, logout, authReady }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook from the same file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
