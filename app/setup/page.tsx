// "use client";

// import { useState, useCallback, useEffect } from "react";
// import { ChevronLeft } from "lucide-react";
// import { useRouter } from "next/navigation";

// import NamePage from "@/components/name/page";
// import DobPage from "@/components/dob/page";
// import AddressPage from "@/components/address/page";
// import ZodiacPage from "@/components/zodiac/page";
// import GenderPage from "@/components/gender/page";
// import InterestedPage from "@/components/interested/page";
// import LifestylePage from "@/components/lifestyle/page";
// import HobbiesPage from "@/components/hobbies/page";
// import OrientationPage from "@/components/orientation/page";
// import PhotosPage from "@/components/photos/page";
// import RelationshipPage from "@/components/relationship/page";

// import apiPublic from "@/api";
// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";
// const API = process.env.NEXT_PUBLIC_API_BASE;

// export default function SetupPage() {
//   const router = useRouter();
//   const { authTokens } = useAuth(); // get Bearer token
//   const [step, setStep] = useState(0);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploadPct, setUploadPct] = useState<number>(0);

//   const [skipDisabled, setSkipDisabled] = useState(false);

//   const [formData, setFormData] = useState<{
//     name: string;
//     dob: string;
//     location: string;
//     zodiac: string;
//     gender: string;
//     relationship: string;
//     sexual_orientation: string;
//     interested_in: string;
//     hobbies: string[];
//     lifestyle: string;
//     images: File[];
//     show_orientation: false;
//   }>({
//     name: "",
//     dob: "",
//     location: "",
//     zodiac: "",
//     gender: "",
//     relationship: "",
//     sexual_orientation: "",
//     interested_in: "",
//     hobbies: [],
//     lifestyle: "",
//     images: [],
//     show_orientation: false,
//   });

//   const handleHobbiesChange = useCallback(
//     (names: string[]) => updateField("hobbies", names),
//     []
//   );

//   const handleImagesChange = useCallback(
//     (files: File[]) => updateField("images", files),
//     []
//   );

//   const updateField = (field: string, value: any) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const goNext = () => {
//     if (step === steps.length - 1) {
//       submitSetup(); //  hit API only at the end
//     } else {
//       setStep((s) => s + 1);
//     }
//   };

//   const goBack = () => setStep((s) => s - 1);
//   const skipStep = () => setStep((s) => s + 1);

//   useEffect(() => {
//     setSkipDisabled(false);
//   }, [step]);

//   // THE IMPORTANT PART
//   const submitSetup = async () => {
//     if (submitting) return;
//     try {
//       setSubmitting(true);
//       setUploadPct(0);

//       // Build multipart payload
//       const fd = new FormData();
//       fd.append("full_name", formData.name);
//       fd.append("dob", (formData.dob ?? "").slice(0, 10));
//       fd.append("gender", formData.gender.toLowerCase());
//       fd.append("zodiac_sign", formData.zodiac.toLowerCase());
//       fd.append("location", formData.location ?? "");
//       fd.append("relationship", formData.relationship);
//       fd.append("sexual_orientation", formData.sexual_orientation);
//       fd.append(
//         "show_orientation",
//         formData.show_orientation ? "true" : "false"
//       );
//       fd.append("interested_in", formData.interested_in);
//       (formData.hobbies ?? []).forEach((name, idx) => {
//         if (name) fd.append(`hobbies[${idx}]`, name);
//       });

//       // lifestyle part
//       try {
//         const ls = JSON.parse(formData.lifestyle || "{}") as Partial<{
//           drink_choice: string;
//           smoke_choice: string;
//           active_choice: string;
//           diet_choice: string;
//           travel_choice: string;
//           pet_choice: string;
//         }>;

//         const setIf = (k: keyof typeof ls) => {
//           const v = (ls[k] || "").trim();
//           if (v) fd.set(`lifestyle[${k}]`, v);
//         };

//         setIf("drink_choice");
//         setIf("smoke_choice");
//         setIf("active_choice");
//         setIf("diet_choice");
//         setIf("travel_choice");
//         setIf("pet_choice");
//       } catch {
//         console.warn("Invalid lifestyle JSON; skipping lifestyle fields");
//       }

//       // images part
//       (formData.images ?? []).forEach((file, idx) => {
//         if (file instanceof File) {
//           fd.append(`images_data[${idx}][photo]`, file);
//         }
//       });

