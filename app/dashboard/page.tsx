"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { initialCharacter, Character } from "@/types/character";
import Link from "next/link";

import { Sidebar } from "@/components/Sidebar";

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchCharacters = async () => {
            if (user) {
                const q = query(collection(db, "characters"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const chars: Character[] = [];
                querySnapshot.forEach((doc) => {
                    chars.push({ ...doc.data(), id: doc.id } as Character);
                });
                setCharacters(chars);
            }
        };
        fetchCharacters();
    }, [user]);

    const handleCreate = async () => {
        if (!user) return;
        setCreating(true);
        try {
            const newChar = { ...initialCharacter, userId: user.uid };
            const docRef = await addDoc(collection(db, "characters"), newChar);
            router.push(`/character/?id=${docRef.id}`);
        } catch (e: any) {
            console.error("Error creating character:", e);
            alert("Error creating character: " + e.message);
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this character?")) return;
        try {
            await deleteDoc(doc(db, "characters", id));
            setCharacters(characters.filter(c => c.id !== id));
        } catch (e) {
            console.error("Error deleting character:", e);
        }
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-[var(--bg-dark)] text-[var(--text-light)]">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[var(--bg-dark)]">
            <Sidebar />
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-[var(--text-light)]">
                        My Characters
                    </h1>
                    <Button onClick={handleCreate} disabled={creating}>
                        {creating ? "Creating..." : "Create New Character"}
                    </Button>
                </header>

                {characters.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-[var(--border-dark)] p-12 text-center bg-[var(--bg-card)]">
                        <h3 className="mt-2 text-lg font-bold text-[var(--text-light)]">No characters</h3>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">Get started by creating a new character.</p>
                        <div className="mt-6">
                            <Button onClick={handleCreate} disabled={creating}>
                                {creating ? "Creating..." : "Create Character"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {characters.map((char) => (
                            <div key={char.id} className="card hover:bg-[var(--bg-hover)] transition-colors group relative">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold leading-6 text-[var(--text-light)] group-hover:text-[var(--accent-green)] transition-colors">
                                        {char.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                                        {char.species} {char.class} - {char.career}
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--border-dark)]">
                                    <Link
                                        href={`/character/?id=${char.id}`}
                                        className="text-sm font-medium text-[var(--accent-green)] hover:text-[var(--accent-green-hover)]"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => char.id && handleDelete(char.id)}
                                        className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--error-red)] transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
