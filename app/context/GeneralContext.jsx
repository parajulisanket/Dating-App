"use client"
import { useState, useContext, createContext } from "react";
const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <GeneralContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
            {children}
        </GeneralContext.Provider>
    )

}
export default GeneralContext;