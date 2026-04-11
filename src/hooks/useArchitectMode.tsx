"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ArchitectModeContextValue {
    active: boolean;
    toggle: () => void;
}

const ArchitectModeContext = createContext<ArchitectModeContextValue>({
    active: false,
    toggle: () => { },
});

export function useArchitectMode() {
    return useContext(ArchitectModeContext);
}

export default function ArchitectModeProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState(false);
    const toggle = useCallback(() => setActive((prev) => !prev), []);

    return (
        <ArchitectModeContext.Provider value={{ active, toggle }}>
            {children}
        </ArchitectModeContext.Provider>
    );
}
