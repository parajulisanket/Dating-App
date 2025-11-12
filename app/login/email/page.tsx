// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect, FormEvent, useMemo } from "react";
// import { Check, Eye, EyeOff, ChevronLeft } from "lucide-react";
// import Link from "next/link";
// import { useTheme } from "next-themes";
// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";
// import WarningTryAgainDialog from "@/components/dialogs/WarningTryAgainDialog";
// import InfoDialog from "@/components/dialogs/InfoDialog";

// export default function LoginEmailPage() {
//   const router = useRouter();
//   const { storeLoginToken } = useAuth();
//   const [email, setEmail] = useState("");
//   const [pwd, setPwd] = useState("");
//   const [remember, setRemember] = useState(true);
//   const [showPwd, setShowPwd] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const [warnOpen, setWarnOpen] = useState(false);
//   const [warnDesc, setWarnDesc] = useState<React.ReactNode>(null);
//   const [infoOpen, setInfoOpen] = useState(false);
//   const [infoDesc, setInfoDesc] = useState<React.ReactNode>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const { resolvedTheme } = useTheme();
//   const valid = useMemo(
//     () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && pwd.length >= 6,
//     [email, pwd]
//   );

//   async function onSubmit(e: FormEvent) {
//     e.preventDefault();
//     if (!valid || loading) return;

//     setErrorMsg("");
//     setWarnOpen(false);
//     setInfoOpen(false);
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE}/user/login/`,
//         {
//           email: email.trim(),
//           password: pwd.trim(),
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const token: string | undefined = res.data?.access || res.data?.token;
//       if (!token) throw new Error("No token received from server");

//       storeLoginToken(token);

//       // Remember-me preference
//       if (remember) localStorage.setItem("remember_me", "1");
//       else localStorage.removeItem("remember_me");

//       router.push("/home");
//     } catch (err: any) {
//       console.error("Login error:", err?.response?.data || err);

//       const status = err?.response?.status;
//       const data = err?.response?.data;
//       const msg =
//         data?.message ||
//         data?.detail ||
//         (typeof data === "string" ? data : "") ||
//         "";

//       if (status === 401 || /password/i.test(msg) || /credential/i.test(msg)) {
//         setWarnDesc("Wrong password. Please try again.");
//         setWarnOpen(true);
//         setErrorMsg("");
//         return;
//       }

//       if (
//         status === 400 ||
//         status === 422 ||
//         (/email/i.test(msg) &&
//           /invalid|not\s*found|does\s*not\s*exist|unregistered/i.test(msg))
//       ) {
//         setInfoDesc(msg || "Please enter a valid email address.");
//         setInfoOpen(true);
//         setErrorMsg("");
//         return;
//       }

//       // Fallback: keep your inline error too
//       const fallback =
//         "Unable to log in. Check your email/password and try again.";
//       setErrorMsg(msg || fallback);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!mounted) return null;

//   return (
//     <div className="flex min-h-svh items-center justify-center ">
//       <WarningTryAgainDialog open={warnOpen} onOpenChange={setWarnOpen}>
//         {warnDesc}
//       </WarningTryAgainDialog>
//       <InfoDialog open={infoOpen} onOpenChange={setInfoOpen}>
//         {infoDesc}
//       </InfoDialog>

//       <div
//         className="
//           w-full max-w-[425px] min-h-svh
//           grid grid-rows-[auto_1fr_auto]
//           bg-background overflow-hidden
//         "
//       >
//         <header className="flex flex-col items-start px-4 pt-6">
//           <Link
//             href="/login"
//             aria-label="Back"
//             className="text-heading px-2 -ml-2 rounded-full"
//           >
//             <ChevronLeft size={32} strokeWidth={1.5} />
//           </Link>
//         </header>

//         <main className="px-4">
//           <h1 className="title mt-4 leading-10 text-left">Log In</h1>

//           <form
//             id="login-email-form"
//             onSubmit={onSubmit}
//             className="mt-8 space-y-4"
//           >
//             <input
//               type="email"
//               autoComplete="email"
//               inputMode="email"
//               placeholder="Enter your email address"
//               className="input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//             />

//             <div className="relative">
//               <input
//                 type={showPwd ? "text" : "password"}
//                 autoComplete="current-password"
//                 placeholder="Enter your password"
//                 className="input pr-12"
//                 value={pwd}
//                 onChange={(e) => setPwd(e.target.value)}
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPwd((s) => !s)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
//                 aria-label={showPwd ? "Hide password" : "Show password"}
//               >
//                 {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
//               </button>
//             </div>

//             {errorMsg && (
//               <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
//             )}

//             <div className="mt-4 flex items-center justify-between">
//               <label className="inline-flex items-center gap-2 select-none">
//                 <span className="relative">
//                   <input
//                     type="checkbox"
//                     checked={remember}
//                     onChange={(e) => setRemember(e.target.checked)}
//                     className="peer h-4 w-4 appearance-none rounded border border-primary-500 bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
//                     disabled={loading}
//                   />
//                   {remember && (
//                     <Check
//                       size={16}
//                       className="absolute left-0 top-0.5 text-white pointer-events-none"
//                       strokeWidth={2}
//                     />
//                   )}
//                 </span>
//                 <p
//                   className={`-mt-0.5 text-[13px] leading-6 ${
//                     resolvedTheme === "light"
//                       ? "text-neutral-600"
//                       : "text-neutral-500"
//                   }`}
//                 >
//                   Remember me
//                 </p>
//               </label>

//               <Link
//                 href="/login/forgot"
//                 className="text-primary-500 text-[16px] font-semibold"
//               >
//                 Forgot Password?
//               </Link>
//             </div>
//           </form>
//         </main>

//         <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
//           <button
//             type="submit"
//             onClick={() =>
//               (
//                 document.querySelector(
//                   "#login-email-form"
//                 ) as HTMLFormElement | null
//               )?.requestSubmit()
//             }
//             disabled={loading}
//             className="btn btn-signup w-full cursor-pointer"
//           >
//             {loading ? "Logging in..." : "Log In"}
//           </button>
//         </footer>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, useMemo } from "react";
import { Check, Eye, EyeOff, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import WarningTryAgainDialog from "@/components/dialogs/WarningTryAgainDialog";
import InfoDialog from "@/components/dialogs/InfoDialog";

function coerceBool(v: any): boolean | null {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (["1", "true", "yes", "y"].includes(s)) return true;
    if (["0", "false", "no", "n"].includes(s)) return false;
  }
  return null;
}

function findHasProfile(obj: any): boolean | null {
  const KEY_RX =
    /(has[_-]?profile|profile[_-]?complete(d)?|profile[_-]?done|profileComplete|profileCompleted)/i;
  try {
    const stack = [obj];
    const seen = new Set<any>();
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
      seen.add(cur);

      if (Array.isArray(cur)) {
        for (const v of cur) stack.push(v);
        continue;
      }

      for (const [k, v] of Object.entries(cur)) {
        if (KEY_RX.test(k)) {
          const b = coerceBool(v);
          if (b !== null) return b;
        }
        if (v && typeof v === "object") stack.push(v);
      }
    }
  } catch {}
  return null;
}
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readHasProfileFromBody(body: any): boolean | null {
  return findHasProfile(body);
}

