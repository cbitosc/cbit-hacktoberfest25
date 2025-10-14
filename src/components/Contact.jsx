import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import Shuffle from './Shuffle';

const ContactCard = ({ icon, title, content, href, index, noIconBackground }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, threshold: 0.3 });

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group relative h-full"
    >
      <div
        className="relative p-4 transition-all duration-300 h-full flex flex-col group-hover:scale-[1.02] 
                    group-hover:shadow-[0px_0px_10px_5px_rgba(138,134,255,0.6),0px_0px_15px_10px_rgba(73,63,112,0.6)]"
        style={{
          backgroundColor: '#1C1C3F',
          border: '2px solid #493F70',
          boxShadow: '4px 4px 0px #8A86FF',
          minHeight: '200px', // Reduced min height
        }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mb-4 mx-auto">
          <div style={{ color: '#C2C2FF' }}>{icon}</div>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold mb-4 text-center text-white"
          style={{
            fontFamily: "'Atkinson Hyperlegible', sans-serif",
          }}
        >
          {title}
        </h3>

        {/* Content */}
        <div
          className="text-center mb-4 whitespace-pre-line leading-relaxed text-sm flex-grow"
          style={{
            fontFamily: "'Atkinson Hyperlegible', sans-serif",
            color: '#C2C2FF',
          }}
        >
          {content}
        </div>

        {/* Buttons - positioned at bottom with sharp edges */}
        <div className="flex justify-center mt-auto">
          {href.startsWith('mailto:') || href.startsWith('tel:') ? (
            <a
              href={href}
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold transition-all duration-300"
              style={{
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
                backgroundColor: '#C2C2FF',
                color: '#1C1C3F',
                border: '2px solid #C2C2FF',
              }}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Contact
            </a>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold transition-all duration-300"
              style={{
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
                backgroundColor: '#C2C2FF',
                color: '#1C1C3F',
                border: '2px solid #C2C2FF',
              }}
            >
              <MapPin className="w-5 h-5 mr-2" />
              View Location
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Contact = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, threshold: 0.1 });

  const contactData = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location",
      content: "Chaitanya Bharathi Institute of Technology\nGandipet, Hyderabad",
      href: "https://maps.google.com/?q=Chaitanya+Bharathi+Institute+of+Technology",
      noIconBackground: true,
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email",
      content: "cosc@cbit.ac.in",
      href: "mailto:cosc@cbit.ac.in",
      noIconBackground: true,
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone",
      content: "Saimanoj: +91 8919312156\nMuqeet: +91 9959525751",
      href: "tel:+918919312156",
      noIconBackground: true,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div id="Contact" className="scroll-mt-20 relative py-12 px-4 overflow-hidden">
      <div className="w-full mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="heading">
            <Shuffle
              text="Contact"
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

        {/* Contact Cards Grid */}
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" // Reduced gap size
        >
          {contactData.map((contact, index) => (
            <ContactCard
              key={contact.title}
              icon={contact.icon}
              title={contact.title}
              content={contact.content}
              href={contact.href}
              index={index}
              noIconBackground={contact.noIconBackground}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
