import React from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaBookOpen,
  FaRocket,
  FaNewspaper,
  FaFileAlt,
  FaGraduationCap,
  FaLaptopCode,
  FaCodeBranch,
} from "react-icons/fa";
import styles from "./Preptember.module.css"; 
import Shuffle from "@/components/Shuffle";

const resources = [
  {
    title: "Official HacktoberFest Website",
    link: "https://hacktoberfest.com/",
    desc: "Kickstart your journey with Hacktoberfest.",
    icon: <FaRocket className="text-3xl text-[#A0A0FF]" />, // Lavendar
  },
  {
    title: "How to Contribute to Open Source",
    link: "https://opensource.guide/how-to-contribute/",
    desc: "Learn how to effectively contribute to open source.",
    icon: <FaBookOpen className="text-3xl text-[#C2C2FF]" />, // Melrose
  },
  {
    title: "cosc GitHub",
    link: "https://github.com/cbitosc",
    desc: "Explore our official GitHub repositories.",
    icon: <FaGithub className="text-3xl text-[#5A5AB5]" />, // Blue Violet
  },
  {
    title: "cosc Newsletter",
    link: "https://cbitosc.substack.com/",
    desc: "Stay updated with our latest news and events.",
    icon: <FaNewspaper className="text-3xl text-[#5E577C]" />, // Space Haze
  },
  {
    title: "cosc Docs (Workshops/ Bootcamps)",
    link: "https://github.com/cbitosc/resources",
    desc: "Access docs from past events and workshops.",
    icon: <FaGraduationCap className="text-3xl text-[#A0A0FF]" />, // Lavendar
  },
  {
    title: "Getting Started with Git & GitHub",
    link: "https://docs.github.com/en/get-started/start-your-journey",
    desc: "Official GitHub guide for beginners.",
    icon: <FaCodeBranch className="text-3xl text-[#C2C2FF]" />, // Melrose
  },
  {
    title: "FreeCodeCamp Hackathon Guide",
    link: "https://www.freecodecamp.org/news/cracking-the-hackathon-complete-guide-to-winning-a-hackathon-8d196646cc9a/",
    desc: "Learn how to win and thrive in hackathons.",
    icon: <FaLaptopCode className="text-3xl text-[#5A5AB5]" />, // Blue Violet
  },
  {
    title: "Git Cheatsheet",
    link: "https://training.github.com/downloads/github-git-cheat-sheet/",
    desc: "Quick reference guide for Git commands.",
    icon: <FaFileAlt className="text-3xl text-[#5E577C]" />, // Space Haze
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const GettingStartedSection = () => {
  return (
    <section
      className="relative py-24 px-6 bg-[#1C1C3F] text-white overflow-hidden"
      id="resources"
    >
      {/* Subtle gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full 
                      bg-gradient-to-r from-[#5A5AB5]/20 via-[#A0A0FF]/15 to-[#C2C2FF]/20 
                      blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full 
                      bg-gradient-to-r from-[#C2C2FF]/20 via-[#5A5AB5]/20 to-[#5E577C]/20 
                      blur-[100px]" />

      {/* Title */}
      <div className="relative max-w-7xl mx-auto text-center mb-24 px-4">
        <h2 className="heading">
      
      <Shuffle
        text="Resources"
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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className={`${styles.body} mt-6 text-lg md:text-xl max-w-2xl mx-auto`}
        >
          Essential links to dive into open source & hackathons 🚀
        </motion.p>
      </div>

      {/* Cards */}
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {resources.map((res, idx) => (
            <motion.a
              key={idx}
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative rounded-2xl p-8 shadow-xl 
                         bg-gradient-to-br from-[#403F7D]/70 via-[#1C1C3F]/70 to-[#5E577C]/70
                         border border-[#5A5AB5]/30 backdrop-blur-lg
                         hover:shadow-[0_0_25px_rgba(160,160,255,0.25)]
                         transition-all duration-500"
            >
              {/* Icon */}
              <div className="relative z-10 mb-4">{res.icon}</div>

              {/* Title */}
              <h3 className={`${styles.textLink} text-xl relative z-10`}>
                {res.title}
              </h3>

              {/* Description */}
              <p className={`${styles.body} mt-3 text-sm relative z-10`}>
                {res.desc}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GettingStartedSection;
