import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaCode,
  FaUsers,
  FaBrain,
  FaCogs,
  FaRocket,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaVideo
} from "react-icons/fa";
import styles from "./Preptember.module.css";
import driveLogo from "../assets/google-drive.png";
import Shuffle from "@/components/Shuffle";

const WorkshopActive = forwardRef((props, refs) => {
  // Destructure refs from parent
  const { sectionRef, titleRef, subtitleRef } = refs;

  const topics = [
    {
      icon: <FaGithub className="text-2xl" />,
      title: "Open-source culture",
      description: "Learn contribution workflows and community practices"
    },
    {
      icon: <FaCode className="text-2xl" />,
      title: "Git/GitHub Mastery",
      description: "Team collaboration and version control essentials"
    },
    {
      icon: <FaCogs className="text-2xl" />,
      title: "Full-Stack Development",
      description: "Frontend and backend development with AI integration"
    },
    {
      icon: <FaRocket className="text-2xl" />,
      title: "Technology Stacks",
      description: "Understanding tech stacks and their role in hackathons"
    },
    {
      icon: <FaBrain className="text-2xl" />,
      title: "AI Tools",
      description: "Leveraging AI for faster development and productivity"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Microservices",
      description: "Architecture for scalable applications"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="workshop"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 px-6 bg-[#1C1C3F] text-white overflow-hidden"
    >
      {/* Background gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full 
                      bg-gradient-to-r from-[#5A5AB5]/20 via-[#A0A0FF]/15 to-[#C2C2FF]/20 
                      blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full 
                      bg-gradient-to-r from-[#C2C2FF]/20 via-[#5A5AB5]/20 to-[#5E577C]/20 
                      blur-[100px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="heading">

            <Shuffle
              text="Workshop"
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

        {/* <motion.h2
            ref={subtitleRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true }}
            className={`${styles.eyebrow} text-xl md:text-2xl text-[#C2C2FF] mb-8`}
          >
            Hacktoberfest Prep Workshop
          </motion.h2> */}

        {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            viewport={{ once: true }}
            className={`${styles.body} text-lg md:text-xl max-w-4xl mx-auto mt-4 leading-relaxed`}
          >
            A 2-day online workshop by <span className={styles.bodyEm}>CBIT Open Source Community (COSC)</span>,
            designed to equip students with the skills and knowledge needed to succeed in hackathons and
            open-source contributions. The sessions will include hands-on training, interactive demos,
            and practical exercises.
          </motion.p> */}
        {/* </div> */}

        {/* Workshop Details Cards */}
        {/* <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#403F7D]/70 via-[#1C1C3F]/70 to-[#5E577C]/70
                       border border-[#5A5AB5]/30 backdrop-blur-lg rounded-2xl p-8 text-center
                       hover:shadow-[0_0_25px_rgba(160,160,255,0.25)] transition-all duration-500"
          >
            <FaCalendarAlt className="text-4xl text-[#A0A0FF] mx-auto mb-4" />
            <h3 className={`${styles.textLink} text-xl mb-2`}>Duration</h3>
            <p className={`${styles.body} text-[#C2C2FF]`}>29th & 30th September 2025</p>
            <p className={`${styles.body} text-sm text-[#D0CCE3]`}>(Online)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#403F7D]/70 via-[#1C1C3F]/70 to-[#5E577C]/70
                       border border-[#5A5AB5]/30 backdrop-blur-lg rounded-2xl p-8 text-center
                       hover:shadow-[0_0_25px_rgba(160,160,255,0.25)] transition-all duration-500"
          >
            <FaClock className="text-4xl text-[#C2C2FF] mx-auto mb-4" />
            <h3 className={`${styles.textLink} text-xl mb-2`}>Time</h3>
            <p className={`${styles.body} text-[#C2C2FF]`}>10:00 AM – 12:30 PM</p>
            <p className={`${styles.body} text-sm text-[#D0CCE3]`}>Daily</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#403F7D]/70 via-[#1C1C3F]/70 to-[#5E577C]/70
                       border border-[#5A5AB5]/30 backdrop-blur-lg rounded-2xl p-8 text-center
                       hover:shadow-[0_0_25px_rgba(160,160,255,0.25)] transition-all duration-500"
          >
            <FaGraduationCap className="text-4xl text-[#5A5AB5] mx-auto mb-4" />
            <h3 className={`${styles.textLink} text-xl mb-2`}>Focus</h3>
            <p className={`${styles.body} text-[#C2C2FF]`}>Open Source, Teamwork</p>
            <p className={`${styles.body} text-sm text-[#D0CCE3]`}>Hackathon Preparation</p>
          </motion.div>
        </div> */}

        {/* Topics Covered */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className={`${styles.headline} text-3xl md:text-4xl text-center mb-12 text-[#A0A0FF]`}
          >
            What You'll Learn
          </motion.h3>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {topics.map((topic, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-[#403F7D]/70 via-[#1C1C3F]/70 to-[#5E577C]/70
                           border border-[#5A5AB5]/30 backdrop-blur-lg rounded-2xl p-6
                           hover:shadow-[0_0_25px_rgba(160,160,255,0.25)] transition-all duration-500"
              >
                <div className="text-[#A0A0FF] mb-4">{topic.icon}</div>
                <h4 className={`${styles.textLink} text-lg mb-3`}>{topic.title}</h4>
                <p className={`${styles.body} text-sm text-[#D0CCE3]`}>{topic.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Workshop Concluded Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-[#403F7D]/70 via-[#1C1C3F]/70 to-[#5E577C]/70
                     border border-[#5A5AB5]/30 backdrop-blur-lg rounded-2xl p-10
                     hover:shadow-[0_0_25px_rgba(160,160,255,0.25)] transition-all duration-500"
        >
          <FaGraduationCap className="text-4xl text-[#A0A0FF] mx-auto mb-4" />
          <h3 className={`${styles.headline} text-2xl md:text-3xl mb-4 text-[#A0A0FF]`}>
            Workshop Concluded
          </h3>
          <p className={`${styles.body} text-lg mb-8 text-[#C2C2FF]`}>
            <span className={styles.bodyEm}>Preptember 2025</span> workshop has wrapped up successfully! A big thank you to everyone who participated and made this journey so inspiring. Whether you attended live or are catching up later, our complete set of workshop materials is open for all.
          </p>

          {/* Resource Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="bg-[#2A2A5F]/50 rounded-lg p-4 border border-[#5A5AB5]/20">
              <FaCode className="text-2xl text-[#C2C2FF] mx-auto mb-2" />
              <p className={`${styles.body} text-sm text-[#D0CCE3]`}>Handbooks</p>
            </div>
            <div className="bg-[#2A2A5F]/50 rounded-lg p-4 border border-[#5A5AB5]/20">
              <FaCogs className="text-2xl text-[#C2C2FF] mx-auto mb-2" />
              <p className={`${styles.body} text-sm text-[#D0CCE3]`}>Presentations</p>
            </div>
            <div className="bg-[#2A2A5F]/50 rounded-lg p-4 border border-[#5A5AB5]/20">
              <FaVideo className="text-2xl text-[#C2C2FF] mx-auto mb-2" />
              <p className={`${styles.body} text-sm text-[#D0CCE3]`}>Recordings</p>
            </div>
          </div>

          <motion.a
            href="https://drive.google.com/drive/folders/1pL1TcIKXs7lcLuwCd4CbkNv3m3dUSErl?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 sm:gap-3
                       px-4 sm:px-6 md:px-8 py-3 sm:py-4
                       font-bold text-xs sm:text-sm md:text-base lg:text-lg
                       uppercase tracking-wider
                       transition-all duration-300
                       w-full max-w-xs sm:max-w-sm md:max-w-fit mx-auto"
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
            <img
              src={driveLogo}
              alt="Google Drive"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain flex-shrink-0"
            />
            <span className="text-xs sm:text-base md:text-lg font-semibold text-center leading-tight">
              <span className="hidden sm:inline">Access Workshop Resources</span>
              <span className="sm:hidden">Workshop Resources</span>
            </span>
          </motion.a>



        </motion.div>
      </div>
    </section>
  );
});

WorkshopActive.displayName = "WorkshopActive";

export default WorkshopActive;
