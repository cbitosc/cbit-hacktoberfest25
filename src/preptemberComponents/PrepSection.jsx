import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Shuffle from "@/components/Shuffle";

const PrepSection = () => {
  const containerRef = useRef(null);
  // Use a lower threshold for earlier visibility, but stick to once: true
  const isInView = useInView(containerRef, { once: true, threshold: 0.05 });

  // 💡 IMPROVEMENT: Define a new set of variants for the main content group
  // This group (Description, Features Grid, CTA) will now stagger properly.
  const mainContentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // 💡 Added a small stagger for the main content blocks (p, grid, a)
        delayChildren: 0.2, // Delay the start of child animations slightly
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40, // Increased y for a more noticeable slide-up
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.25, 1, 0.5, 1], // Custom energetic ease (like 'easeOutExpo')
      },
    },
  };

  // 💡 NEW: Variants specifically for the individual feature cards inside the grid
  const featureCardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="Preptember"
      className="scroll-mt-20 relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 flex justify-center items-center w-full"
          initial={{ opacity: 0, y: -50 }} // Increased y for header reveal
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }} // Slightly faster header transition
        >
          <h2 className="heading">
            <Shuffle
              text="Preptember"
              shuffleDirection="right"
              duration={0.6}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              className="preptember-title"
            />
          </h2>
        </motion.div>

        {/* Main content card */}
        <div ref={containerRef}>
          <motion.div
            variants={mainContentVariants} // Use the new mainContentVariants for the wrapper
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative group"
          >
            <div
              className="relative overflow-hidden transition-all duration-500 group-hover:scale-[1.01]"
              style={{
                backgroundColor: "rgba(28, 28, 63, 0.85)",
                border: "3px solid var(--melrose)",
                boxShadow: "8px 8px 0px var(--blue-violet)",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Decorative corners - removed to clean up JSX (if possible, should be done with CSS) */}
              <div
                className="absolute top-0 left-0 w-4 h-4"
                style={{ backgroundColor: "var(--lavender)" }}
              ></div>
              <div
                className="absolute top-0 right-0 w-4 h-4"
                style={{ backgroundColor: "var(--lavender)" }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-4 h-4"
                style={{ backgroundColor: "var(--lavender)" }}
              ></div>
              <div
                className="absolute bottom-0 right-0 w-4 h-4"
                style={{ backgroundColor: "var(--lavender)" }}
              ></div>

              <div className="p-6 sm:p-8 lg:p-12 text-center relative z-20">
                {/* Description */}
                <motion.p
                  variants={itemVariants} // This will be the first item in the stagger
                  className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto"
                  style={{
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    color: "var(--space-gray)",
                  }}
                >
                  Prepare for{" "}
                  <span className="font-bold" style={{ color: "var(--melrose)" }}>
                    CBIT Hacktoberfest
                  </span>{" "}
                  with Preptember. Get on board with COSC as a month of{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--lavender)" }}
                  >
                    learning
                  </span>
                  ,{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--lavender)" }}
                  >
                    coding
                  </span>
                  , and{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--lavender)" }}
                  >
                    open source contributions
                  </span>{" "}
                  awaits!
                </motion.p>

                {/* Features grid container - this whole block is the second item in the main stagger */}
                <motion.div
                  variants={itemVariants}
                  className="mb-6 sm:mb-8"
                >
                  {/* Inner grid which will have its own stagger */}
                  <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }, // 💡 Added stagger for feature cards
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  >
                    {[
                      {
                        /* ... Feature 1 data ... */
                        title: "Learning",
                        desc: "Master new technologies",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                            width="32"
                            height="32"
                            className="w-8 h-8 mx-auto transition-all duration-300"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(85%) sepia(25%) saturate(366%) hue-rotate(202deg) brightness(102%) contrast(97%) drop-shadow(0 0 2px rgba(194, 194, 255, 0.6))",
                            }}
                          >
                            <path d="m2,2.5c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5-1.119,2.5-2.5,2.5-2.5-1.119-2.5-2.5Zm12,5.5c.552,0,1-.447,1-1s-.448-1-1-1H4C1.794,6,0,7.794,0,10v3c0,.553.448,1,1,1s1-.447,1-1v-3c0-1.103.897-2,2-2h2v5c0,.553.448,1,1,1s1-.447,1-1v-5h6ZM19.5,0h-9.5c-.552,0-1,.447-1,1s.448,1,1,1h9.5c1.378,0,2.5,1.121,2.5,2.5v5c0,1.379-1.122,2.5-2.5,2.5h-.5v-1c0-.553-.448-1-1-1h-2c-.552,0-1,.447-1,1v1h-4c-.552,0-1,.447-1,1s.448,1,1,1h8.5c2.481,0,4.5-2.019,4.5-4.5v-5c0-2.481-2.019-4.5-4.5-4.5Zm1,21c-1.257,0-2.433.478-3.225,1.311-.381.4-.365,1.034.036,1.414.4.382,1.033.364,1.414-.035.82-.863,2.73-.863,3.551,0,.196.206.46.311.725.311.248,0,.496-.091.689-.275.4-.38.417-1.014.036-1.414-.792-.833-1.967-1.311-3.225-1.311Zm-8.5,0c-1.257,0-2.433.478-3.225,1.311-.381.4-.365,1.034.036,1.414.4.382,1.034.364,1.414-.035.82-.863,2.73-.863,3.551,0,.196.206.46.311.725.311.248,0,.496-.091.689-.275.4-.38.417-1.014.036-1.414-.792-.833-1.967-1.311-3.225-1.311Zm-8.5,0c-1.257,0-2.433.478-3.225,1.311-.381.4-.365,1.034.036,1.414.4.382,1.034.364,1.414-.035.82-.863,2.73-.863,3.551,0,.196.206.46.311.725.311.248,0,.496-.091.689-.275.4-.38.417-1.014.036-1.414-.792-.833-1.967-1.311-3.225-1.311Zm2-3c0-1.105-.895-2-2-2s-2,.895-2,2,.895,2,2,2,2-.895,2-2Zm8.5,0c0-1.105-.895-2-2-2s-2,.895-2,2,.895,2,2,2,2-.895,2-2Zm8.5,0c0-1.105-.895-2-2-2s-2,.895-2,2,.895,2,2,2,2-.895,2-2Z" />
                          </svg>
                        ),
                      },
                      {
                        /* ... Feature 2 data ... */
                        title: "Coding",
                        desc: "Strengthen your coding foundations",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                            width="32"
                            height="32"
                            className="w-8 h-8 mx-auto transition-all duration-300"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(85%) sepia(25%) saturate(366%) hue-rotate(202deg) brightness(102%) contrast(97%) drop-shadow(0 0 1px rgba(194, 194, 255, 0.5))",
                            }}
                          >
                            <path d="m3 5.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm5.5 1.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm15.5-1v12c0 2.757-2.243 5-5 5h-14c-2.757 0-5-2.243-5-5v-12c0-2.757 2.243-5 5-5h14c2.757 0 5 2.243 5 5zm-22 0v2h20v-2c0-1.654-1.346-3-3-3h-14c-1.654 0-3 1.346-3 3zm20 12v-8h-20v8c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3zm-11.793-4.793c.391-.391.391-1.023 0-1.414s-1.023-.391-1.414 0l-2.181 2.181c-.872.872-.872 2.29.019 3.18l2.181 2.071c.399.381 1.033.365 1.413-.036.381-.4.364-1.033-.036-1.413l-2.162-2.054c-.092-.092-.092-.242 0-.334l2.181-2.181zm5-1.414c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l2.181 2.181c.092.092.092.242.011.323l-2.159 2.093c-.396.384-.406 1.018-.021 1.414.385.397 1.018.406 1.414.021l2.17-2.104c.872-.872.872-2.29 0-3.162l-2.181-2.181z" />
                          </svg>
                        ),
                      },
                      {
                        /* ... Feature 3 data ... */
                        title: "Open Source",
                        desc: "Contribute to the community",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                            width="32"
                            height="32"
                            className="w-8 h-8 mx-auto transition-all duration-300"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(85%) sepia(25%) saturate(366%) hue-rotate(202deg) brightness(102%) contrast(97%) drop-shadow(0 0 1px rgba(194, 194, 255, 0.5))",
                            }}
                          >
                            <path d="M24,4c0-2.206-1.794-4-4-4s-4,1.794-4,4c0,1.86,1.277,3.428,3,3.873v.127c0,1.654-1.346,3-3,3H8c-1.125,0-2.164,.374-3,1.002V7.873c1.723-.445,3-2.013,3-3.873C8,1.794,6.206,0,4,0S0,1.794,0,4c0,1.86,1.277,3.428,3,3.873v8.253c-1.723,.445-3,2.013-3,3.873,0,2.206,1.794,4,4,4s4-1.794,4-4c0-1.86-1.277-3.428-3-3.873v-.127c0-1.654,1.346-3,3-3h8c2.757,0,5-2.243,5-5v-.127c1.723-.445,3-2.013,3-3.873ZM2,4c0-1.103,.897-2,2-2s2,.897,2,2-.897,2-2,2-2-.897-2-2ZM6,20c0,1.103-.897,2-2,2s-2-.897-2-2,.897-2,2-2,2,.897,2,2ZM20,6c-1.103,0-2-.897-2-2s.897-2,2-2,2,.897,2,2-.897,2-2,2Z" />
                          </svg>
                        ),
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={featureCardVariants} // Apply feature card specific variants
                        className="p-3 sm:p-4 transition-all duration-300 hover:scale-105 group"
                        style={{
                          backgroundColor: "rgba(90, 90, 181, 0.25)",
                          border: "2px solid var(--lavender)",
                          borderRadius: "12px",
                          boxShadow: "4px 4px 0px var(--east-bay)",
                        }}
                        whileHover={{
                          y: -3,
                          boxShadow: "6px 6px 0px var(--void)",
                        }}
                      >
                        <div
                          className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"
                          style={{
                            filter:
                              typeof feature.icon === "object"
                                ? "drop-shadow(0 0 8px rgba(194, 194, 255, 0.6))"
                                : "none",
                          }}
                        >
                          {feature.icon}
                        </div>
                        <h3
                          className="font-bold text-base sm:text-lg mb-1"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            color: "var(--space-white)",
                            textShadow: "1px 1px 0px var(--blue-violet)",
                          }}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: "var(--space-dust)" }}
                        >
                          {feature.desc}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* CTA Button - this will be the last item in the main stagger */}
                <motion.div variants={itemVariants}>
                  <motion.a
                    href="/preptember"
                    className="inline-block px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base lg:text-lg uppercase tracking-wider transition-all duration-300"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      color: "var(--space-white)",
                      backgroundColor: "var(--blue-violet)",
                      border: "3px solid var(--melrose)",
                      borderRadius: "8px",
                      boxShadow: "4px 4px 0px var(--void)",
                      textShadow: "1px 1px 0px var(--east-bay)",
                    }}
                    whileHover={{
                      scale: 1.03,
                      y: -2,
                      backgroundColor: "var(--lavender)",
                      boxShadow: "6px 6px 0px var(--void)",
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    Learn More <span className="ml-2">→</span>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PrepSection;