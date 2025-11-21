"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut, browserLocalPersistence, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    loginWithGoogle: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await auth.setPersistence(browserLocalPersistence);
            } catch (error) {
                console.error("Error setting persistence:", error);
            }

            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
                setLoading(false);
            });
            return unsubscribe;
        };

        const unsubscribePromise = initializeAuth();

        return () => {
            unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
        };
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    const loginWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};
