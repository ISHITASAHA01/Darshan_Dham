import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

// Ab ye route API ko call nahi karta.
// Ye data/panchang/<city>.json me saved data se jawab deta hai.

const DATA_DIR = path.join(process.cwd(), "data", "panchang");

const COMPUTED_DIR = path.join(process.cwd(), "data", "panchang-computed");
const cache = new Map<string, { mtime: string; data: Record<string, unknown> }>();

function readJson(file: string): Record<string, unknown> {
    try {
        const mtime = String(fs.statSync(file).mtimeMs);
        const hit = cache.get(file);
        if (hit && hit.mtime === mtime) return hit.data;
        const data = JSON.parse(fs.readFileSync(file, "utf8"));
        cache.set(file, { mtime, data });
        return data;
    } catch {
        return {};
    }
}

// API se saved data (data/panchang) pehle rakhta hai, baaki din calculate kiye hue data (data/panchang-computed) se aate hain.
function readCity(cityId: string): Record<string, unknown> | null {
    const computed = readJson(path.join(COMPUTED_DIR, `${cityId}.json`));
    const api = readJson(path.join(DATA_DIR, `${cityId}.json`));
    const merged = { ...computed, ...api };
    return Object.keys(merged).length ? merged : null;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const date = body.date;
        const cityId = body.city_id;

        if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: "Valid date is required (YYYY-MM-DD)." },
                { status: 400 }
            );
        }

        if (typeof cityId !== "string" || !/^[a-z0-9-]+$/.test(cityId)) {
            return NextResponse.json(
                { error: "Valid city_id is required." },
                { status: 400 }
            );
        }

        const saved = readCity(cityId);

        if (!saved || Object.keys(saved).length === 0) {
            return NextResponse.json(
                { error: "Panchang data for this city is not available yet." },
                { status: 404 }
            );
        }

        const result = saved[date];

        if (!result) {
            const dates = Object.keys(saved).sort();
            return NextResponse.json(
                {
                    error: `Panchang for this date is not available. Available dates: ${dates[0]} to ${dates[dates.length - 1]}.`,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Panchang route error:", error);

        return NextResponse.json(
            { error: "Unable to load Panchang data." },
            { status: 500 }
        );
    }
}
