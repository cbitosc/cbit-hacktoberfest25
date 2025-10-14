import { motion } from 'framer-motion';

const WaveText = ({ text, className, style }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const waveVariants = {
    wave: {
      y: [-5, -15, -5],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  return (
    <motion.div
      style={style}
      className={`flex ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
          whileHover="wave"
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.1,
            }
          }}
          style={{
            display: 'inline-block',
            transformOrigin: 'center bottom'
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default WaveText;