function readHasProfileFromJwt(token?: string | null): boolean | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = decodeURIComponent(
      atob(part.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(json);
    return findHasProfile(payload);
  } catch {
    return null;
  }
}

export default function LoginEmailPage() {
  const router = useRouter();
  const { storeLoginToken } = useAuth();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [warnOpen, setWarnOpen] = useState(false);
  const [warnDesc, setWarnDesc] = useState<React.ReactNode>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoDesc, setInfoDesc] = useState<React.ReactNode>(null);

  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!EMAIL_RX.test(email.trim())) {
      setInfoDesc("Invalid email. Please enter a valid email.");
      setInfoOpen(true);
      return;
    }

    if (pwd.trim().length < 8) {
      setInfoDesc("Password must be at least 8 characters.");
      setInfoOpen(true);
      return;
    }

    setWarnOpen(false);
    setInfoOpen(false);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/login/`,
        { email: email.trim(), password: pwd.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
      // console.log("-----login page-----", res.data);

      const token: string | undefined = res.data?.access || res.data?.token;
      if (!token) throw new Error("No token received from server");

      // Save token (your encryption + cookie)
      storeLoginToken(token);
      if (remember) localStorage.setItem("remember_me", "1");
      else localStorage.removeItem("remember_me");

      // Prefer body, else JWT; default false
      const fromBody = readHasProfileFromBody(res.data);
      const hasProfile =
        fromBody !== null ? fromBody : readHasProfileFromJwt(token) ?? false;

      // Route
      router.replace(hasProfile ? "/home" : "/setup");
    } catch (err: any) {
      console.error("Login error:", err?.response?.data || err);

      const status = err?.response?.status;
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        "";

      if (status === 401 || /password/i.test(msg) || /credential/i.test(msg)) {
        setWarnDesc("Incorrect email or password.");
        setWarnOpen(true);
        return;
      }

      if (
        status === 400 ||
        status === 422 ||
        (/email/i.test(msg) &&
          /invalid|not\s*found|does\s*not\s*exist|unregistered/i.test(msg))
      ) {
        setInfoDesc(msg || "Please enter a valid email address.");
        setInfoOpen(true);
        return;
      }

      setInfoDesc(msg || "Service Temporarily Unavailable.");
      setInfoOpen(true);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-svh items-center justify-center ">
      <WarningTryAgainDialog open={warnOpen} onOpenChange={setWarnOpen}>
        {warnDesc}
      </WarningTryAgainDialog>
      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen}>
        {infoDesc}
      </InfoDialog>

      <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
        <header className="flex flex-col items-start px-4 pt-6">
          <Link
            href="/login"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        </header>
        <main className="px-4">
          <h1 className="title mt-4 leading-10 text-left">Log In</h1>

          <form
            id="login-email-form"
            onSubmit={onSubmit}
            noValidate
            className="mt-8 space-y-4"
          >
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Enter your email address"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="input pr-12"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {/* 
            {errorMsg && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )} */}

            <div className="mt-4 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 select-none">
                <span className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="peer h-4 w-4 appearance-none rounded border border-primary-500 bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
                    disabled={loading}
                  />
                  {remember && (
                    <Check
                      size={16}
                      className="absolute left-0 top-0.5 text-white pointer-events-none"
                      strokeWidth={2}
                    />
                  )}
                </span>
                <p
                  className={`-mt-0.5 text-[13px] leading-6 ${
                    resolvedTheme === "light"
                      ? "text-neutral-600"
                      : "text-neutral-500"
                  }`}
                >
                  Remember me
                </p>
              </label>

              <Link
                href="/login/forgot"
                className="text-primary-500 text-[16px] font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </main>

        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <button
            type="submit"
            onClick={() =>
              (
                document.querySelector(
                  "#login-email-form"
                ) as HTMLFormElement | null
              )?.requestSubmit()
            }
            disabled={loading}
            className="btn btn-signup w-full cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </footer>
      </div>
    </div>
  );
}
