"use client";

import { useEffect, useRef, useState } from "react";
import {
    ExternalLink,
    FileText,
    Flame,
    Heart,
    Pause,
    Play,
    SkipBack,
    SkipForward,
} from "lucide-react";

export type BhajanTrack = {
    title: string;
    kind: string;
    about?: string;
    lyrics?: string;     // Roman (English akshar) me
    lyricsHi?: string;   // Hindi (देवनागरी) me
};

/*
 * AUDIO KAISE JODEN (sirf wahi audio use karo jo tumhari apni ho, ya jiska permission ho):
 *
 * 1. mp3 file ko  public/audio/  folder me rakho (3-5 MB tak)
 * 2. Neeche title ke saath file ka path likho, jaise:
 *      "Om Jai Jagdish Hare": "/audio/om-jai-jagdish-hare.mp3",
 *
 * Jis gaane ki file yahan nahi hogi, uske liye "Listen on YouTube" button dikhega.
 */
const AUDIO_FILES: Record<string, string> = {
    // "Om Jai Jagdish Hare": "/audio/om-jai-jagdish-hare.mp3",
};

/*
 * YouTube VIDEO EMBED (optional): kisi official channel ke video ka ID yahan likho.
 * Video ka link https://www.youtube.com/watch?v=ABCDEFGHIJK ho to ID = ABCDEFGHIJK
 *      "Om Jai Jagdish Hare": "ABCDEFGHIJK",
 */
