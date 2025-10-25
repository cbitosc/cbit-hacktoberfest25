import "../styles/ProbStatements.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Shuffle from "./Shuffle";
import { StarsBackground } from "./ui/stars-background";

function ProbStatements() {
  useEffect(() => {
    const detailItems = document.querySelectorAll(".prob-button");

    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    }

    // Function to handle scroll event
    function handleScroll() {
      detailItems.forEach((item) => {
        if (isInViewport(item)) {
          item.classList.add("visible");
        }
      });
    }

    // Initial check on page load
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="ProbStatements" className="prob-section">
      {/* Top Stars Window with mask */}
      <div className="prob-stars-window-top">
        <StarsBackground
          starDensity={0.0005}
          allStarsTwinkle={true}
          twinkleProbability={0.9}
          minTwinkleSpeed={0.3}
          maxTwinkleSpeed={2}
          className="prob-stars-canvas"
        />
      </div>

      {/* Decorative SVG at the top */}
      <svg
        className="prob-section-top-svg"
        width="1440"
        height="140"
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
        shapeRendering="crispEdges"
      >
        <rect width="72.0003" height="69.79" fill="#17172E" />
        <rect x="720" width="72.0003" height="58.145" fill="#17172E" />
        <rect x="360" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1080" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="72" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="792" width="72.0003" height="23.25" fill="#17172E" />
        <rect x="432" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1152" width="72.0003" height="37.786" fill="#17172E" />
        <rect
          x="0.000488281"
          y="69.79"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect x="144" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="863.999" width="72.0003" height="122.073" fill="#17172E" />
        <rect x="504" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1224" width="72.0003" height="58.145" fill="#17172E" />
        <rect x="216" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="936" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="576" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1296" width="72.0003" height="69.79" fill="#17172E" />
        <rect
          x="181.333"
          y="43.609"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect x="288" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="1008" width="72.0003" height="58.145" fill="#17172E" />
        <rect
          x="445.333"
          y="23.25"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect
          x="648"
          y="43.609"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect x="648" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1368" width="72.0003" height="122.073" fill="#17172E" />
      </svg>

      <div className="prob-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading">
            <Shuffle
              text="Problem Statements"
              shuffleDirection="right"
              duration={0.45}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.01}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
            />
          </h2>
        </div>

        <p className="prob-subtitle">
          Ready to tackle exciting challenges? Choose your mission!
        </p>
        <div className="prob-actions">
          <Link
            className="prob-button"
            to="/prob"
            onClick={() => window.scrollTo(0, 0)}
          >
            <span>VIEW PROBLEM STATEMENTS</span>
          </Link>
        </div>
      </div>

      {/* Bottom Stars Window with mask */}
      <div className="prob-stars-window-bottom">
        <StarsBackground
          starDensity={0.0005}
          allStarsTwinkle={true}
          twinkleProbability={0.9}
          minTwinkleSpeed={0.4}
          maxTwinkleSpeed={1.2}
          className="prob-stars-canvas"
        />
      </div>

      {/* Decorative SVG at the bottom (flipped 180 degrees) */}
      <svg
        className="prob-section-bottom-svg"
        width="1440"
        height="140"
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
      >
        <rect width="72.0003" height="69.79" fill="#17172E" />
        <rect x="720" width="72.0003" height="58.145" fill="#17172E" />
        <rect x="360" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1080" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="72" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="792" width="72.0003" height="23.25" fill="#17172E" />
        <rect x="432" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1152" width="72.0003" height="37.786" fill="#17172E" />
        <rect
          x="0.000488281"
          y="69.79"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect x="144" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="863.999" width="72.0003" height="122.073" fill="#17172E" />
        <rect x="504" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1224" width="72.0003" height="58.145" fill="#17172E" />
        <rect x="216" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="936" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="576" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1296" width="72.0003" height="69.79" fill="#17172E" />
        <rect
          x="181.333"
          y="43.609"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect x="288" width="72.0003" height="69.79" fill="#17172E" />
        <rect x="1008" width="72.0003" height="58.145" fill="#17172E" />
        <rect
          x="445.333"
          y="23.25"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect
          x="648"
          y="43.609"
          width="72.0003"
          height="69.79"
          fill="#17172E"
        />
        <rect x="648" width="72.0003" height="43.609" fill="#17172E" />
        <rect x="1368" width="72.0003" height="122.073" fill="#17172E" />
      </svg>
    </section>
  );
}

export default ProbStatements;
