"use client";

import { Suspense } from "react";
import { CharacterSheetClient } from "@/components/character/CharacterSheetClient";

export default function CharacterSheetPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CharacterSheetClient />
        </Suspense>
    );
}
