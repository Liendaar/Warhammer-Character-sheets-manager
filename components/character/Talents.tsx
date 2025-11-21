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

    const handleUpdateTalent = (index: number, field: keyof Talent, value: any) => {
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
                <h3 className="text-md font-semibold">Talents</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-2 py-2 text-left">Name</th>
                        <th className="px-2 py-2 text-left">Description</th>
                        <th className="px-2 py-2 text-center">Times Taken</th>
                        <th className="px-2 py-2"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {talents.map((talent, index) => (
                        <tr key={index}>
                            <td className="px-2 py-1">
                                <input
                                    type="text"
                                    value={talent.name}
                                    onChange={(e) => handleUpdateTalent(index, "name", e.target.value)}
                                    className="w-full border rounded p-1"
                                />
                            </td>
                            <td className="px-2 py-1">
                                <input
                                    type="text"
                                    value={talent.description || ""}
                                    onChange={(e) => handleUpdateTalent(index, "description", e.target.value)}
                                    className="w-full border rounded p-1"
                                />
                            </td>
                            <td className="px-2 py-1 text-center">
                                <input
                                    type="number"
                                    value={talent.timesTaken}
                                    onChange={(e) => handleUpdateTalent(index, "timesTaken", parseInt(e.target.value) || 1)}
                                    className="w-12 text-center border rounded p-1"
                                />
                            </td>
                            <td className="px-2 py-1 text-right">
                                <button onClick={() => handleDeleteTalent(index)} className="text-red-600 hover:text-red-800">
                                    &times;
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* Add New Row */}
                    <tr className="bg-gray-50">
                        <td className="px-2 py-1">
                            <input
                                type="text"
                                placeholder="New Talent"
                                value={newTalentName}
                                onChange={(e) => setNewTalentName(e.target.value)}
                                className="w-full border rounded p-1"
                            />
                        </td>
                        <td className="px-2 py-1">
                            <input
                                type="text"
                                placeholder="Description"
                                value={newTalentDesc}
                                onChange={(e) => setNewTalentDesc(e.target.value)}
                                className="w-full border rounded p-1"
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
