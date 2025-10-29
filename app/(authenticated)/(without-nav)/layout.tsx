import React from 'react'

export default function WithoutNavLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}

        </div>
    )
}
