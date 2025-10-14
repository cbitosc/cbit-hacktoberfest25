"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Preptember.module.css";
import Button from "./Button";

const HeroSection4 = () => {
  const text = "Preptember".split("");

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const letter = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6 } },
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[url('/Untitled.svg')] sm:bg-[url('/prepBackL.svg')] bg-cover bg-center bg-no-repeat bg-[#1C1C3F]">
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Background COSC Text */}
      {/* <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <h1
          className={`${styles.headline} text-[15rem] sm:text-[20rem] md:text-[30rem] lg:text-[25rem] xl:text-[30rem] select-none leading-[0.9] text-center`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.05,
            whiteSpace: "nowrap",
          }}
        >
          <span className="block lg:inline">CO</span>
          <span className="block lg:inline ml-0 lg:ml-10">SC</span>
        </h1>
      </div> */}

      {/* Hero Content */}
      <div className="relative z-10 text-center px-5">
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className={`${styles.headline} ${styles.gradientText} text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] tracking-tight font-extrabold`}
        >
          {text.map((char, i) => (
            <motion.span key={i} variants={letter} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className={`${styles.body} mt-6 max-w-2xl mx-auto text-lg sm:text-xl`}
        >
          <span className={styles.bodyEm}>Preptember</span> is the ultimate
          opportunity designed to get you ready for{" "}
          <span className={styles.bodyEm}>CBIT HacktoberFest 2025</span>. Whether you
          are a hackathon veteran or a first-time participant, we’ll introduce
          you to the basic technologies you’ll need so you’re fully prepared!
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-12 md:gap-20 lg:gap-40"
        >
          <Button
            func={() =>
              document
                .getElementById("workshop")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            text="Workshop"
            style="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm md:text-base font-semibold"
          />
          <Button
            func={() =>
              document
                .getElementById("resources")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            text="Explore Resources"
            style="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm md:text-base font-semibold"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection4;