//       const headers: Record<string, string> = {};
//       if (authTokens?.access)
//         headers["Authorization"] = `Bearer ${authTokens.access}`;
//       const res = await apiPublic.post("/user/profile-create/", fd, {
//         headers,
//         onUploadProgress: (e) => {
//           if (!e.total) return;
//           setUploadPct(Math.round((e.loaded * 100) / e.total));
//         },
//       });

//       //const res=await api.post('apihit',{pl})

//       // success  send user forward
//       if (res.status >= 200 && res.status < 300) {
//         router.replace("/home");
//       } else {
//         console.error("Unexpected response:", res.status, res.data);
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         console.error(
//           "Setup error:",
//           err.response?.status,
//           err.response?.data || err.message
//         );
//       } else {
//         console.error("Setup error:", err);
//       }
//     } finally {
//       setSubmitting(false);
//       setUploadPct(0);
//     }
//   };

//   const steps = [
//     {
//       component: NamePage,
//       canSkip: false,
//       props: {
//         value: formData.name,
//         onChange: (v: string) => updateField("name", v),
//       },
//     },
//     {
//       component: DobPage,
//       canSkip: false,
//       props: {
//         value: formData.dob,
//         onChange: (v: string) => updateField("dob", v),
//       },
//     },
//     {
//       component: AddressPage,
//       canSkip: false,
//       props: {
//         value: formData.location,
//         onChange: (v: string) => updateField("location", v),
//       },
//     },
//     {
//       component: ZodiacPage,
//       canSkip: true,
//       props: {
//         value: formData.zodiac,
//         onChange: (v: string) => updateField("zodiac", v),
//         setSkipDisabled,
//       },
//     },
//     {
//       component: GenderPage,
//       canSkip: false,
//       props: {
//         value: formData.gender,
//         onChange: (v: string) => updateField("gender", v),
//       },
//     },
//     {
//       component: RelationshipPage,
//       canSkip: false,
//       props: {
//         value: formData.relationship,
//         onChange: (v: string) => updateField("relationship", v),
//       },
//     },
//     {
//       component: OrientationPage,
//       canSkip: true,
//       props: {
//         value: formData.sexual_orientation,
//         show: formData.show_orientation,
//         onChange: (v: string) => updateField("sexual_orientation", v),
//         onToggle: (b: boolean) => updateField("show_orientation", b),
//         setSkipDisabled,
//       },
//     },
//     {
//       component: InterestedPage,
//       canSkip: true,
//       props: {
//         value: formData.interested_in,
//         onChange: (v: string) => updateField("interested_in", v),
//         setSkipDisabled,
//       },
//     },
//     {
//       component: HobbiesPage,
//       canSkip: true,
//       props: {
//         value: formData.hobbies,
//         onChange: handleHobbiesChange,
//         setSkipDisabled,
//       },
//     },
//     {
//       component: LifestylePage,
//       canSkip: true,
//       props: {
//         value: formData.lifestyle,
//         onChange: (v: string) => updateField("lifestyle", v),
//         setSkipDisabled,
//       },
//     },
//     {
//       component: PhotosPage,
//       canSkip: false,
//       props: {
//         value: formData.images,
//         onChange: handleImagesChange,
//         setSkipDisabled,
//       },
//     },
//   ];

//   const CurrentStep = steps[step].component;
//   const canSkip = steps[step].canSkip;

//   return (
//     <div className="w-full max-w-[425px] h-screen max-h-dvh md:max-h-[897.22px] grid grid-rows-[auto_1fr] bg-background overflow-hidden">
//       {/* HEADER */}
//       <header className="flex items-center justify-between px-4 pt-6 pb-2">
//         <button
//           onClick={goBack}
//           disabled={step === 0 || submitting}
//           aria-label="Back"
//           className="text-heading px-2 -ml-2 rounded-full "
//         >
//           <ChevronLeft size={32} strokeWidth={1.5} />
//         </button>

//         {canSkip && (
//           <button
//             type="button"
//             onClick={skipStep}
//             disabled={submitting || skipDisabled}
//             className="text-heading text-base font-semibold hover:bg-[#f92fa2]/10 rounded-xl px-3 py-1 transition-colors disabled:opacity-50"
//           >
//             Skip
//           </button>
//         )}
//       </header>

//       {/* CURRENT STEP */}
//       <CurrentStep
//         {...(steps[step].props as any)}
//         onNext={goNext}
//         submitting={submitting}
//         uploadPct={uploadPct}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import NamePage from "@/components/name/page";
import DobPage from "@/components/dob/page";
import AddressPage from "@/components/address/page";
import ZodiacPage from "@/components/zodiac/page";
import GenderPage from "@/components/gender/page";
import InterestedPage from "@/components/interested/page";
import LifestylePage from "@/components/lifestyle/page";
import HobbiesPage from "@/components/hobbies/page";
import OrientationPage from "@/components/orientation/page";
import PhotosPage from "@/components/photos/page";
import RelationshipPage from "@/components/relationship/page";

import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

/** Read has_profile from JWT (same tolerant logic as login is not required here) */
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
    const v =
      payload.has_profile ??
      payload.profile_completed ??
      payload.profileComplete ??
      payload.profile_done;
    if (typeof v === "boolean") return v;
    if (v === 1 || v === "1" || v === "true") return true;
    if (v === 0 || v === "0" || v === "false") return false;
    return null;
  } catch {
    return null;
  }
}

