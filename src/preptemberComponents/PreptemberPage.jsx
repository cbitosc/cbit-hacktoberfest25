"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection4 from "./Hero4";
import WorkshopActive from "./WorkShopActive";
import GettingStartedSection from "./GettingStartedSection";

gsap.registerPlugin(ScrollTrigger);

const PreptemberPage = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  useEffect(() => {
    // Force scroll to top only when this page loads
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    // Hero section animations
    if (heroRef.current && titleRef.current && subtitleRef.current) {
      const tl = gsap.timeline();

      // Animate the title
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 100, scale: 1.2 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }
      );

      // Animate the subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      );

      // Animate the floating elements
      tl.fromTo(
        ".floating-element",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.7"
      );
    }

    const section = sectionRef.current;
    if (section && wordsRef.current) {
      const words = wordsRef.current.children;

      // Position the words initially
      gsap.set(words, { x: (i) => (i - 2) * 120 + "%" });

      // Animate words as you scroll
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        })
        .to(words, {
          x: (i) => (i - 5) * 120 + "%",
          ease: "none",
        });
    }

    // Animate Workshop section on scroll
    if (sectionRef.current && titleRef.current && subtitleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 80, scale: 1.2 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <HeroSection4
        ref={heroRef}
        titleRef={titleRef}
        subtitleRef={subtitleRef}
      />

      {/* Workshop Section */}
      <WorkshopActive ref={{ sectionRef, titleRef, subtitleRef }} />

      {/* Resources Section */}
      <GettingStartedSection />
    </>
  );
};

export default PreptemberPage;
