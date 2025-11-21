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

    const handleUpdateItem = (index: number, field: keyof Trapping, value: any) => {
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
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-md font-semibold mb-2 text-yellow-800">Money</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <label className="font-bold text-yellow-700">GC</label>
                        <input
                            type="number"
                            value={money.gc}
                            onChange={(e) => onMoneyChange({ ...money, gc: parseInt(e.target.value) || 0 })}
                            className="w-16 border rounded p-1 text-center"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-bold text-gray-500">SS</label>
                        <input
                            type="number"
                            value={money.ss}
                            onChange={(e) => onMoneyChange({ ...money, ss: parseInt(e.target.value) || 0 })}
                            className="w-16 border rounded p-1 text-center"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-bold text-orange-700">BP</label>
                        <input
                            type="number"
                            value={money.bp}
                            onChange={(e) => onMoneyChange({ ...money, bp: parseInt(e.target.value) || 0 })}
                            className="w-16 border rounded p-1 text-center"
                        />
                    </div>
                </div>
            </div>

            {/* Inventory Section */}
            <div>
                <h3 className="text-md font-semibold mb-2">Trappings</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 text-left">Name</th>
                                <th className="px-2 py-2 text-center">Amount</th>
                                <th className="px-2 py-2 text-center">Enc</th>
                                <th className="px-2 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {trappings.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                                            className="w-full border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => handleUpdateItem(index, "amount", parseInt(e.target.value) || 0)}
                                            className="w-16 text-center border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            value={item.encumbrance}
                                            onChange={(e) => handleUpdateItem(index, "encumbrance", parseFloat(e.target.value) || 0)}
                                            className="w-16 text-center border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                        <button onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-800">
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50">
                                <td className="px-2 py-1">
                                    <input
                                        type="text"
                                        placeholder="New Item"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="w-full border rounded p-1"
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
