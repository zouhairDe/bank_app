// app/layout.tsx
"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import SessionWrapper from "./components/SessionWrapper";
import { useRive } from '@rive-app/react-canvas';
import { RiveProvider, useRiveState } from '../context/RiveContext';

const inter = Inter({ subsets: ["latin"] });

const RiveRoboCat = ({ state }: { state: string[] }) => {
    const { rive, RiveComponent } = useRive({
        src: 'robocat.riv',
        stateMachines: state,
        autoplay: true,
        onLoadError: () => console.log("ERROR LOADING RIVE"),
        onLoad: () => console.log("LOADED RIVE"),
    });

    return (
        <div className='absolute w-[200px] h-[200px] top-20 right-8'>
            <RiveComponent
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
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
                <html lang="en">
                    <body className={inter.className}>
                        <RiveStateConsumer />
                        {children}
                    </body>
                </html>
            </RiveProvider>
        </SessionWrapper>
    );
}