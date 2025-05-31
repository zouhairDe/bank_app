// app/layout.tsx
"use client"
import { useEffect } from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import SessionWrapper from "./components/SessionWrapper";
import { useRive } from '@rive-app/react-canvas';
import { RiveProvider, useRiveState } from '../context/RiveContext';

const RiveRoboCat = ({ state }: { state: string[] }) => {
    const { rive, RiveComponent } = useRive({
        src: "robocat.riv",
        stateMachines: state, // Initial state machines
        autoplay: true,
        onLoadError: () => console.log("ERROR LOADING RIVE"),
        onLoad: () => console.log("LOADED RIVE"),
    });

    useEffect(() => {
        if (rive) {
            console.log("Rive instance is ready");

            // Iterate over state machines and update inputs
            state.forEach((machineName) => {
                const inputs = rive.stateMachineInputs(machineName);

                if (inputs && inputs.length > 0) {
                    console.log(`Inputs for ${machineName}:`, inputs);
                    inputs.forEach((input) => {
                        if (input.type === "trigger") {
                            input.fire(); // Fire trigger inputs
                        } else if (input.type === "boolean") {
                            input.value = true; // Set boolean inputs
                        } else if (input.type === "number") {
                            input.value = 1; // Set number inputs
                        }
                    });
                } else {
                    console.warn(`No inputs found for state machine: ${machineName}`);
                }
            });
        }
    }, [state, rive]);

    return (
        <div className='fixed w-[180px] h-[180px] top-20 right-8 z-50 pointer-events-none'>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-2 shadow-2xl">
                <RiveComponent
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                    }}
                />
            </div>
        </div>
    );
};

// Separate component to consume the context
function RiveStateConsumer() {
    const { riveState } = useRiveState();
    return <RiveRoboCat state={riveState} />;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionWrapper>
            <RiveProvider>
                <html lang="en" className="scroll-smooth">
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <title>SecureBank - Professional Banking Solutions</title>
                        <meta name="description" content="Secure and professional banking services with modern UI/UX" />
                    </head>
                    <body className="font-sans antialiased">
                        <RiveStateConsumer />
                        {children}
                    </body>
                </html>
            </RiveProvider>
        </SessionWrapper>
    );
}