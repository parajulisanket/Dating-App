"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Import your step components
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

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Form data
  const [formData, setFormData] = useState<{
    name: string;
    dob: string;
    address: string;
    zodiac: string;
    gender: string;
    relation_interest: string;
    sexual_orientation: string;
    sexual_interest: string;
    hobbies: string;
    life_style: string;
    images: File[];
  }>({
    name: "",
    dob: "",
    address: "",
    zodiac: "",
    gender: "",
    relation_interest: "",
    sexual_orientation: "",
    sexual_interest: "",
    hobbies: "",
    life_style: "",
    images: [],
  });

  // Update field
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Navigation
  const goNext = () => {
    if (step === steps.length - 1) {
      // Last step - submit
      submitSetup();
    } else {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => setStep((s) => s - 1);
  const skipStep = () => setStep((s) => s + 1);

  // Submit
  const submitSetup = async () => {
    console.log("data", formData.hobbies);
    try {
      router.push("/home");
    } catch (error) {
      console.error("Setup failed:", error);
    }
  };

  // Define steps with their components
  const steps = [
    {
      component: NamePage,
      canSkip: false,
      props: {
        value: formData.name,
        onChange: (val: string) => updateField("name", val),
      },
    },
    {
      component: DobPage,
      canSkip: false,
      props: {
        value: formData.dob,
        onChange: (val: string) => updateField("dob", val),
      },
    },
    {
      component: AddressPage,
      canSkip: false,
      props: {
        value: formData.address,
        onChange: (val: string) => updateField("address", val),
      },
    },
    {
      component: ZodiacPage,
      canSkip: true,
      props: {
        value: formData.zodiac,
        onChange: (val: string) => updateField("zodiac", val),
      },
    },
    {
      component: GenderPage,
      canSkip: false,
      props: {
        value: formData.gender,
        onChange: (val: string) => updateField("gender", val),
      },
    },
    {
      component: RelationshipPage,
      canSkip: false,
      props: {
        value: formData.relation_interest,
        onChange: (val: string) => updateField("relation_interest", val),
      },
    },
    {
      component: OrientationPage,
      canSkip: true,
      props: {
        value: formData.sexual_orientation,
        onChange: (val: string) => updateField("sexual_orientation", val),
      },
    },
    {
      component: InterestedPage,
      canSkip: true,
      props: {
        value: formData.sexual_interest,
        onChange: (val: string) => updateField("sexual_interest", val),
      },
    },
    {
      component: HobbiesPage,
      canSkip: true,
      props: {
        value: formData.hobbies,
        onChange: (val: string) => updateField("hobbies", val),
      },
    },
    {
      component: LifestylePage,
      canSkip: true,
      props: {
        value: formData.life_style,
        onChange: (val: string) => updateField("life_style", val),
      },
    },
    {
      component: PhotosPage,
      canSkip: true,
      props: {
        value: formData.images,
        onChange: (val: any) => updateField("images", val),
      },
    },
  ];

  const CurrentStep = steps[step].component;
  const currentStepProps = {
    ...steps[step].props,
    onNext: goNext,
  };
  const canSkip = steps[step].canSkip;

  return (
    <div className="w-full max-w-[425px] h-screen max-h-dvh md:max-h-[897.22px]  grid grid-rows-[auto_1fr] bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={goBack}
          disabled={step === 0}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full disabled:opacity-30"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>

        {canSkip && (
          <button
            type="button"
            onClick={skipStep}
            className="text-heading text-base font-semibold hover:bg-[#f92fa2]/10 rounded-xl px-3 py-1 transition-colors"
          >
            Skip
          </button>
        )}
      </header>

      {/* RENDER CURRENT STEP COMPONENT */}
      <CurrentStep {...(currentStepProps as any)} onNext={goNext} />
    </div>
  );
}
