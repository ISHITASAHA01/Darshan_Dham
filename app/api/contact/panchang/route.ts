
import { NextRequest, NextResponse } from "next/server";

const PANCHANG_API_URL =
    "https://panchang.devdarsha.com/v1/panchang/daily";

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.DEVDARSHA_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Panchang API key is not configured." },
                { status: 500 }
            );
        }

        const body = await request.json();

        const date = body.date;
        const cityId = body.city_id;

        if (
            typeof date !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
            return NextResponse.json(
                { error: "Valid date is required (YYYY-MM-DD)." },
                { status: 400 }
            );
        }

        if (
            typeof cityId !== "string" ||
            !/^[a-z0-9-]+$/.test(cityId)
        ) {
            return NextResponse.json(
                { error: "Valid city_id is required." },
                { status: 400 }
            );
        }

        const apiResponse = await fetch(PANCHANG_API_URL, {
            method: "POST",
            headers: {
                "X-Api-Key": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date,
                city_id: cityId,
                timezone: "Asia/Kolkata",
            }),
            cache: "no-store",
        });

        const result = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(
                {
                    error:
                        result.message ||
                        result.error ||
                        "Panchang API request failed.",
                },
                { status: apiResponse.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Panchang API error:", error);

        return NextResponse.json(
            { error: "Unable to fetch Panchang data." },
            { status: 500 }
        );
    }
}