const YOUTUBE_IDS: Record<string, string> = {
    // "Om Jai Jagdish Hare": "ABCDEFGHIJK",
};

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function BhajanSection({ tracks }: { tracks: BhajanTrack[] }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const autoPlayRef = useRef(false);

    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showLyrics, setShowLyrics] = useState(false);
    const [script, setScript] = useState<"hi" | "roman">("hi");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [filter, setFilter] = useState("All");

    const safeIndex = Math.min(index, Math.max(tracks.length - 1, 0));
    const track = tracks[safeIndex];

    // Track badalte hi progress reset karo, aur zaroorat ho to agla gaana chalao
    useEffect(() => {
        setCurrentTime(0);
        setDuration(0);

        const el = audioRef.current;
        if (!el) {
            setPlaying(false);
            return;
        }

        el.load();

        if (autoPlayRef.current) {
            el.play()
                .then(() => setPlaying(true))
                .catch(() => setPlaying(false));
        } else {
            setPlaying(false);
        }
    }, [safeIndex]);

    if (!track) return null;

    const audioSrc = AUDIO_FILES[track.title];
    const youtubeId = YOUTUBE_IDS[track.title];
    const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${track.title} ${track.kind}`
    )}`;

    const kinds = ["All", ...Array.from(new Set(tracks.map((t) => t.kind)))];
    const visibleTracks = tracks
        .map((t, i) => ({ t, i }))
        .filter(({ t }) => filter === "All" || t.kind === filter);

    const isFavorite = favorites.includes(track.title);

    function selectTrack(i: number, keepPlaying = false) {
        autoPlayRef.current = keepPlaying;
        setShowLyrics(false);
        setIndex(i);
    }

    function goPrev() {
        selectTrack((safeIndex - 1 + tracks.length) % tracks.length, playing);
    }

    function goNext() {
        selectTrack((safeIndex + 1) % tracks.length, playing);
    }

    function togglePlay() {
        const el = audioRef.current;
        if (!el) return;

        if (playing) {
            el.pause();
            setPlaying(false);
        } else {
            el.play()
                .then(() => setPlaying(true))
                .catch(() => setPlaying(false));
        }
    }

    function toggleFavorite() {
        setFavorites((prev) =>
            prev.includes(track.title)
                ? prev.filter((t) => t !== track.title)
                : [...prev, track.title]
        );
    }

    function seek(value: number) {
        const el = audioRef.current;
        if (el) el.currentTime = value;
        setCurrentTime(value);
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[#ead5b5] bg-white shadow-md">
            {/* ---------- Ab jo gaana chuna hai ---------- */}
            <div className="bg-gradient-to-br from-[#fffaf0] via-[#fff5e5] to-[#f8e5c9] p-5">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e6a13b] to-[#a95716] shadow-md">
                        <Flame className="h-9 w-9 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#a66a27]">
                            {audioSrc && playing ? "Now playing" : "Selected"}
                        </p>
                        <h3 className="mt-1 truncate font-heading text-lg font-bold text-[#603b20]">
                            {track.title}
                        </h3>
                        <p className="text-sm text-[#98734e]">
                            {track.kind} • Devotional Music
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
                        aria-pressed={isFavorite}
                        className="rounded-full p-2 hover:bg-white/70"
                    >
                        <Heart
                            className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-[#a66a27]"}`}
                        />
                    </button>
                </div>

                {/* Real audio element sirf tab jab file di gayi ho */}
                {audioSrc && (
                    <audio
                        ref={audioRef}
                        src={audioSrc}
                        preload="metadata"
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        onPause={() => setPlaying(false)}
                        onPlay={() => setPlaying(true)}
                        onEnded={() => {
                            setPlaying(false);
                            if (safeIndex < tracks.length - 1) selectTrack(safeIndex + 1, true);
                        }}
                    />
                )}

                {audioSrc ? (
                    <>
                        <div className="mt-5">
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                step={0.1}
                                value={currentTime}
                                onChange={(e) => seek(Number(e.target.value))}
                                aria-label="Seek"
                                className="h-1.5 w-full cursor-pointer accent-[#c47a24]"
                            />
                            <div className="mt-1 flex justify-between text-xs text-[#98734e]">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-center gap-8">
                            <button
                                type="button"
                                onClick={goPrev}
                                disabled={tracks.length < 2}
                                aria-label="Previous song"
                                className="text-[#a66a27] disabled:opacity-40"
                            >
                                <SkipBack size={25} />
                            </button>

                            <button
                                type="button"
                                onClick={togglePlay}
                                aria-label={playing ? "Pause" : "Play"}
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#e6a13b] to-[#b96819] text-white shadow-lg"
                            >
                                {playing ? (
                                    <Pause size={27} fill="currentColor" />
                                ) : (
                                    <Play size={27} fill="currentColor" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={goNext}
                                disabled={tracks.length < 2}
                                aria-label="Next song"
                                className="text-[#a66a27] disabled:opacity-40"
                            >
                                <SkipForward size={25} />
                            </button>
                        </div>
                    </>
                ) : youtubeId ? (
                    <div className="mt-5 aspect-video overflow-hidden rounded-xl">
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                            title={track.title}
                            allow="accelerometer; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                        />
                    </div>
                ) : (
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={tracks.length < 2}
                            aria-label="Previous song"
                            className="text-[#a66a27] disabled:opacity-40"
                        >
                            <SkipBack size={22} />
                        </button>

                        <a
                            href={youtubeSearch}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#e6a13b] to-[#b96819] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90"
                        >
                            <Play size={16} fill="currentColor" />
                            Listen on YouTube
                            <ExternalLink size={14} />
                        </a>

                        <button
                            type="button"
                            onClick={goNext}
                            disabled={tracks.length < 2}
                            aria-label="Next song"
                            className="text-[#a66a27] disabled:opacity-40"
                        >
                            <SkipForward size={22} />
                        </button>
                    </div>
                )}

                {track.about && (
                    <p className="mt-5 text-sm leading-relaxed text-[#80684e]">{track.about}</p>
                )}

                {(track.lyrics || track.lyricsHi) && (() => {
                    const both = Boolean(track.lyrics && track.lyricsHi);
                    const active: "hi" | "roman" = both ? script : track.lyricsHi ? "hi" : "roman";
                    const text = active === "hi" ? track.lyricsHi : track.lyrics;

                    return (
                        <>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowLyrics((v) => !v)}
                                    aria-expanded={showLyrics}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#e5c99e] bg-white/70 px-4 py-2 text-sm font-semibold text-[#8d451b] hover:bg-white"
                                >
                                    <FileText size={16} />
                                    {showLyrics ? "Hide lyrics" : "Show lyrics"}
                                </button>

                                {showLyrics && both && (
                                    <div className="inline-flex overflow-hidden rounded-full border border-[#e5c99e] text-xs font-bold" role="group" aria-label="Lyrics script">
                                        {([["hi", "हिन्दी"], ["roman", "English"]] as const).map(([id, label]) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setScript(id)}
                                                aria-pressed={active === id}
                                                className={`px-3.5 py-2 transition ${active === id ? "bg-[#8d451b] text-white" : "bg-white/70 text-[#8d451b] hover:bg-white"}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {showLyrics && (
                                <p
                                    translate="no"
                                    lang={active === "hi" ? "hi" : "en"}
                                    className={`notranslate mt-3 max-h-96 overflow-y-auto whitespace-pre-line rounded-xl border border-[#ead5b5] bg-white/80 p-5 text-[#3b2615] ${active === "hi" ? "text-lg leading-9" : "text-base leading-relaxed"}`}
                                >
                                    {text}
                                </p>
                            )}
                        </>
                    );
                })()}
            </div>

            {/* ---------- Playlist ---------- */}
            <div className="p-4">
                {kinds.length > 2 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {kinds.map((k) => (
                            <button
                                key={k}
                                type="button"
                                onClick={() => setFilter(k)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filter === k
                                    ? "bg-[#8d451b] text-white"
                                    : "bg-saffron-light text-saffron-dark hover:bg-[#f6dcbd]"
                                    }`}
                            >
                                {k}
                            </button>
                        ))}
                    </div>
                )}

                <ul className="divide-y divide-saffron-light text-sm">
                    {visibleTracks.map(({ t, i }) => {
                        const active = i === safeIndex;
                        return (
                            <li key={t.title}>
                                <button
                                    type="button"
                                    onClick={() => selectTrack(i, false)}
                                    aria-current={active}
                                    className={`flex w-full items-center gap-3 px-2 py-3 text-left transition hover:bg-[#fff5e5] ${active ? "bg-[#fff1da]" : ""
                                        }`}
                                >
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-[#c47a24] text-white" : "bg-saffron-light text-saffron-dark"
                                            }`}
                                    >
                                        {active && playing ? <Pause size={14} fill="currentColor" /> : i + 1}
                                    </span>

                                    <span className={`flex-1 ${active ? "font-semibold text-[#603b20]" : "text-foreground"}`}>
                                        {t.title}
                                    </span>

                                    <span className="rounded-full bg-saffron-light px-2.5 py-0.5 text-xs text-saffron-dark">
                                        {t.kind}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}