import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();

function tooMany(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(
        (t) => now - t < 10 * 60 * 1000
    );

    recent.push(now);
    hits.set(ip, recent);

    return recent.length > 5;
}

const esc = (s: string) =>
    s.replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            } as Record<string, string>)[c]
    );

export async function POST(req: Request) {
    let body: {
        name?: string;
        email?: string;
        message?: string;
        website?: string;
    };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }

    // Honeypot: bots ke liye
    if (body.website) {
        return NextResponse.json({ ok: true });
    }

    const name = (body.name ?? "")
        .trim()
        .replace(/[\r\n]+/g, " ")
        .slice(0, 100);

    const email = (body.email ?? "").trim().slice(0, 150);

    const message = (body.message ?? "")
        .trim()
        .slice(0, 3000);

    if (
        !name ||
        !message ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return NextResponse.json(
            { error: "Invalid input" },
            { status: 400 }
        );
    }

    const ip =
        req.headers
            .get("x-forwarded-for")
            ?.split(",")[0]
            ?.trim() ?? "unknown";

    if (tooMany(ip)) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const contactTo = process.env.CONTACT_TO;

    if (!apiKey || !contactTo) {
        console.error(
            "Contact form: RESEND_API_KEY ya CONTACT_TO missing hai"
        );

        return NextResponse.json(
            { error: "Server not configured" },
            { status: 500 }
        );
    }

    try {
        const resend = new Resend(apiKey);

        const { error } = await resend.emails.send({
            from: "DARSHAN DHAM Website <onboarding@resend.dev>",
            to: [contactTo],
            replyTo: email,
            subject: `New message from ${name}`,
            text: `Name: ${name}
Email: ${email}

${message}`,
            html: `
                <p><b>Name:</b> ${esc(name)}</p>
                <p><b>Email:</b> ${esc(email)}</p>
                <p style="white-space: pre-wrap">${esc(message)}</p>
            `,
        });

        if (error) {
            console.error("Resend error:", error);

            return NextResponse.json(
                { error: "Could not send" },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Contact form mail error:", err);

        return NextResponse.json(
            { error: "Could not send" },
            { status: 500 }
        );
    }
}