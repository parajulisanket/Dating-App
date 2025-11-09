"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";

function toStr(x: any) {
  if (x == null) return "";
  return typeof x === "string" ? x : String(x);
}
function isObj(v: any) {
  return v && typeof v === "object";
}
function deepFindFirst(obj: any, keyRx: RegExp): any {
  const seen = new Set<any>();
  const stack = [obj];
  while (stack.length) {
    const cur = stack.pop();
    if (!isObj(cur) || seen.has(cur)) continue;
    seen.add(cur);
    for (const [k, v] of Object.entries(cur)) {
      if (keyRx.test(k)) return v;
      if (isObj(v)) stack.push(v);
    }
  }
  return undefined;
}
function readNameFromJwt(token?: string): string {
  if (!token) return "";
  try {
    const part = token.split(".")[1];
    if (!part) return "";
    const json = decodeURIComponent(
      atob(part.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(json);
    const v =
      payload.full_name ??
      payload.name ??
      [payload.first_name, payload.last_name].filter(Boolean).join(" ");
    return toStr(v).trim();
  } catch {
    return "";
  }
}

export const Header = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { authTokens, authReady } = useAuth();
  const [name, setName] = useState<string>("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;
    if (!authReady) return;

    const token = authTokens?.access;
    if (!token) {
      setName("");
      return;
    }

    async function fetchWith(prefix: "Bearer" | "JWT") {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `${prefix} ${token}`,
      };
      const res = await apiPublic.get("/user/profile-detail/", { headers });
      return res?.data ?? {};
    }

    (async () => {
      try {
        const raw = await fetchWith("Bearer");
        if (cancelled) return;
        const profile = raw?.profile ?? raw;

        const found =
          deepFindFirst(profile, /(full[_-]?name|display[_-]?name)/i) ??
          ([
            deepFindFirst(profile, /first[_-]?name/i),
            deepFindFirst(profile, /last[_-]?name/i),
          ]
            .filter(Boolean)
            .join(" ") ||
            deepFindFirst(profile, /\bname\b/i) ||
            deepFindFirst(profile?.user ?? {}, /(full[_-]?name|name)/i));
        const n = toStr(found).trim();
        setName(n || readNameFromJwt(token) || "—");
      } catch (e: any) {
        // Try JWT auth scheme once
        if (e?.response?.status === 401) {
          try {
            const raw2 = await fetchWith("JWT");
            if (cancelled) return;
            const profile = raw2?.profile ?? raw2;
            const found =
              deepFindFirst(profile, /(full[_-]?name|display[_-]?name)/i) ??
              ([
                deepFindFirst(profile, /first[_-]?name/i),
                deepFindFirst(profile, /last[_-]?name/i),
              ]
                .filter(Boolean)
                .join(" ") ||
                deepFindFirst(profile, /\bname\b/i) ||
                deepFindFirst(profile?.user ?? {}, /(full[_-]?name|name)/i));
            const n = toStr(found).trim();
            setName(n || readNameFromJwt(token) || "—");
          } catch {
            setName(readNameFromJwt(token) || "—");
          }
        } else {
          setName(readNameFromJwt(token) || "—");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, authTokens]);

  return (
    <header className="sticky top-0 px-6 h-[48px] bg-background z-40 flex items-center justify-between  border-b border-b-borderButton ">
      <div className="flex items-center gap-3 text-heading">
        <h1 className="text-[16px] leading-[20px] font-bold">{name || ""}</h1>
      </div>

      <Link className="click-effect" href="/settings">
        {mounted ? (
          resolvedTheme === "light" ? (
            <Image src="/settings.svg" alt="Settings" width={24} height={24} />
          ) : (
            <Image
              src="/settingsDark.svg"
              alt="Settings"
              width={24}
              height={24}
            />
          )
        ) : (
          <span className="inline-block w-6 h-6" aria-hidden />
        )}
      </Link>
    </header>
  );
};
