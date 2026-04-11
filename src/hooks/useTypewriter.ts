"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface TypewriterLine {
    text: string;
    color: string;
}

interface UseTypewriterOptions {
    lines: TypewriterLine[];
    charDuration?: number;
    lineDelay?: number;
    initialDelay?: number;
    waitForLoading?: boolean;
}

interface TypewriterState {
    displayLines: string[];
    cursorLine: number;
    done: boolean;
}

export function useTypewriter({
    lines,
    charDuration = 0.045,
    lineDelay = 0.15,
    initialDelay = 0.4,
    waitForLoading = false,
}: UseTypewriterOptions): TypewriterState {
    const [displayLines, setDisplayLines] = useState<string[]>(lines.map(() => ""));
    const [cursorLine, setCursorLine] = useState(0);
    const [done, setDone] = useState(false);
    const [ready, setReady] = useState(!waitForLoading);
    const containerRef = useRef({ progress: 0 });

    useEffect(() => {
        if (!waitForLoading) return;
        const handler = () => setReady(true);
        window.addEventListener("loading-complete", handler);
        return () => window.removeEventListener("loading-complete", handler);
    }, [waitForLoading]);

    useEffect(() => {
        if (!ready) return;

        const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
        const totalDuration = totalChars * charDuration + (lines.length - 1) * lineDelay;

        const tl = gsap.timeline({ delay: initialDelay });

        lines.forEach((line, lineIndex) => {
            const lineStart = lineIndex > 0 ? `+=${lineDelay}` : undefined;

            tl.to(
                {},
                {
                    duration: line.text.length * charDuration,
                    ease: "none",
                    onStart: () => setCursorLine(lineIndex),
                    onUpdate() {
                        const progress = this.progress();
                        const charCount = Math.floor(progress * line.text.length);
                        setDisplayLines((prev) => {
                            const next = [...prev];
                            next[lineIndex] = line.text.slice(0, charCount);
                            return next;
                        });
                    },
                    onComplete: () => {
                        setDisplayLines((prev) => {
                            const next = [...prev];
                            next[lineIndex] = line.text;
                            return next;
                        });
                    },
                },
                lineStart
            );
        });

        tl.call(() => setDone(true));

        return () => {
            tl.kill();
        };
    }, [ready]);

    return { displayLines, cursorLine, done };
}