type LifestyleJSON = Partial<{
  drink_choice: string;
  smoke_choice: string;
  active_choice: string;
  diet_choice: string;
  travel_choice: string;
  pet_choice: string;
}>;

interface ProfileFormData {
  name: string;
  dob: string;
  location: string;
  zodiac: string;
  gender: string;
  relationship: string;
  sexual_orientation: string;
  interested_in: string;
  hobbies: string[];
  lifestyle: string; // JSON string
  images: File[];
  show_orientation: boolean;
}

export default function SetupPage() {
  const router = useRouter();
  const { authTokens, storeLoginToken } = useAuth();

  const [gateReady, setGateReady] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadPct, setUploadPct] = useState<number>(0);
  const [skipDisabled, setSkipDisabled] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    dob: "",
    location: "",
    zodiac: "",
    gender: "",
    relationship: "",
    sexual_orientation: "",
    interested_in: "",
    hobbies: [],
    lifestyle: "",
    images: [],
    show_orientation: false,
  });

  // Route guard for setup
  useEffect(() => {
    const token = authTokens?.access;
    if (!token) {
      router.replace("/login");
      return;
    }
    const hasProfile = readHasProfileFromJwt(token);
    if (hasProfile === true) {
      router.replace("/home");
      return;
    }
    setGateReady(true);
  }, [authTokens, router]);

  const updateField = (field: keyof ProfileFormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleHobbiesChange = useCallback(
    (names: string[]) => updateField("hobbies", names),
    []
  );

  const handleImagesChange = useCallback(
    (files: File[]) => updateField("images", files),
    []
  );

  const goNext = () => {
    if (step === steps.length - 1) {
      submitSetup();
    } else {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const skipStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));

  useEffect(() => {
    setSkipDisabled(false);
  }, [step]);

  // Required fields (photos optional)
  const requiredOk = useMemo(() => {
    const hasCore =
      formData.name.trim().length > 0 &&
      formData.dob.trim().length >= 4 &&
      formData.location.trim().length > 0 &&
      formData.gender.trim().length > 0 &&
      formData.relationship.trim().length > 0;
    return hasCore;
  }, [formData]);

  const submitSetup = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      setUploadPct(0);

      if (!requiredOk) {
        setSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append("full_name", formData.name);
      fd.append("dob", (formData.dob ?? "").slice(0, 10));
      fd.append("gender", (formData.gender || "").toLowerCase());
      fd.append("zodiac_sign", (formData.zodiac || "").toLowerCase());
      fd.append("location", formData.location ?? "");
      fd.append("relationship", formData.relationship);
      fd.append("sexual_orientation", formData.sexual_orientation);
      fd.append(
        "show_orientation",
        formData.show_orientation ? "true" : "false"
      );
      fd.append("interested_in", formData.interested_in);

      (formData.hobbies ?? []).forEach((name, idx) => {
        if (name) fd.append(`hobbies[${idx}]`, name);
      });

      try {
        const ls = JSON.parse(formData.lifestyle || "{}") as LifestyleJSON;
        const setIf = (k: keyof LifestyleJSON) => {
          const v = (ls[k] || "").toString().trim();
          if (v) fd.set(`lifestyle[${k}]`, v);
        };
        setIf("drink_choice");
        setIf("smoke_choice");
        setIf("active_choice");
        setIf("diet_choice");
        setIf("travel_choice");
        setIf("pet_choice");
      } catch {
        console.warn("Invalid lifestyle JSON; skipping lifestyle fields");
      }

      (formData.images ?? []).forEach((file, idx) => {
        if (file instanceof File) {
          fd.append(`images_data[${idx}][photo]`, file);
        }
      });

      const headers: Record<string, string> = {};
      const token = authTokens?.access;
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await apiPublic.post("/user/profile-create/", fd, {
        headers,
        onUploadProgress: (e) => {
          if (!e.total) return;
          setUploadPct(Math.round((e.loaded * 100) / e.total));
        },
      });

      if (res.status >= 200 && res.status < 300) {
        // IMPORTANT: if backend sends a fresh token (now with has_profile=true),
        // store it so all future checks & logins work as expected.
        const newToken: string | undefined =
          res.data?.access || res.data?.token;
        if (newToken) {
          storeLoginToken(newToken);
        }
        // Go home now that setup is complete
        router.replace("/home");
      } else {
        console.error("Unexpected response:", res.status, res.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Setup error:",
          err.response?.status,
          err.response?.data || err.message
        );
      } else {
        console.error("Setup error:", err);
      }
    } finally {
      setSubmitting(false);
      setUploadPct(0);
    }
  };

  const steps = [
    {
      component: NamePage,
      canSkip: false,
      props: {
        value: formData.name,
        onChange: (v: string) => updateField("name", v),
      },
    },
    {
      component: DobPage,
      canSkip: false,
      props: {
        value: formData.dob,
        onChange: (v: string) => updateField("dob", v),
      },
    },
    {
      component: AddressPage,
      canSkip: false,
      props: {
        value: formData.location,
        onChange: (v: string) => updateField("location", v),
      },
    },
    {
      component: ZodiacPage,
      canSkip: true,
      props: {
        value: formData.zodiac,
        onChange: (v: string) => updateField("zodiac", v),
        setSkipDisabled,
      },
    },
    {
      component: GenderPage,
      canSkip: false,
      props: {
        value: formData.gender,
        onChange: (v: string) => updateField("gender", v),
      },
    },
    {
      component: RelationshipPage,
      canSkip: false,
      props: {
        value: formData.relationship,
        onChange: (v: string) => updateField("relationship", v),
      },
    },
    {
      component: OrientationPage,
      canSkip: true,
      props: {
        value: formData.sexual_orientation,
        show: formData.show_orientation,
        onChange: (v: string) => updateField("sexual_orientation", v),
        onToggle: (b: boolean) => updateField("show_orientation", b),
        setSkipDisabled,
      },
    },
    {
      component: InterestedPage,
      canSkip: true,
      props: {
        value: formData.interested_in,
        onChange: (v: string) => updateField("interested_in", v),
        setSkipDisabled,
      },
    },
    {
      component: HobbiesPage,
      canSkip: true,
      props: {
        value: formData.hobbies,
        onChange: handleHobbiesChange,
        setSkipDisabled,
      },
    },
    {
      component: LifestylePage,
      canSkip: true,
      props: {
        value: formData.lifestyle,
        onChange: (v: string) => updateField("lifestyle", v),
        setSkipDisabled,
      },
    },
    {
      component: PhotosPage,
      canSkip: false,
      props: {
        value: formData.images,
        onChange: handleImagesChange,
        setSkipDisabled,
      },
    },
  ] as const;

  if (!gateReady) return null;

  const CurrentStep = steps[step].component;
  const canSkip = steps[step].canSkip;

  return (
    <div className="w-full max-w-[425px] h-screen max-h-dvh md:max-h-[897.22px] grid grid-rows-[auto_1fr] bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={goBack}
          disabled={step === 0 || submitting}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full "
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>

        {canSkip && (
          <button
            type="button"
            onClick={skipStep}
            disabled={submitting || skipDisabled}
            className="text-heading text-base font-semibold hover:bg-[#f92fa2]/10 rounded-xl px-3 py-1 transition-colors disabled:opacity-50"
          >
            Skip
          </button>
        )}
      </header>

      {/* CURRENT STEP */}
      <CurrentStep
        {...(steps[step].props as any)}
        onNext={goNext}
        submitting={submitting}
        uploadPct={uploadPct}
      />
    </div>
  );
}
