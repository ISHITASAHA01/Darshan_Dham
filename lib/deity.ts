export type DeityGroup =
    | "shiva"
    | "vishnu"
    | "devi"
    | "hanuman"
    | "ganesha"
    | "other";

export const DEITY_GROUPS: { id: DeityGroup; label: string }[] = [
    { id: "shiva", label: "Shiva" },
    { id: "vishnu", label: "Vishnu, Krishna & Ram" },
    { id: "devi", label: "Devi / Shakti" },
    { id: "hanuman", label: "Hanuman" },
    { id: "ganesha", label: "Ganesha" },
    { id: "other", label: "Other" },
];

export function deityGroup(deity: string): DeityGroup {
    const d = deity.toLowerCase();

    if (d.includes("ramakrishna")) return "other";
    if (d.includes("hanuman")) return "hanuman";
    if (d.includes("ganesha")) return "ganesha";

    if (d.startsWith("goddess") || /\b(devi|mata|bhagavathy)\b/.test(d))
        return "devi";

    if (d.includes("shiva") || d.includes("bhairav")) return "shiva";

    if (
        /(vishnu|krishna|\bram\b|venkateswara|narasimha|jagannath|vitthal|satyanarayana|balaji)/.test(d)
    )
        return "vishnu";

    return "other";
}