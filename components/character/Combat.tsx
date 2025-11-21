import { Weapon, Armor } from "@/types/character";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface Props {
    weapons: Weapon[];
    armor: Armor[];
    onWeaponsChange: (newWeapons: Weapon[]) => void;
    onArmorChange: (newArmor: Armor[]) => void;
}

export function Combat({ weapons, armor, onWeaponsChange, onArmorChange }: Props) {
    const [newWeaponName, setNewWeaponName] = useState("");
    const [newArmorName, setNewArmorName] = useState("");

    // Weapon Handlers
    const handleAddWeapon = () => {
        if (!newWeaponName) return;
        const newWeapon: Weapon = {
            id: Date.now().toString(),
            name: newWeaponName,
            group: "Basic",
            encumbrance: 0,
            range: "Average",
            damage: "SB+4",
            qualities: [],
        };
        onWeaponsChange([...weapons, newWeapon]);
        setNewWeaponName("");
    };

    const handleUpdateWeapon = (index: number, field: keyof Weapon, value: any) => {
        const newWeapons = [...weapons];
        newWeapons[index] = { ...newWeapons[index], [field]: value };
        onWeaponsChange(newWeapons);
    };

    const handleDeleteWeapon = (index: number) => {
        onWeaponsChange(weapons.filter((_, i) => i !== index));
    };

    // Armor Handlers
    const handleAddArmor = () => {
        if (!newArmorName) return;
        const newArmorItem: Armor = {
            id: Date.now().toString(),
            name: newArmorName,
            locations: ["Body"],
            encumbrance: 0,
            ap: 1,
            qualities: [],
        };
        onArmorChange([...armor, newArmorItem]);
        setNewArmorName("");
    };

    const handleUpdateArmor = (index: number, field: keyof Armor, value: any) => {
        const newArmor = [...armor];
        newArmor[index] = { ...newArmor[index], [field]: value };
        onArmorChange(newArmor);
    };

    const handleDeleteArmor = (index: number) => {
        onArmorChange(armor.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            {/* Weapons Section */}
            <div>
                <h3 className="text-md font-semibold mb-2">Weapons</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 text-left">Name</th>
                                <th className="px-2 py-2 text-left">Group</th>
                                <th className="px-2 py-2 text-center">Dmg</th>
                                <th className="px-2 py-2 text-center">Rng</th>
                                <th className="px-2 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {weapons.map((weapon, index) => (
                                <tr key={weapon.id}>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={weapon.name}
                                            onChange={(e) => handleUpdateWeapon(index, "name", e.target.value)}
                                            className="w-full border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={weapon.group}
                                            onChange={(e) => handleUpdateWeapon(index, "group", e.target.value)}
                                            className="w-24 border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={weapon.damage}
                                            onChange={(e) => handleUpdateWeapon(index, "damage", e.target.value)}
                                            className="w-16 text-center border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={weapon.range}
                                            onChange={(e) => handleUpdateWeapon(index, "range", e.target.value)}
                                            className="w-20 text-center border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                        <button onClick={() => handleDeleteWeapon(index)} className="text-red-600 hover:text-red-800">
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50">
                                <td className="px-2 py-1">
                                    <input
                                        type="text"
                                        placeholder="New Weapon"
                                        value={newWeaponName}
                                        onChange={(e) => setNewWeaponName(e.target.value)}
                                        className="w-full border rounded p-1"
                                    />
                                </td>
                                <td colSpan={3} className="px-2 py-1 text-center">
                                    <Button size="sm" onClick={handleAddWeapon} disabled={!newWeaponName}>
                                        Add Weapon
                                    </Button>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Armor Section */}
            <div>
                <h3 className="text-md font-semibold mb-2">Armor</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 text-left">Name</th>
                                <th className="px-2 py-2 text-left">Locations</th>
                                <th className="px-2 py-2 text-center">AP</th>
                                <th className="px-2 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {armor.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => handleUpdateArmor(index, "name", e.target.value)}
                                            className="w-full border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={item.locations.join(", ")}
                                            onChange={(e) => handleUpdateArmor(index, "locations", e.target.value.split(",").map(s => s.trim()))}
                                            className="w-full border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            value={item.ap}
                                            onChange={(e) => handleUpdateArmor(index, "ap", parseInt(e.target.value) || 0)}
                                            className="w-16 text-center border rounded p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                        <button onClick={() => handleDeleteArmor(index)} className="text-red-600 hover:text-red-800">
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50">
                                <td className="px-2 py-1">
                                    <input
                                        type="text"
                                        placeholder="New Armor"
                                        value={newArmorName}
                                        onChange={(e) => setNewArmorName(e.target.value)}
                                        className="w-full border rounded p-1"
                                    />
                                </td>
                                <td colSpan={2} className="px-2 py-1 text-center">
                                    <Button size="sm" onClick={handleAddArmor} disabled={!newArmorName}>
                                        Add Armor
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
