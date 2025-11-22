"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Character } from "@/types/character";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/Sidebar";
import { Characteristics } from "@/components/character/Characteristics";
import { Skills } from "@/components/character/Skills";
import { Talents } from "@/components/character/Talents";
import { Combat } from "@/components/character/Combat";
import { Trappings } from "@/components/character/Trappings";
import debounce from "lodash/debounce";
import { ArrowLeft, Shield, Sword, Scroll, Backpack, Book } from "lucide-react";

export function CharacterSheetClient() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { user, loading } = useAuth();
    const router = useRouter();
    const [character, setCharacter] = useState<Character | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [activeView, setActiveView] = useState<"hub" | "skills" | "combat" | "trappings" | "talents" | "notes">("hub");

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
            await updateDoc(doc(db, "characters", id as string), data);
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
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const updateCharacter = (updates: Partial<Character>) => {
        if (!character) return;
        const newChar = { ...character, ...updates };
        setCharacter(newChar);
        debouncedSave(newChar);
    };

    if (loading || !character) {
        return <div className="flex min-h-screen items-center justify-center bg-[var(--bg-dark)] text-[var(--text-light)]">Loading...</div>;
    }

    const renderHub = () => (
        <div className="space-y-6">
            {/* Personal Details Card */}
            <div className="card">
                <h2 className="text-xl font-bold mb-4 text-[var(--text-light)] border-b border-[var(--border-dark)] pb-2">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Name</label>
                        <input
                            type="text"
                            value={character.name}
                            onChange={(e) => updateCharacter({ name: e.target.value })}
                            className="input-dark w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Species</label>
                        <input
                            type="text"
                            value={character.species}
                            onChange={(e) => updateCharacter({ species: e.target.value })}
                            className="input-dark w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Class</label>
                        <input
                            type="text"
                            value={character.class}
                            onChange={(e) => updateCharacter({ class: e.target.value })}
                            className="input-dark w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Career</label>
                        <input
                            type="text"
                            value={character.career}
                            onChange={(e) => updateCharacter({ career: e.target.value })}
                            className="input-dark w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Level</label>
                        <input
                            type="text"
                            value={character.careerLevel}
                            onChange={(e) => updateCharacter({ careerLevel: e.target.value })}
                            className="input-dark w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Status</label>
                        <input
                            type="text"
                            value={character.status}
                            onChange={(e) => updateCharacter({ status: e.target.value })}
                            className="input-dark w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Characteristics Card */}
            <div className="card">
                <h2 className="text-xl font-bold mb-4 text-[var(--text-light)] border-b border-[var(--border-dark)] pb-2">Characteristics</h2>
                <Characteristics
                    characteristics={character.characteristics}
                    onChange={(newChars) => updateCharacter({ characteristics: newChars })}
                />
            </div>

            {/* Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button onClick={() => setActiveView("skills")} className="card hover:bg-[var(--bg-hover)] transition-colors text-left group">
                    <div className="flex items-center gap-3 mb-2">
                        <Scroll className="w-6 h-6 text-[var(--accent-green)]" />
                        <h3 className="text-lg font-bold text-[var(--text-light)] group-hover:text-[var(--accent-green)]">Skills</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Manage Basic and Advanced skills.
                    </p>
                </button>

                <button onClick={() => setActiveView("talents")} className="card hover:bg-[var(--bg-hover)] transition-colors text-left group">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-[var(--accent-green)]" />
                        <h3 className="text-lg font-bold text-[var(--text-light)] group-hover:text-[var(--accent-green)]">Talents</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        View and add talents.
                    </p>
                </button>

                <button onClick={() => setActiveView("combat")} className="card hover:bg-[var(--bg-hover)] transition-colors text-left group">
                    <div className="flex items-center gap-3 mb-2">
                        <Sword className="w-6 h-6 text-[var(--accent-green)]" />
                        <h3 className="text-lg font-bold text-[var(--text-light)] group-hover:text-[var(--accent-green)]">Combat</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Weapons, Armor, and combat stats.
                    </p>
                </button>

                <button onClick={() => setActiveView("trappings")} className="card hover:bg-[var(--bg-hover)] transition-colors text-left group">
                    <div className="flex items-center gap-3 mb-2">
                        <Backpack className="w-6 h-6 text-[var(--accent-green)]" />
                        <h3 className="text-lg font-bold text-[var(--text-light)] group-hover:text-[var(--accent-green)]">Trappings</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Inventory and Money.
                    </p>
                </button>

                <button onClick={() => setActiveView("notes")} className="card hover:bg-[var(--bg-hover)] transition-colors text-left group">
                    <div className="flex items-center gap-3 mb-2">
                        <Book className="w-6 h-6 text-[var(--accent-green)]" />
                        <h3 className="text-lg font-bold text-[var(--text-light)] group-hover:text-[var(--accent-green)]">Notes</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Character notes and backstory.
                    </p>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[var(--bg-dark)]">
            <Sidebar />
            <main className="flex-1 p-8 pb-20">
                {/* Header */}
                <header className="mb-8 flex justify-between items-center sticky top-0 bg-[var(--bg-dark)]/95 backdrop-blur z-10 py-4 border-b border-[var(--border-dark)]">
                    <div className="flex items-center gap-4">
                        {activeView !== "hub" && (
                            <Button variant="ghost" size="sm" onClick={() => setActiveView("hub")}>
                                <ArrowLeft className="w-5 h-5 mr-1" /> Back
                            </Button>
                        )}
                        <h1 className="text-3xl font-bold text-[var(--text-light)]">
                            {activeView === "hub" ? character.name : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        {saving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "All changes saved"}
                    </div>
                </header>

                {/* Content */}
                <div className="max-w-5xl mx-auto">
                    {activeView === "hub" && renderHub()}

                    {activeView === "skills" && (
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

                    {activeView === "talents" && (
                        <div className="card">
                            <Talents
                                talents={character.talents || []}
                                onChange={(newTalents) => updateCharacter({ talents: newTalents })}
                            />
                        </div>
                    )}

                    {activeView === "combat" && (
                        <div className="card">
                            <Combat
                                weapons={character.weapons || []}
                                armor={character.armor || []}
                                onWeaponsChange={(newWeapons) => updateCharacter({ weapons: newWeapons })}
                                onArmorChange={(newArmor) => updateCharacter({ armor: newArmor })}
                            />
                        </div>
                    )}

                    {activeView === "trappings" && (
                        <div className="card">
                            <Trappings
                                trappings={character.trappings || []}
                                money={character.money || { gc: 0, ss: 0, bp: 0 }}
                                onTrappingsChange={(newTrappings) => updateCharacter({ trappings: newTrappings })}
                                onMoneyChange={(newMoney) => updateCharacter({ money: newMoney })}
                            />
                        </div>
                    )}

                    {activeView === "notes" && (
                        <div className="card h-[calc(100vh-200px)]">
                            <textarea
                                className="w-full h-full bg-transparent border-none focus:ring-0 text-[var(--text-light)] resize-none p-4"
                                value={character.notes}
                                onChange={(e) => updateCharacter({ notes: e.target.value })}
                                placeholder="Write your notes here..."
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
