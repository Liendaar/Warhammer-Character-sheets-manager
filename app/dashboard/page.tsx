"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { initialCharacter, Character } from "@/types/character";
import Link from "next/link";

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
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <header className="bg-[var(--bg-paper)] shadow border-b border-[var(--border-sepia)]">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--accent-red)] font-[family-name:var(--font-heading)]">
                        My Characters
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-ui)]">{user.email}</span>
                        <Button onClick={logout} variant="secondary" size="sm">
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {characters.length === 0 ? (
                            <div className="rounded-sm border-4 border-dashed border-[var(--border-sepia)] p-12 text-center bg-[var(--bg-paper)]">
                                <h3 className="mt-2 text-lg font-bold text-[var(--text-ink)] font-[family-name:var(--font-heading)]">No characters</h3>
                                <p className="mt-1 text-sm text-[var(--text-muted)]">Get started by creating a new character.</p>
                                <div className="mt-6">
                                    <Button onClick={handleCreate} disabled={creating}>
                                        {creating ? "Creating..." : "Create Character"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <Button onClick={handleCreate} disabled={creating}>
                                        {creating ? "Creating..." : "Create New Character"}
                                    </Button>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {characters.map((char) => (
                                        <div key={char.id} className="card hover:shadow-lg transition-shadow">
                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold leading-6 text-[var(--accent-red)] font-[family-name:var(--font-heading)]">{char.name}</h3>
                                                <p className="mt-1 text-sm text-[var(--text-muted)] font-[family-name:var(--font-ui)]">{char.species} {char.class} - {char.career}</p>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-[var(--border-sepia)] pt-4">
                                                <Link href={`/character/?id=${char.id}`} className="text-[var(--accent-gold)] hover:text-[var(--accent-red)] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-sm">
                                                    Edit
                                                </Link>
                                                <button onClick={() => char.id && handleDelete(char.id)} className="text-[var(--accent-red)] hover:text-[#6d1616] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
