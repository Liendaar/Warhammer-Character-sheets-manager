"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

export function CharacterSheetClient() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
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
        <div className="min-h-screen pb-20">
            {/* Header / Toolbar */}
            <div className="sticky top-0 z-10 bg-[var(--bg-paper)] border-b border-[var(--border-sepia)] shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard")}>
                        &larr; Back
                    </Button>
                    <h1 className="text-2xl font-bold text-[var(--accent-red)] font-[family-name:var(--font-heading)]">{character.name}</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] font-[family-name:var(--font-ui)]">
                    {saving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "All changes saved"}
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 space-y-6">
                {/* Tabs */}
                <div className="border-b border-[var(--border-sepia)]">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {["main", "skills", "combat", "trappings", "notes"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab
                                    ? "border-[var(--accent-red)] text-[var(--accent-red)] bg-[var(--bg-paper)]"
                                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:border-[var(--border-sepia)]"
                                    } whitespace-nowrap py-3 px-6 border-b-2 font-bold text-lg capitalize font-[family-name:var(--font-heading)] transition-colors rounded-t-sm`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                {activeTab === "main" && (
                    <>
                        <div className="card">
                            <h2 className="text-xl font-bold mb-6 border-b border-[var(--border-sepia)] pb-2">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-ink)] mb-1 font-[family-name:var(--font-heading)]">Name</label>
                                    <input
                                        type="text"
                                        value={character.name}
                                        onChange={(e) => updateCharacter({ name: e.target.value })}
                                        className="input-parchment w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-ink)] mb-1 font-[family-name:var(--font-heading)]">Species</label>
                                    <input
                                        type="text"
                                        value={character.species}
                                        onChange={(e) => updateCharacter({ species: e.target.value })}
                                        className="input-parchment w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-ink)] mb-1 font-[family-name:var(--font-heading)]">Class</label>
                                    <input
                                        type="text"
                                        value={character.class}
                                        onChange={(e) => updateCharacter({ class: e.target.value })}
                                        className="input-parchment w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-ink)] mb-1 font-[family-name:var(--font-heading)]">Career</label>
                                    <input
                                        type="text"
                                        value={character.career}
                                        onChange={(e) => updateCharacter({ career: e.target.value })}
                                        className="input-parchment w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-ink)] mb-1 font-[family-name:var(--font-heading)]">Career Level</label>
                                    <input
                                        type="text"
                                        value={character.careerLevel}
                                        onChange={(e) => updateCharacter({ careerLevel: e.target.value })}
                                        className="input-parchment w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-ink)] mb-1 font-[family-name:var(--font-heading)]">Status</label>
                                    <input
                                        type="text"
                                        value={character.status}
                                        onChange={(e) => updateCharacter({ status: e.target.value })}
                                        className="input-parchment w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="text-xl font-bold mb-6 border-b border-[var(--border-sepia)] pb-2">Characteristics</h2>
                            <Characteristics
                                characteristics={character.characteristics}
                                onChange={(newChars) => updateCharacter({ characteristics: newChars })}
                            />
                        </div>

                        <div className="card">
                            <Talents
                                talents={character.talents || []}
                                onChange={(newTalents) => updateCharacter({ talents: newTalents })}
                            />
                        </div>
                    </>
                )}

                {activeTab === "skills" && (
                    <div className="space-y-6">
                        <div className="card">
                            <Skills
                                type="Basic"
                                skills={character.basicSkills || []}
                                onChange={(newSkills) => updateCharacter({ basicSkills: newSkills })}
                            />
                        </div>
                        <div className="card">
                            <Skills
                                type="Advanced"
                                skills={character.advancedSkills || []}
                                onChange={(newSkills) => updateCharacter({ advancedSkills: newSkills })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "combat" && (
                    <div className="card">
                        <Combat
                            weapons={character.weapons || []}
                            armor={character.armor || []}
                            onWeaponsChange={(newWeapons) => updateCharacter({ weapons: newWeapons })}
                            onArmorChange={(newArmor) => updateCharacter({ armor: newArmor })}
                        />
                    </div>
                )}

                {activeTab === "trappings" && (
                    <div className="card">
                        <Trappings
                            trappings={character.trappings || []}
                            money={character.money || { gc: 0, ss: 0, bp: 0 }}
                            onTrappingsChange={(newTrappings) => updateCharacter({ trappings: newTrappings })}
                            onMoneyChange={(newMoney) => updateCharacter({ money: newMoney })}
                        />
                    </div>
                )}

                {activeTab === "notes" && (
                    <div className="card">
                        <label className="block text-sm font-bold text-[var(--text-ink)] mb-2 font-[family-name:var(--font-heading)]">Notes</label>
                        <textarea
                            rows={10}
                            className="w-full border border-[var(--border-sepia)] rounded p-2 bg-transparent focus:border-[var(--accent-red)] focus:outline-none"
                            value={character.notes}
                            onChange={(e) => updateCharacter({ notes: e.target.value })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
