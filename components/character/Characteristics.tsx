import { Character, Characteristics as CharacteristicsType, CharacteristicName } from "@/types/character";

interface Props {
    characteristics: CharacteristicsType;
    onChange: (newChars: CharacteristicsType) => void;
}

export function Characteristics({ characteristics, onChange }: Props) {
    const handleChange = (key: CharacteristicName, field: "initial" | "advances", value: string) => {
        const numValue = parseInt(value) || 0;
        const newChars = { ...characteristics };
        newChars[key] = { ...newChars[key], [field]: numValue };
        onChange(newChars);
    };

    const calculateTotal = (key: CharacteristicName) => {
        const char = characteristics[key];
        return char.initial + char.advances;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-center text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-2 py-2"></th>
                        {Object.keys(characteristics).map((key) => (
                            <th key={key} className="px-2 py-2 font-bold text-gray-700 uppercase">
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-2 py-2 font-medium text-gray-900">Initial</td>
                        {Object.entries(characteristics).map(([key, value]) => (
                            <td key={key} className="px-1 py-1">
                                <input
                                    type="number"
                                    value={value.initial}
                                    onChange={(e) => handleChange(key as CharacteristicName, "initial", e.target.value)}
                                    className="input-parchment w-12 text-center"
                                />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-2 py-2 font-medium text-gray-900">Advances</td>
                        {Object.entries(characteristics).map(([key, value]) => (
                            <td key={key} className="px-1 py-1">
                                <input
                                    type="number"
                                    value={value.advances}
                                    onChange={(e) => handleChange(key as CharacteristicName, "advances", e.target.value)}
                                    className="input-parchment w-12 text-center"
                                />
                            </td>
                        ))}
                    </tr>
                    <tr className="bg-gray-100 font-bold">
                        <td className="px-2 py-2 text-gray-900">Total</td>
                        {Object.keys(characteristics).map((key) => (
                            <td key={key} className="px-2 py-2">
                                {calculateTotal(key as CharacteristicName)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
