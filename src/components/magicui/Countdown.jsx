import { useEffect, useMemo, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

function getRemaining(targetDate) {
  const now = Date.now();
  const diff = Math.max(0, targetDate - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { diff, days, hours, minutes, seconds };
}

export default function Countdown({ target }) {
  const targetMs = useMemo(() => {
    const t = target instanceof Date ? target : new Date(target);
    return t.getTime();
  }, [target]);

  const [time, setTime] = useState(() => getRemaining(targetMs));

  useEffect(() => {
    let rafId;
    let lastTick = 0;
    const tick = (ts) => {
      if (!lastTick || ts - lastTick >= 1000) {
        lastTick = ts;
        setTime(getRemaining(targetMs));
      }
      if (time.diff > 0) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs]);

  // TEMPORARY: Placeholder segments with "??" - comment this out and uncomment below for normal countdown
  const segments = [
    { label: "Days", value: "??" },
    { label: "Hours", value: "??" },
    { label: "Minutes", value: "??" },
    { label: "Seconds", value: "??" },
  ];

  // NORMAL VERSION: Uncomment this for actual countdown functionality
  /*
  const segments = [
    { label: "Days", value: pad(time.days) },
    { label: "Hours", value: pad(time.hours) },
    { label: "Minutes", value: pad(time.minutes) },
    { label: "Seconds", value: pad(time.seconds) },
  ];
  */

  return (
    <div
      className="countdown relative w-full max-w-3xl mx-auto"
      aria-live="polite"
      aria-label="Countdown timer"
    >
      {/* Accent gradient frame */}
      <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-[var(--blue-violet)]/70 via-[var(--lavender)]/60 to-[var(--blue-violet)]/70 shadow-[0_0_30px_rgb(124,77,255,0.25)]">
        <div className="rounded-2xl bg-black/60 backdrop-blur-[2px]">
          <div className="grid grid-cols-4 gap-2 md:gap-4 p-2.5 md:p-4">
            {segments.map((seg, i) => (
              <div
                key={seg.label}
                className="group relative rounded-xl md:rounded-2xl border border-[var(--lavender)]/25 bg-[#0b0b18]/70 px-2.5 py-2.5 md:px-4 md:py-4 overflow-hidden"
              >
                {/* soft glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(124,77,255,0.25),transparent_70%)]" />
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={
                      "font-extrabold tracking-tight text-[var(--space-white)] " +
                      "[font-size:clamp(1.125rem,4vw,2.5rem)] leading-none drop-shadow-[0_0_10px_rgba(124,77,255,0.25)] " +
                      (seg.label === "Seconds" ? " animate-pulse " : "")
                    }
                  >
                    {seg.value}
                  </div>
                  <div className="[margin-top:clamp(0.125rem,0.8vw,0.375rem)] [font-size:clamp(0.625rem,3vw,0.875rem)] uppercase [letter-spacing:clamp(0.02em,0.3vw,0.15em)] [padding-x:clamp(0.25rem,1.5vw,0.5rem)] [padding-y:clamp(0.125rem,0.8vw,0.25rem)] text-[var(--lavender)]/90 text-center leading-tight font-medium">
                    {seg.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
