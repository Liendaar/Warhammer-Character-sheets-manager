import { CharacterSheetClient } from "@/components/character/CharacterSheetClient";

// Required for static export with dynamic routes
export async function generateStaticParams() {
    return [{ id: 'demo' }];
}

export default function CharacterSheetPage() {
    return <CharacterSheetClient />;
}
