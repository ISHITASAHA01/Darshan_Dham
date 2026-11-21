"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** next/image jaisa hi, par file na mile to toota hua icon nahi dikhata (kuch nahi dikhata). */
export default function SafeImage(props: ImageProps) {
    const [failed, setFailed] = useState(false);
    if (failed) return null;
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image {...props} onError={() => setFailed(true)} />;
}