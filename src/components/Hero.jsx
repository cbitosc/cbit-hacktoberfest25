import { useState, useEffect } from "react";
import hfestlogo from "../assets/hfestlogo.gif";
// import transparentLogo from "../assets/TransparentBorderlessLogo.svg";
import transparentLogo from "../assets/TransparentLogo.svg";
import Waves from "./ui/Waves";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Hero() {
  const { user, loading } = useAuth();
  const [flickeringLetters, setFlickeringLetters] = useState({});
  const [decodingText, setDecodingText] = useState("");

  const fullText = "CBIT Hacktoberfest Hackathon '25";
  const lines = [
    "24-Hour Virtual Hackathon",
    "The Biggest Celebration of Open Source",
  ];
  const chars =
    "!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Flicker animation (unchanged)
  useEffect(() => {
    const createRandomFlicker = () => {
      const letterIndex = Math.floor(Math.random() * fullText.length);
      const blinkCount = Math.floor(Math.random() * 2) + 2; // 2–3 blinks
      const blinkDuration = 150;
      const blinkInterval = 100;

      let currentBlink = 0;

      const performBlink = () => {
        setFlickeringLetters((prev) => ({
          ...prev,
          [letterIndex]: true,
        }));

        setTimeout(() => {
          setFlickeringLetters((prev) => {
            const newState = { ...prev };
            delete newState[letterIndex];
            return newState;
          });

          currentBlink++;

          if (currentBlink < blinkCount) {
            setTimeout(performBlink, blinkInterval);
          }
        }, blinkDuration);
      };

      performBlink();
    };

    const scheduleNextFlicker = () => {
      const delay = Math.random() * 1500 + 500;
      setTimeout(() => {
        createRandomFlicker();
        scheduleNextFlicker();
      }, delay);
    };

    scheduleNextFlicker();
  }, []);

  // Decode animation with looping lines
  useEffect(() => {
    let currentLineIndex = 0;
    let iteration = 0;
    let phase = "decoding"; // can be "decoding" or "waiting"
    let interval;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const mobileLines = [
      "24-hour virtual hackathon",
      "Open source celebration",
    ];
    const cycleLines = isMobile ? mobileLines : lines;

    const startDecoding = () => {
      const targetText = cycleLines[currentLineIndex];
      const maxLen = targetText.length;

      interval = setInterval(() => {
        setDecodingText(() => {
          return targetText
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return targetText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        });

        if (iteration >= maxLen) {
          clearInterval(interval);
          phase = "waiting";
          setTimeout(() => {
            iteration = 0;
            currentLineIndex = (currentLineIndex + 1) % cycleLines.length;
            phase = "decoding";
            startDecoding();
          }, 2000); // wait 2s before switching to next line
        }

        iteration += 1 / 3;
      }, 30);
    };

    startDecoding();

    return () => clearInterval(interval);
  }, []);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // adjust key if different
    if (storedUser) {
      setIsSignedIn(true);
    }
  }, []);

  return (
    <div
      id="Hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0" />

      <Waves
        lineColor="rgba(255, 255, 255, 0.1)"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={35}
        waveAmpY={18}
        friction={0.92}
        tension={0.008}
        maxCursorMove={0}
        xGap={14}
        yGap={40}
        className="pointer-events-none z-0"
      />

      <div className="relative z-10 text-center px-4 max-w-6xl pt-0 sm:pt-16">
        <div className="flex justify-center items-center gap-4 mb-8">
          <img
            src={transparentLogo}
            alt="CBIT Logo"
            className="h-auto w-16 sm:w-20 md:w-24 lg:w-28 max-w-full"
          />
          <img
            src={hfestlogo}
            alt="Hacktoberfest Logo"
            className="h-auto w-28 sm:w-40 md:w-56 lg:w-64 max-w-full"
          />
        </div>

        <div
          className="font-bold text-4xl md:text-6xl lg:text-7xl leading-none"
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            textShadow:
              "4px 4px 0px rgba(0,0,0,0.5), 8px 8px 0px rgba(0,0,0,0.2)",
            imageRendering: "pixelated",
            letterSpacing: "2px",
          }}
        >
          {"CBIT".split("").map((letter, index) => (
            <span
              key={`cbit-${index}`}
              className={`transition-colors duration-75 ${
                flickeringLetters[index] ? "text-white" : "text-[#9F9FFF]"
              }`}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          className="mt-4 font-bold text-2xl md:text-3xl lg:text-4xl"
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            textShadow:
              "2px 2px 0px rgba(0,0,0,0.5), 4px 4px 0px rgba(0,0,0,0.2)",
            imageRendering: "pixelated",
            letterSpacing: "1px",
          }}
        >
          {"Hacktoberfest".split("").map((letter, index) => {
            const letterIndex = 5 + index;
            return (
              <span
                key={`hacktoberfest-${index}`}
                className={`transition-colors duration-75 ${
                  flickeringLetters[letterIndex]
                    ? "text-white"
                    : "text-[#9F9FFF]"
                }`}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <div
          className="mt-2 font-bold text-xl md:text-2xl lg:text-3xl"
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            textShadow:
              "2px 2px 0px rgba(0,0,0,0.5), 4px 4px 0px rgba(0,0,0,0.2)",
            imageRendering: "pixelated",
            letterSpacing: "1px",
          }}
        >
          {"Hackathon '25".split("").map((letter, index) => {
            const letterIndex = 18 + index;
            return (
              <span
                key={`hackathon-${index}`}
                className={`transition-colors duration-75 ${
                  flickeringLetters[letterIndex]
                    ? "text-white"
                    : "text-[#9F9FFF]"
                }`}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <div
          className="mt-8 font-bold text-sm sm:text-base md:text-2xl lg:text-3xl text-white leading-tight md:leading-normal tracking-tight md:tracking-normal whitespace-nowrap overflow-hidden"
          style={{
            fontFamily: '"Courier New", "Consolas", monospace',
            textShadow: `
              0 0 3px rgba(255, 255, 255, 0.6),
              0 0 6px rgba(255, 255, 255, 0.4),
              0 0 10px rgba(255, 255, 255, 0.2)
            `,
            animation: "neonPulse 2s ease-in-out infinite alternate",
            minHeight: "2.5em", // reserve space so no popping
            display: "inline-block",
          }}
        >
          {decodingText}
        </div>
        <div className="mt-0.5 mb-20 flex justify-center">
          {!loading && (
            <Link
              to={user ? "/prob" : "/signin"}
              className="group relative inline-block"
            >
              {/* Main button */}
              <span
                className="relative inline-block px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 text-sm sm:text-base md:text-lg font-bold text-white
                   bg-[#1C1C3F] rounded-[4px]
                   transition-colors duration-300 ease-out
                   group-hover:bg-gradient-to-r group-hover:from-[#5A5AB5] group-hover:to-[#a0a0ff]"
                style={{
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  textShadow: "1.5px 1.5px 0px rgba(0,0,0,0.3)",
                  boxShadow: "0 0 6px rgba(194,194,255,0.5)",
                }}
              >
                <span className="relative z-10">
                  {user ? "SELECT PROBLEM STATEMENTS" : "SIGN IN"}
                </span>

                {/* Corner brackets */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white group-hover:hidden"></span>
                <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white group-hover:hidden"></span>
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white group-hover:hidden"></span>
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white group-hover:hidden"></span>
              </span>

              {/* Shadow element */}
              <span
                className="absolute inset-0 bg-[#170F2F] border-2 border-[#C2C2FF] -z-10 rounded-[2px]"
                style={{
                  top: "3px",
                  left: "3px",
                  boxShadow: "0 0 6px rgba(194,194,255,0.3)",
                }}
              />
            </Link>
          )}
        </div>
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes pulse {
          from {
            opacity: 0.3;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes neonPulse {
          0% {
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.6),
              0 0 6px rgba(255, 255, 255, 0.4),
              0 0 10px rgba(255, 255, 255, 0.2);
          }
          100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8),
              0 0 8px rgba(255, 255, 255, 0.5),
              0 0 12px rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
