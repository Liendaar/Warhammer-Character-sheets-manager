import { Trapping } from "@/types/character";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface Props {
    trappings: Trapping[];
    money: { gc: number; ss: number; bp: number };
    onTrappingsChange: (newTrappings: Trapping[]) => void;
    onMoneyChange: (newMoney: { gc: number; ss: number; bp: number }) => void;
}

export function Trappings({ trappings, money, onTrappingsChange, onMoneyChange }: Props) {
    const [newItemName, setNewItemName] = useState("");

    const handleAddItem = () => {
        if (!newItemName) return;
        const newItem: Trapping = {
            id: Date.now().toString(),
            name: newItemName,
            amount: 1,
            encumbrance: 0,
        };
        onTrappingsChange([...trappings, newItem]);
        setNewItemName("");
    };

    const handleUpdateItem = (index: number, field: keyof Trapping, value: string | number) => {
        const newTrappings = [...trappings];
        newTrappings[index] = { ...newTrappings[index], [field]: value };
        onTrappingsChange(newTrappings);
    };

    const handleDeleteItem = (index: number) => {
        onTrappingsChange(trappings.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            {/* Money Section */}
            <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-dark)]">
                <h3 className="text-md font-semibold mb-2 text-[var(--accent-gold)]">Money</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <label className="font-bold text-[var(--accent-gold)]">GC</label>
                        <input
                            type="number"
                            value={money.gc}
                            onChange={(e) => onMoneyChange({ ...money, gc: parseInt(e.target.value) || 0 })}
                            className="input-dark w-16 text-center"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-bold text-gray-400">SS</label>
                        <input
                            type="number"
                            value={money.ss}
                            onChange={(e) => onMoneyChange({ ...money, ss: parseInt(e.target.value) || 0 })}
                            className="input-dark w-16 text-center"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-bold text-orange-600">BP</label>
                        <input
                            type="number"
                            value={money.bp}
                            onChange={(e) => onMoneyChange({ ...money, bp: parseInt(e.target.value) || 0 })}
                            className="input-dark w-16 text-center"
                        />
                    </div>
                </div>
            </div>

            {/* Inventory Section */}
            <div>
                <h3 className="text-md font-semibold mb-2 text-[var(--text-light)]">Trappings</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border-dark)] text-sm">
                        <thead className="bg-[var(--bg-hover)]">
                            <tr>
                                <th className="px-2 py-2 text-left font-bold text-[var(--text-light)]">Name</th>
                                <th className="px-2 py-2 text-center font-bold text-[var(--text-light)]">Amount</th>
                                <th className="px-2 py-2 text-center font-bold text-[var(--text-light)]">Enc</th>
                                <th className="px-2 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-dark)]">
                            {trappings.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                                            className="input-dark w-full bg-transparent border-none focus:ring-0 p-0"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => handleUpdateItem(index, "amount", parseInt(e.target.value) || 0)}
                                            className="input-dark w-16 text-center bg-transparent border-none focus:ring-0 p-0"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            value={item.encumbrance}
                                            onChange={(e) => handleUpdateItem(index, "encumbrance", parseFloat(e.target.value) || 0)}
                                            className="input-dark w-16 text-center bg-transparent border-none focus:ring-0 p-0"
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                        <button onClick={() => handleDeleteItem(index)} className="text-[var(--text-muted)] hover:text-[var(--error-red)] font-bold">
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-[var(--bg-hover)]/50">
                                <td className="px-2 py-1">
                                    <input
                                        type="text"
                                        placeholder="New Item"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="input-dark w-full bg-transparent border-none focus:ring-0 p-0 placeholder-[var(--text-muted)]"
                                    />
                                </td>
                                <td colSpan={2} className="px-2 py-1 text-center">
                                    <Button size="sm" onClick={handleAddItem} disabled={!newItemName}>
                                        Add Item
                                    </Button>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
