// context/RiveContext.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';

type RiveContextType = {
    riveState: string[];
    setRiveState: (state: string[]) => void;
};

export const RiveContext = createContext<RiveContextType | undefined>(undefined);

export function RiveProvider({ children }: { children: React.ReactNode }) {
    const [riveState, setRiveState] = useState<string[]>(["Face Idle", "Loop"]);

    return (
        <RiveContext.Provider value={{ riveState, setRiveState }}>
            {children}
        </RiveContext.Provider>
    );
}

export function useRiveState() {
    const context = useContext(RiveContext);
    if (context === undefined) {
        throw new Error('useRiveState must be used within a RiveProvider');
    }
    return context;
}