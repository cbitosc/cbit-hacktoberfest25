import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Shuffle from "./Shuffle";

const faqs = [
  {
    question: "What is CBIT Hacktoberfest Hackathon?",
    answer:
      "The CBIT Hacktoberfest Hackathon 2025 is a thrilling 24-hour hackathon that inspires students and enthusiasts through community, collaboration, and skill-building. Participants will embrace the spirit of open source while diving into innovation and teamwork.",
  },
  {
    question: "Who can participate?",
    answer:
      "Anyone! This hackathon is open to students of all skill levels, whether you're a complete beginner or an experienced coder. No prior hackathon experience is required. If you're curious, motivated, and ready to learn, you're welcome to join!",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "No, CBIT Hacktoberfest Hackathon 2025 is completely free to join and participate in.",
  },
  {
    question: "Is this event open to beginners?",
    answer:
      "Absolutely! This hackathon is beginner-friendly. Students of all skill levels are welcome to participate and learn.",
  },
  {
    question: "What is Open Source?",
    answer:
      "Open Source refers to software whose source code is freely available for anyone to view, modify, and distribute. It promotes collaboration and transparency in software development.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, threshold: 0.1 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div id="FAQ" className="scroll-mt-20 relative py-12 px-4">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="heading">
            <Shuffle
              text="FAQ"
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
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-8"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div
                className="relative transition-all duration-300 group-hover:scale-[1.01]"
                style={{
                  backgroundColor: "#1C1C3F",
                  border: "2px solid #493F70",
                  boxShadow: "4px 4px 0px #8A86FF",
                }}
              >
                <motion.button
                  className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                >
                  <span
                    className="text-xl font-bold text-white pr-4"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    {faq.question}
                  </span>
                  <motion.span
                    className="font-bold text-3xl flex-shrink-0"
                    style={{ color: "#C2C2FF" }}
                    animate={{ rotate: openIndex === index ? 0 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {openIndex === index ? "−" : "+"}
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      aria-hidden={openIndex !== index}
                      initial={{ opacity: 0, maxHeight: 0 }}
                      animate={{ opacity: 1, maxHeight: "1000px" }} // Transition height to max value
                      exit={{ opacity: 0, maxHeight: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                        maxHeight: { duration: 0.5 },
                      }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        className="px-8 pb-6 leading-relaxed text-lg"
                        style={{
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          color: "#C2C2FF",
                        }}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        {faq.answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
