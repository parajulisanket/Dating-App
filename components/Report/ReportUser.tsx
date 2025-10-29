"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
// Types for backend integration
interface ReportData {
    reportedUserId: string;
    reason: string;
    additionalDetails: string;
}

// Report reason options
const REPORT_REASONS = [
    { id: "inappropriate-photos", label: "Inappropriate Photos" },
    { id: "spam-scam", label: "Spam or Scam" },
    { id: "fake-profile", label: "Fake Profile" },
    { id: "harassment", label: "Harassment or Hate Speech" },
    { id: "underage", label: "Underage User" },
    { id: "other", label: "Other" },
];

export const ReportUser = () => {
    const router = useRouter();
    const { theme } = useTheme()
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [additionalDetails, setAdditionalDetails] = useState<string>("");

    const handleReasonSelect = (reasonId: string) => {
        setSelectedReason(reasonId);
    };

    const handleAdditionalDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAdditionalDetails(e.target.value);
    };

    const handleSubmitReport = () => {
        if (!selectedReason) {
            alert("Please select a reason for reporting");
            return;
        }

        const reportData: ReportData = {
            reportedUserId: "user123", // This should come from props or context
            reason: selectedReason,
            additionalDetails: additionalDetails
        };

        console.log("Submitting report:", reportData);

    };

    const handleCancel = () => {
        console.log("Cancel report");
        router.back()

    };

    return (
        <main className="min-h-screen  flex flex-col items-center px-6 py-8">
            {/* Icon and Header */}
            <div className=" mb-8 flex-col flex items-center ">
                <Image
                    src='/icons/report.svg'
                    alt='report'
                    height={120}
                    width={120}
                    className="h-[120px] w-[120px]"
                />
                <h1 className="text-[24px] font-bold  mb-2">Report User</h1>
                <p className={`text-[14px] ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-400'}`}>Help us keep the community safe.</p>
            </div>

            {/* Report Reasons Section */}
            <div className="w-full max-w-md mb-6">
                <h2 className="text-[16px] font-bold  mb-2 leading-[20px]">
                    Why are you reporting this profile?
                </h2>
                <p className={`text-[12px] ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-400'} mb-4`}>Select an option</p>

                <div className="flex flex-wrap gap-2">
                    {REPORT_REASONS.map((reason) => (
                        <button
                            key={reason.id}
                            onClick={() => handleReasonSelect(reason.id)}
                            className={`px-4 py-2 rounded-full text-[14px] border transition-all ${selectedReason === reason.id
                                ? "bg-primary-500/10 text-primary-500 border-primary-500/40"
                                : "  border-neutral-200 text-neutral-1000"
                                }`}
                        >
                            {reason.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Additional Details Section */}
            <div className="w-full max-w-md mb-6">
                <h2 className="text-[16px] font-semibold  mb-3">
                    Additional Details
                </h2>
                <textarea
                    value={additionalDetails}
                    onChange={handleAdditionalDetailsChange}
                    placeholder="Tell us what happened...."
                    className="min-h-[120px] textarea no-scrollbar"
                />
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-md space-y-3 mt-auto">
                <button
                    onClick={handleSubmitReport}
                    className="w-full bg-gradient-to-r from-[#f9209b] to-[#ff6b9d] text-white py-3 rounded-full text-[16px] font-semibold hover:shadow-lg transition-shadow"
                >
                    Submit Report
                </button>
                <button
                    onClick={handleCancel}
                    className="w-full text-[#f9209b] py-3 text-[16px] font-semibold"
                >
                    Cancel
                </button>
            </div>
        </main>
    );
};