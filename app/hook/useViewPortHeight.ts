'use client'
import { useEffect } from "react"
export default function useViewPortHeight() {
    useEffect(() => {
        const setVh = () => {
            document.documentElement.style.setProperty('--vh', `$
                {window.innerHeight*0.001}px
                `)
        }
        setVh()
        window.addEventListener('resize', setVh);
        return () => window.removeEventListener('resize', setVh)
    }, [])
}