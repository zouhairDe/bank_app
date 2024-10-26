import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export type ExtendedStatus = 
  | "loading" 
  | "authenticated" 
  | "unauthenticated" 
  | "unverified" 
  | "banned"
  | "incomplete";

export const useExtendedStatus = () => {
    const { data: session, status: authStatus, update: updateSession } = useSession();
    const [extendedStatus, setExtendedStatus] = useState<ExtendedStatus>("loading");

    useEffect(() => {
        if (authStatus === "unauthenticated") {
            setExtendedStatus("unauthenticated");
            return;
        }

        if (authStatus === "authenticated" && session) {
            if (!session.user.isVerified) {
                setExtendedStatus("unverified");
                return;
            }

            if (session.user.isBanned) {
                setExtendedStatus("banned");
                return;
            }

            if (!session.user.DataSubmitted) {
                setExtendedStatus("incomplete");
                return;
            }

            setExtendedStatus("authenticated");
        }
    }, [authStatus, session]);

    const mutateExtendedStatus = useCallback(async () => {
        try {
            // Update the session data from the server
            await updateSession({
                ...session,
                user: {
                    ...session?.user,
                    DataSubmitted: true
                }
            });
            
            setExtendedStatus("authenticated");
            
            return true;
        } catch (error) {
            console.error("Failed to update status:", error);
            return false;
        }
    }, [session, updateSession]);

    return {
        extendedStatus,
        session,
        authStatus,
        mutateExtendedStatus
    };
};