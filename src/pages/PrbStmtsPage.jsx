import React from "react";
import { StarsBackground } from "../components/ui/stars-background";

const PrbStmtsPage = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #1e1e3f 0%, #1a1a35 50%, #16162b 100%)",
      }}
    >
      <div className="absolute inset-0">
        <StarsBackground
          starDensity={0.0005}
          allStarsTwinkle={true}
          twinkleProbability={0.9}
          minTwinkleSpeed={0.3}
          maxTwinkleSpeed={2}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 text-center">
        <div
          className="p-8 rounded-2xl border-2 backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.85)",
            borderColor: "#8A86FF",
            boxShadow: "0 0 30px rgba(138, 134, 255, 0.2)",
          }}
        >
          <h1
            className="text-3xl font-extrabold mb-4"
            style={{ color: "var(--space-white)", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
          >
            Problem Statement Selection Closed
          </h1>
          <p className="text-lg mb-4" style={{ color: "#D0CCE3" }}>
            Thank you for your interest — problem statement selection is now closed.
          </p>

          <p className="text-sm" style={{ color: "#C2C2FF" }}>
            If you believe this is an error or need assistance, please contact the organizers.
          </p>

        </div>
      </div>
    </section>
  );
};

export default PrbStmtsPage;
