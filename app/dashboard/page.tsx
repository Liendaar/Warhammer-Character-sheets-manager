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
            router.push(`/character/${docRef.id}`);
        } catch (e) {
            console.error("Error creating character:", e);
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
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        My Characters
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{user.email}</span>
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
                            <div className="rounded-lg border-4 border-dashed border-gray-200 p-12 text-center">
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No characters</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new character.</p>
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
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {characters.map((char) => (
                                        <div key={char.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h3 className="text-lg font-medium leading-6 text-gray-900">{char.name}</h3>
                                                <p className="mt-1 text-sm text-gray-500">{char.species} {char.class} - {char.career}</p>
                                            </div>
                                            <div className="px-4 py-4 sm:px-6 flex justify-between">
                                                <Link href={`/character/${char.id}`} className="text-blue-600 hover:text-blue-500 font-medium">
                                                    Edit
                                                </Link>
                                                <button onClick={() => char.id && handleDelete(char.id)} className="text-red-600 hover:text-red-500 font-medium">
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
