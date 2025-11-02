"use client";
import { useRouter } from "next/navigation";
import SignUpEmailForm from "@/components/auth/SignUpEmailForm";
// import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE; // undefined while backend is off

export default function EmailPage() {
  const router = useRouter();
  return <SignUpEmailForm  />;
}
