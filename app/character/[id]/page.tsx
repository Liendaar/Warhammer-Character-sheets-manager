"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Character } from "@/types/character";
import { Button } from "@/components/ui/Button";
import { Characteristics } from "@/components/character/Characteristics";
import { Skills } from "@/components/character/Skills";
import { Talents } from "@/components/character/Talents";
import { Combat } from "@/components/character/Combat";
import { Trappings } from "@/components/character/Trappings";
import debounce from "lodash/debounce";

// Required for static export with dynamic routes
export async function generateStaticParams() {
    return [];
}

export default function CharacterSheet() {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [character, setCharacter] = useState<Character | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState("main");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchCharacter = async () => {
            if (user && id) {
                try {
                    const docRef = doc(db, "characters", id as string);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCharacter({ ...docSnap.data(), id: docSnap.id } as Character);
                    } else {
                        console.log("No such document!");
                        router.push("/dashboard");
                    }
                } catch (e) {
                    console.error("Error fetching character:", e);
                }
            }
        };
        fetchCharacter();
    }, [user, id, router]);

    const saveCharacter = async (char: Character) => {
        if (!char.id) return;
        setSaving(true);
        try {
            const { id, ...data } = char; // Don't save ID in the document
            await updateDoc(doc(db, "characters", id as string), data as any);
            setLastSaved(new Date());
        } catch (e) {
            console.error("Error saving:", e);
        } finally {
            setSaving(false);
        }
    };

    // Debounced save
    const debouncedSave = useCallback(
        debounce((char: Character) => saveCharacter(char), 1000),
        []
    );

    const updateCharacter = (updates: Partial<Character>) => {
        if (!character) return;
        const newChar = { ...character, ...updates };
        setCharacter(newChar);
        debouncedSave(newChar);
    };

    if (loading || !character) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Header / Toolbar */}
            <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard")}>
                        &larr; Back
                    </Button>
                    <h1 className="text-xl font-bold">{character.name}</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {saving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "All changes saved"}
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 space-y-6">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {["main", "skills", "combat", "trappings", "notes"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                {activeTab === "main" && (
                    <>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={character.name}
                                        onChange={(e) => updateCharacter({ name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Species</label>
                                    <input
                                        type="text"
                                        value={character.species}
                                        onChange={(e) => updateCharacter({ species: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Class</label>
                                    <input
                                        type="text"
                                        value={character.class}
                                        onChange={(e) => updateCharacter({ class: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Career</label>
                                    <input
                                        type="text"
                                        value={character.career}
                                        onChange={(e) => updateCharacter({ career: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Career Level</label>
                                    <input
                                        type="text"
                                        value={character.careerLevel}
                                        onChange={(e) => updateCharacter({ careerLevel: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <input
                                        type="text"
                                        value={character.status}
                                        onChange={(e) => updateCharacter({ status: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Characteristics</h2>
                            <Characteristics
                                characteristics={character.characteristics}
                                onChange={(newChars) => updateCharacter({ characteristics: newChars })}
                            />
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <Talents
                                talents={character.talents || []}
                                onChange={(newTalents) => updateCharacter({ talents: newTalents })}
                            />
                        </div>
                    </>
                )}

                {activeTab === "skills" && (
                    <div className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <Skills
                                type="Basic"
                                skills={character.basicSkills || []}
                                onChange={(newSkills) => updateCharacter({ basicSkills: newSkills })}
                            />
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <Skills
                                type="Advanced"
                                skills={character.advancedSkills || []}
                                onChange={(newSkills) => updateCharacter({ advancedSkills: newSkills })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "combat" && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <Combat
                            weapons={character.weapons || []}
                            armor={character.armor || []}
                            onWeaponsChange={(newWeapons) => updateCharacter({ weapons: newWeapons })}
                            onArmorChange={(newArmor) => updateCharacter({ armor: newArmor })}
                        />
                    </div>
                )}

                {activeTab === "trappings" && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <Trappings
                            trappings={character.trappings || []}
                            money={character.money || { gc: 0, ss: 0, bp: 0 }}
                            onTrappingsChange={(newTrappings) => updateCharacter({ trappings: newTrappings })}
                            onMoneyChange={(newMoney) => updateCharacter({ money: newMoney })}
                        />
                    </div>
                )}

                {activeTab === "notes" && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            rows={10}
                            className="w-full border rounded p-2"
                            value={character.notes}
                            onChange={(e) => updateCharacter({ notes: e.target.value })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
