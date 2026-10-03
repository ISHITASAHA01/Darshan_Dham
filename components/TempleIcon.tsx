// Indian mandir (shikhara) icon - color text-* class se control hota hai (currentColor)
export default function TempleIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 64 64"
            className={className}
            fill="currentColor"
            aria-hidden="true"
        >
            {/* kalash + dhwaj */}
            <rect x="31.4" y="1" width="1.2" height="5" />
            <path d="M32 5.5c1.6 0 2.6 1.1 2.6 2.4 0 1-.8 1.8-2.6 1.8s-2.6-.8-2.6-1.8c0-1.3 1-2.4 2.6-2.4z" />
            {/* amalaka */}
            <ellipse cx="32" cy="12" rx="4.2" ry="1.9" />
            {/* main shikhara (tiers) */}
            <path d="M32 9.5C36.5 14 40.5 22 43 33H21C23.5 22 27.5 14 32 9.5z" />
            {/* shikhara rings */}
            <rect x="27" y="16" width="10" height="1.3" fill="#fff" opacity=".3" />
            <rect x="25" y="21.5" width="14" height="1.3" fill="#fff" opacity=".3" />
            <rect x="23" y="27" width="18" height="1.3" fill="#fff" opacity=".3" />
            {/* mandapa roof */}
            <path d="M14 38.5l4-5.5h28l4 5.5z" />
            {/* sanctum body */}
            <path d="M16 38.5h32V52H16z" />
            {/* door arch */}
            <path
                d="M28 52V44.5a4 4 0 0 1 8 0V52z"
                fill="#fff"
                opacity=".35"
            />
            {/* side windows */}
            <rect x="19.5" y="42" width="4" height="6" rx="2" fill="#fff" opacity=".3" />
            <rect x="40.5" y="42" width="4" height="6" rx="2" fill="#fff" opacity=".3" />
            {/* steps / base */}
            <rect x="12" y="52" width="40" height="3.5" />
            <rect x="8" y="55.5" width="48" height="4" rx=".5" />
        </svg>
    );
}