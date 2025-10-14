import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "../assets/TransparentLogo.svg";
import Hero from "../components/Hero";
import About from "../components/About";
import Mentors from "../components/Mentors";
import PrepSection from "../preptemberComponents/PrepSection";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import { StarsBackground } from "../components/ui/stars-background";
import TimelineComponent from "../components/timeline";

// Background options
const backgroundStyles = {
  cosmic: {
    name: "Cosmic Gradient",
    style:
      "linear-gradient(135deg, #1D0B3D 0%, #2D1B4E 25%, #3D2B5E 50%, #2D1B4E 75%, #1D0B3D 100%)",
  },
  aurora: {
    name: "Aurora Borealis",
    style: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  },
  sunset: {
    name: "Sunset Horizon",
    style:
      "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)",
  },
  nebula: {
    name: "Nebula Dreams",
    style:
      "radial-gradient(ellipse at top, #1e1e3f 0%, #1a1a35 50%, #16162b 100%)",
  },
  midnight: {
    name: "Midnight Sky",
    style:
      "linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 30%, #2a2a4a 60%, #1a1a3a 100%)",
  },
};

const Home = () => {
  const [selectedBg, setSelectedBg] = useState("nebula");
  const { scrollYProgress } = useScroll();

  // Background opacity based on scroll - starts showing after Hero section
  const bgOpacity = useTransform(scrollYProgress, [0, 0, 1], [0, 1, 1]);

  return (
    <div className="relative">
      {/* Background for sections after Hero - Fixed positioning */}
      <motion.div
        className="fixed inset-0 w-full overflow-hidden"
        style={{
          opacity: bgOpacity,
          zIndex: 1,
          pointerEvents: "none",
          height: "100vh",
          minHeight: "100vh",
        }}
      >
        {/* Base gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: backgroundStyles[selectedBg].style,
          }}
        />

        {/* Stars Background Layer */}
        <motion.div className="absolute inset-0">
          <StarsBackground
            starDensity={0.0005}
            allStarsTwinkle={true}
            twinkleProbability={0.9}
            minTwinkleSpeed={0.3}
            maxTwinkleSpeed={2}
            className="absolute inset-0"
          />
        </motion.div>

        {/* Gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      </motion.div>

      {/* Content Container - Scrollable */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Hero />

        {/* Transition div spanning Hero-About boundary */}
        <div className="relative z-30 -mt-8 md:-mt-12 lg:-mt-16 w-full">
          <div
            className="h-16 md:h-24 lg:h-32 w-full shadow-2xl relative overflow-hidden"
            style={{
              backdropFilter: "blur(2.5px)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Hero section text - scrolling right */}
            <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden flex items-center">
              <div
                className="whitespace-nowrap text-white/90 italic text-lg md:text-xl lg:text-2xl"
                style={{
                  animation: "scrollRight 35s linear infinite",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                  opacity: 0.8,
                }}
              >
                CBIT HACKTOBERFEST 2025
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                CBIT OPEN SOURCE COMMUNITY
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                LEARN.CODE.SHARE
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                INNOVATE TOGETHER
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                CBIT HACKTOBERFEST 2025
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                CBIT OPEN SOURCE COMMUNITY
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                LEARN.CODE.SHARE
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                INNOVATE TOGETHER
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                CBIT HACKTOBERFEST 2025
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
              </div>
            </div>

            {/* About section text - scrolling left */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden flex items-center">
              <div
                className="whitespace-nowrap text-white/90 italic text-lg md:text-xl lg:text-2xl"
                style={{
                  animation: "scrollLeft 35s linear infinite",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                  opacity: 0.8,
                }}
              >
                JOIN THE MOVEMENT
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                BUILD YOUR PORTFOLIO
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                GET READY TO SHIP
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                JOIN THE MOVEMENT
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                BUILD YOUR PORTFOLIO
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                GET READY TO SHIP
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                JOIN THE MOVEMENT
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                BUILD YOUR PORTFOLIO
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
                GET READY TO SHIP
                <span className="scroll-dots">
                  ▩<span style={{ opacity: 0.6 }}>▩</span>
                  <span style={{ opacity: 0.3 }}>▩</span>
                </span>
              </div>
            </div>

            {/* CSS animations */}
            <style jsx>{`
              @keyframes scrollRight {
                0% {
                  transform: translateX(-50%);
                }
                100% {
                  transform: translateX(0%);
                }
              }

              @keyframes scrollLeft {
                0% {
                  transform: translateX(0%);
                }
                100% {
                  transform: translateX(-50%);
                }
              }

              .scroll-dots {
                color: #a0a0ff;
                text-shadow: 2px 2px #403f7d, 3px 3px #1c1c3f;
                margin: 0 1em;
                display: inline-block;
                vertical-align: baseline;
                line-height: 1;
                font-size: 0.8em;
                position: relative;
                top: -0.2em;
                letter-spacing: 0.3em;
              }
            `}</style>
          </div>
        </div>

        <About />
        <PrepSection />
        <Mentors />
        <TimelineComponent />
        <Faq />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
