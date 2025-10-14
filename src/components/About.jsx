import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Shuffle from "./Shuffle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Lazy load the World component for better performance
const World = lazy(() =>
  import("./ui/globe").then((module) => ({ default: module.World }))
);

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const DetailCard = React.memo(
  ({ label, value, index, isRow = false, icon: Icon }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    // Memoize card styles for performance
    const cardStyles = useMemo(
      () => ({
        backgroundColor: "rgba(28, 28, 63, 0.95)",
        border: "2px solid #6B5FA5",
        borderRadius: "20px",
        padding: isRow ? "20px 24px" : "24px 28px",
        boxShadow: isHovered
          ? "0 0 40px rgba(138, 134, 255, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)"
          : "0 0 25px rgba(138, 134, 255, 0.2), 0 5px 15px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(15px)",
        borderColor: isHovered ? "#8A86FF" : "#6B5FA5",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: isHovered
          ? "translateY(-5px) scale(1.02)"
          : "translateY(0) scale(1)",
        minHeight: isRow ? "auto" : "160px",
        maxHeight: isRow ? "120px" : "auto",
        willChange: "transform, box-shadow, border-color",
      }),
      [isHovered, isRow]
    );

    useEffect(() => {
      if (!ref.current) return;

      // Set initial state to fully visible with no animation
      gsap.set(ref.current, { opacity: 1, scale: 1, y: 0 });

      return () => {};
    }, [index]);

    return (
      <div
        ref={ref}
        className={`group relative ${
          isRow ? "text-center" : "text-left"
        } overflow-hidden`}
        style={cardStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`flex ${isRow ? "flex-col items-center" : "items-start"} ${
            isRow ? "gap-3" : "gap-4"
          }`}
        >
          <div className="flex-1">
            <div
              className={`flex items-center ${
                isRow ? "gap-2 mb-3 justify-center" : "gap-3 mb-4"
              }`}
            >
              {!isRow && (
                <span
                  style={{
                    color: "#8A86FF",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    lineHeight: "1.3",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  &gt;
                </span>
              )}
              {Icon && (
                <Icon
                  size={24}
                  style={{
                    color: "#8A86FF",
                    strokeWidth: 2,
                  }}
                />
              )}
              <span
                className="font-bold uppercase tracking-wider text-base md:text-lg break-words"
                style={{
                  color: "#E8E6FF",
                  textShadow: "1px 1px 0px #493F70",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  wordWrap: "break-word",
                  hyphens: "auto",
                  fontSize: isRow ? "1.1rem" : "1rem",
                  lineHeight: "1.3",
                }}
              >
                {label}
              </span>
            </div>
            <span
              className="block text-sm break-words"
              style={{
                color: "#E8E6FF",
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
                lineHeight: "1.6",
                wordWrap: "break-word",
                hyphens: "auto",
                marginTop: "8px",
                fontSize: isRow ? "1.125rem" : "0.95rem",
                fontWeight: "normal",
                textAlign: isRow ? "center" : "left",
              }}
            >
              {value}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

const About = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, threshold: 0.1 });

  // Check if device is mobile (screen width < 768px)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Memoize globe data to prevent unnecessary re-renders
  const globeData = useMemo(
    () => [
      {
        startLat: 17.385,
        startLng: 78.4867,
        endLat: 40.7128,
        endLng: -74.006,
        color: "#8A86FF",
        arcAlt: 0.3,
        order: 1,
      },
      {
        startLat: 17.385,
        startLng: 78.4867,
        endLat: 51.5074,
        endLng: -0.1278,
        color: "#C2C2FF",
        arcAlt: 0.2,
        order: 2,
      },
      {
        startLat: 17.385,
        startLng: 78.4867,
        endLat: 37.7749,
        endLng: -122.4194,
        color: "#A0A0FF",
        arcAlt: 0.4,
        order: 3,
      },
    ],
    []
  );

  // Memoize globe config for performance
  const globeConfig = useMemo(
    () => ({
      pointSize: 4,
      globeColor: "#4A4A8A",
      showAtmosphere: true,
      atmosphereColor: "#8A86FF",
      atmosphereAltitude: 0.15,
      emissive: "#4A4A8A",
      emissiveIntensity: 0.4,
      shininess: 0.9,
      polygonColor: "rgba(255, 255, 255, 0.6)",
      ambientLight: "#ffffff",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#ffffff",
      arcTime: 4000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
    }),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Set initial state to fully visible with no animation
    gsap.set(containerRef.current, { opacity: 1, y: 0 });

    return () => {};
  }, []);

  return (
    <section
      id="About"
      className="scroll-mt-20 relative min-h-screen w-full pt-16 md:pt-20 lg:pt-24 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden"
      style={{
        contain: "layout style paint",
        willChange: "transform",
      }}
    >
      {/* Main Content Container */}
      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading">
            <Shuffle
              text="About"
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

        {/* Side-by-Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[800px]">
          {/* Left Side - Cards */}
          <div className="flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
            {/* What is Hacktoberfest Card */}
            <div>
              <DetailCard
                label="What is Hacktoberfest?"
                value="Hacktoberfest is DigitalOcean's annual event that inspires people to contribute to open source throughout October. Modern tech, including DigitalOcean's own products, relies on open-source projects maintained by passionate creators with limited resources. Hacktoberfest is about giving back, honing skills, and celebrating the open-source community and the people who make it thrive."
                index={0}
              />
            </div>

            {/* Who Are We Card */}
            <div>
              <DetailCard
                label="Who Are We?"
                value="We are the Chaitanya Bharathi Institute of Technology Open Source Community (COSC) in Hyderabad. Our mission is to promote open source values, provide a platform for students to explore and contribute to tech, all while crafting experiences that nurture a lifelong love for open source."
                index={1}
              />
            </div>

            {/* Where and When Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Where Card */}
              <div>
                <DetailCard
                  label="Where?"
                  value="Discord"
                  index={3}
                  isRow={true}
                  icon={MapPin}
                />
              </div>

              {/* When Card */}
              <div>
                <DetailCard
                  label="When?"
                  value="25th-26th October 2025"
                  index={2}
                  isRow={true}
                  icon={Calendar}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Globe Only */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            {/* Globe with Rings Container - No Animation */}
            <div className="relative flex items-center justify-center w-96 h-96 lg:w-[500px] lg:h-[500px]">
              {/* Globe - Enhanced smooth fade in animation */}
              <motion.div
                className="relative z-10 w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{
                  duration: 1.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.2,
                }}
              >
                {isInView && (
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8A86FF]"></div>
                      </div>
                    }
                  >
                    <World data={globeData} globeConfig={globeConfig} />
                  </Suspense>
                )}
              </motion.div>

              {/* Optimized Orbital Rings - Only render when visible, no animation on mobile */}
              {isInView && (
                <>
                  <motion.div
                    className="absolute inset-0 border border-[#8A86FF]/20 rounded-full pointer-events-none"
                    style={{
                      width: "120%",
                      height: "120%",
                      left: "-10%",
                      top: "-10%",
                      willChange: "transform",
                    }}
                    animate={isMobile ? {} : { rotate: 360 }}
                    transition={
                      isMobile
                        ? {}
                        : {
                            duration: 60,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop",
                          }
                    }
                  />
                  <motion.div
                    className="absolute inset-0 border border-[#C2C2FF]/10 rounded-full pointer-events-none"
                    style={{
                      width: "140%",
                      height: "140%",
                      left: "-20%",
                      top: "-20%",
                      willChange: "transform",
                    }}
                    animate={isMobile ? {} : { rotate: -360 }}
                    transition={
                      isMobile
                        ? {}
                        : {
                            duration: 80,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop",
                          }
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
