import type { Temple } from "@/data/temples";
import type { TempleExtra } from "@/data/templeExtras";

// Mandir ka poora data: basic info + Visit Info (railway, airport, website...)
export type TempleFull = Temple & TempleExtra;