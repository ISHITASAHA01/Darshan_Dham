import Link from "next/link";

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
            <p className="text-6xl">🛕</p>
            <h1 className="mt-4 font-heading text-3xl font-semibold">
                Ye mandir nahi mila
            </h1>
            <p className="mt-2 text-brown/70">
                Page hat gaya ho ya link galat ho sakta hai.
            </p>
            <div className="mt-6 flex gap-3">
                <Link
                    href="/"
                    className="rounded-md bg-saffron px-5 py-2 text-sm font-medium text-white hover:bg-saffron-dark"
                >
                    Home
                </Link>
                <Link
                    href="/temples"
                    className="rounded-md border border-saffron px-5 py-2 text-sm font-medium text-saffron hover:bg-saffron hover:text-white"
                >
                    Saare mandir
                </Link>
            </div>
        </main>
    );
}