import { motion } from 'framer-motion';

const ContactCard = ({ icon, title, content, href, index }) => {
  const cardContent = (
    <motion.div
      className="relative group overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.25 }
      }}
      data-testid={`card-contact-${title.toLowerCase()}`}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl"></div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)`
        }}
      />
      
      {/* Card content */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border border-white/30 shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:bg-white/20 z-20">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 group-hover:from-cyan-400/30 group-hover:to-purple-400/30 transition-all duration-300">
            <div className="text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300 text-2xl">
              {icon}
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4 text-center drop-shadow-lg group-hover:text-cyan-100 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Content */}
        <div className="text-gray-200 text-center leading-relaxed group-hover:text-gray-100 transition-colors duration-300 whitespace-pre-line" data-testid={`text-contact-${title.toLowerCase()}`}>
          {content}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block" data-testid={`link-contact-${title.toLowerCase()}`}>
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default ContactCard;