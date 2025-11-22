import { Talent } from "@/types/character";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface Props {
    talents: Talent[];
    onChange: (newTalents: Talent[]) => void;
}

export function Talents({ talents, onChange }: Props) {
    const [newTalentName, setNewTalentName] = useState("");
    const [newTalentDesc, setNewTalentDesc] = useState("");

    const handleAddTalent = () => {
        if (!newTalentName) return;
        const newTalent: Talent = {
            name: newTalentName,
            timesTaken: 1,
            description: newTalentDesc,
        };
        onChange([...talents, newTalent]);
        setNewTalentName("");
        setNewTalentDesc("");
    };

    const handleUpdateTalent = (index: number, field: keyof Talent, value: string | number) => {
        const newTalents = [...talents];
        newTalents[index] = { ...newTalents[index], [field]: value };
        onChange(newTalents);
    };

    const handleDeleteTalent = (index: number) => {
        const newTalents = talents.filter((_, i) => i !== index);
        onChange(newTalents);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-[var(--text-light)]">Talents</h3>
            </div>
            <table className="min-w-full divide-y divide-[var(--border-dark)] text-sm">
                <thead className="bg-[var(--bg-hover)]">
                    <tr>
                        <th className="px-2 py-2 text-left font-bold text-[var(--text-light)]">Name</th>
                        <th className="px-2 py-2 text-left font-bold text-[var(--text-light)]">Description</th>
                        <th className="px-2 py-2 text-center font-bold text-[var(--text-light)]">Times Taken</th>
                        <th className="px-2 py-2"></th>
                    </tr>
                </thead>
                <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-dark)]">
                    {talents.map((talent, index) => (
                        <tr key={index}>
                            <td className="px-2 py-1">
                                <input
                                    type="text"
                                    value={talent.name}
                                    onChange={(e) => handleUpdateTalent(index, "name", e.target.value)}
                                    className="input-dark w-full bg-transparent border-none focus:ring-0 p-0"
                                />
                            </td>
                            <td className="px-2 py-1">
                                <input
                                    type="text"
                                    value={talent.description || ""}
                                    onChange={(e) => handleUpdateTalent(index, "description", e.target.value)}
                                    className="input-dark w-full bg-transparent border-none focus:ring-0 p-0"
                                />
                            </td>
                            <td className="px-2 py-1 text-center">
                                <input
                                    type="number"
                                    value={talent.timesTaken}
                                    onChange={(e) => handleUpdateTalent(index, "timesTaken", parseInt(e.target.value) || 1)}
                                    className="input-dark w-12 text-center bg-transparent border-none focus:ring-0 p-0"
                                />
                            </td>
                            <td className="px-2 py-1 text-right">
                                <button onClick={() => handleDeleteTalent(index)} className="text-[var(--text-muted)] hover:text-[var(--error-red)] font-bold">
                                    &times;
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* Add New Row */}
                    <tr className="bg-[var(--bg-hover)]/50">
                        <td className="px-2 py-1">
                            <input
                                type="text"
                                placeholder="New Talent"
                                value={newTalentName}
                                onChange={(e) => setNewTalentName(e.target.value)}
                                className="input-dark w-full bg-transparent border-none focus:ring-0 p-0 placeholder-[var(--text-muted)]"
                            />
                        </td>
                        <td className="px-2 py-1">
                            <input
                                type="text"
                                placeholder="Description"
                                value={newTalentDesc}
                                onChange={(e) => setNewTalentDesc(e.target.value)}
                                className="input-dark w-full bg-transparent border-none focus:ring-0 p-0 placeholder-[var(--text-muted)]"
                            />
                        </td>
                        <td className="px-2 py-1 text-center">
                            <Button size="sm" onClick={handleAddTalent} disabled={!newTalentName}>
                                Add
                            </Button>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
