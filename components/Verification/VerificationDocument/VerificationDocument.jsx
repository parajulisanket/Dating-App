'use client'
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
export function VerificationDocument() {
    const router = useRouter()
    const [selectedDocument, setSelectedDocument] = useState('national-id');
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const documents = [
        { id: 'national-id', label: 'National ID Card' },
        { id: 'citizenship', label: 'Citizenship' },
        { id: 'driving-license', label: 'Driving License' }
    ];
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) {
        return
    }
    return (
        <main className="relative h-screen  flex flex-col justify-between max-h-[897.222px] max-md:max-h-dvh ">
            <div>
                <div className="px-4 py-4 flex items-center justify-end">
                    <button aria-label="Close" className="text-heading" onClick={() => router.push('/verification')}>
                        <X size={24} strokeWidth={2} />
                    </button>
                </div>
                <div className="px-4 mt-2">
                    <h1 className="text-[24px] font-bold leading-[36px] ">
                        Select your verification<br />document
                    </h1>
                </div>

                <div className="px-4 mt-6 flex  flex-col gap-3 ">
                    {documents.map((doc) => (
                        <button
                            key={doc.id}
                            onClick={() => setSelectedDocument(doc.id)}
                            className={`py-[14px] px-[18px] border rounded-full text-[16px] leading-[20px] font-semibold cursor-pointer ${selectedDocument === doc.id
                                ? theme === 'light'
                                    ? 'bg-primary-500/10 border-primary-500/40 text-primary-500'
                                    : 'bg-[#FFFFFF4D] border-white'
                                : theme === 'light'
                                    ? 'border-neutral-200  '
                                    : 'border-[#FFFFFF4D] '
                                }`}
                        >
                            <span className="text-[16px] font-semibold    ">
                                {doc.label}
                            </span>

                        </button>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 w-full pb-8">
                <div className="max-w-[425px] mx-auto px-4 py-3 ">
                    <Link href=''>
                        <button
                            className="w-full cursor-pointer bg-primary-500 h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full
                                      hover:bg-primary-700 active:bg-[#D01080] transition-colors
                                      disabled:bg-gray-300 disabled:cursor-not-allowed"

                        >
                            Continue
                        </button>
                    </Link>

                </div>
            </div>
        </main>
    );
}