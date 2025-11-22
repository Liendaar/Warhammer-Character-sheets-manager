import { Skill, CharacteristicName } from "@/types/character";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface Props {
    skills: Skill[];
    onChange: (newSkills: Skill[]) => void;
    type: "Basic" | "Advanced";
}

export function Skills({ skills, onChange, type }: Props) {
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillChar, setNewSkillChar] = useState<CharacteristicName>("WS");

    const handleAddSkill = () => {
        if (!newSkillName) return;
        const newSkill: Skill = {
            name: newSkillName,
            characteristic: newSkillChar,
            advances: 0,
        };
        onChange([...skills, newSkill]);
        setNewSkillName("");
    };

    const handleUpdateSkill = (index: number, field: keyof Skill, value: string | number) => {
        const newSkills = [...skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        onChange(newSkills);
    };

    const handleDeleteSkill = (index: number) => {
        const newSkills = skills.filter((_, i) => i !== index);
        onChange(newSkills);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[var(--text-light)]">{type} Skills</h3>
            </div>
            <table className="min-w-full divide-y divide-[var(--border-dark)] text-sm">
                <thead className="bg-[var(--bg-hover)]">
                    <tr>
                        <th className="px-2 py-2 text-left font-bold text-[var(--text-light)]">Name</th>
                        <th className="px-2 py-2 text-left font-bold text-[var(--text-light)]">Char</th>
                        <th className="px-2 py-2 text-center font-bold text-[var(--text-light)]">Adv</th>
                        <th className="px-2 py-2"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-dark)]">
                    {skills.map((skill, index) => (
                        <tr key={index}>
                            <td className="px-2 py-1">
                                <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => handleUpdateSkill(index, "name", e.target.value)}
                                    className="input-dark w-full bg-transparent border-none focus:ring-0 p-0"
                                />
                            </td>
                            <td className="px-2 py-1">
                                <select
                                    value={skill.characteristic}
                                    onChange={(e) => handleUpdateSkill(index, "characteristic", e.target.value)}
                                    className="input-dark w-full bg-transparent border-none focus:ring-0 p-0"
                                >
                                    {["WS", "BS", "S", "T", "I", "Ag", "Dex", "Int", "WP", "Fel"].map((c) => (
                                        <option key={c} value={c} className="bg-[var(--bg-card)]">{c}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-2 py-1 text-center">
                                <input
                                    type="number"
                                    value={skill.advances}
                                    onChange={(e) => handleUpdateSkill(index, "advances", parseInt(e.target.value) || 0)}
                                    className="input-dark w-12 text-center bg-transparent border-none focus:ring-0 p-0"
                                />
                            </td>
                            <td className="px-2 py-1 text-right">
                                <button onClick={() => handleDeleteSkill(index)} className="text-[var(--text-muted)] hover:text-[var(--error-red)] font-bold">
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
                                placeholder="New Skill"
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                                className="input-dark w-full bg-transparent border-none focus:ring-0 p-0 placeholder-[var(--text-muted)]"
                            />
                        </td>
                        <td className="px-2 py-1">
                            <select
                                value={newSkillChar}
                                onChange={(e) => setNewSkillChar(e.target.value as CharacteristicName)}
                                className="input-dark w-full bg-transparent border-none focus:ring-0 p-0"
                            >
                                {["WS", "BS", "S", "T", "I", "Ag", "Dex", "Int", "WP", "Fel"].map((c) => (
                                    <option key={c} value={c} className="bg-[var(--bg-card)]">{c}</option>
                                ))}
                            </select>
                        </td>
                        <td className="px-2 py-1 text-center">
                            <Button size="sm" onClick={handleAddSkill} disabled={!newSkillName}>
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
