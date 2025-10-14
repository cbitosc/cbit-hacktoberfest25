import React from "react";
import { Facebook, Instagram, Linkedin, ExternalLink } from "lucide-react";
import Logo from "../assets/logo.svg";
import HacktoberLogo from "../assets/hacktober.svg";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const socialLinks = [
    { href: "https://www.facebook.com/cbitosc/", Icon: Facebook },
    { href: "https://twitter.com/cbitosc/", Icon: FaXTwitter },
    { href: "https://www.instagram.com/cbitosc/", Icon: Instagram },
    { href: "https://www.linkedin.com/company/cbitosc/", Icon: Linkedin },
  ];

  const footerLinks = [
    { href: "https://hacktoberfest.com", text: "Hacktoberfest" },
    { href: "https://cbitosc.github.io/", text: "CBIT Open Source Community" },
    { href: "https://cbitosc.github.io/coc/", text: "Code of Conduct" },
  ];

  return (
    <footer
      className="relative py-10 px-6"
      style={{ backgroundColor: "#0C0C1F" }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col-reverse gap-6 lg:flex-row w-full">
            {/* Left Section */}
            <div className="flex gap-4 flex-col flex-1">
              <div>
                <div className="flex gap-3">
                  <img
                    src={Logo}
                    alt="Main Logo"
                    className="h-9 w-auto cursor-pointer"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  />
                  <img
                    src={HacktoberLogo}
                    alt="Hacktober Logo"
                    className="h-9 w-auto cursor-pointer"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  />
                </div>
                <p
                  className="text-xl font-bold pt-3 text-white"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  CBIT Hacktoberfest 2025
                  <br />
                  CBIT Open Source Community
                </p>
              </div>

              <div>
                <p
                  className="py-2 text-sm"
                  style={{
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    color: "#C2C2FF",
                  }}
                >
                  Follow us on Social Media
                </p>
                <div className="flex gap-3">
                  {socialLinks.map(({ href, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      className="text-2xl hover:scale-110 transition-all duration-300"
                      style={{ color: "#C2C2FF" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#8A86FF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#C2C2FF")
                      }
                    >
                      <Icon size={22} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Content */}
            <div className="flex-[2] flex flex-col gap-4">
              <div className="flex gap-3">
                <span
                  className="text-2xl font-bold flex-shrink-0 self-start"
                  style={{ color: "#8A86FF", lineHeight: 1 }}
                >
                  {">"}
                </span>
                <div>
                  <h3
                    className="text-white text-xl font-bold mb-2"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      lineHeight: 1.2,
                    }}
                  >
                    What we do?
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      color: "#C2C2FF",
                    }}
                  >
                    We're a community dedicated to advancing open‑source
                    culture. We host{" "}
                    <strong className="text-white">hackathons</strong>, conduct{" "}
                    <strong className="text-white">bootcamps</strong>, and run{" "}
                    <strong className="text-white">workshops</strong> to equip
                    students with the skills they need to thrive in tech.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span
                  className="text-2xl font-bold flex-shrink-0 self-start"
                  style={{ color: "#8A86FF", lineHeight: 1 }}
                >
                  {">"}
                </span>
                <div>
                  <h3
                    className="text-white text-xl font-bold mb-2"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      lineHeight: 1.2,
                    }}
                  >
                    Join us on this journey
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      color: "#C2C2FF",
                    }}
                  >
                    <strong className="text-white">CBIT Hacktoberfest</strong>{" "}
                    isn't just an event — it's a chance to be part of something
                    bigger and make an impact in tech. Whether you're a{" "}
                    <strong className="text-white">seasoned developer</strong>,
                    a <strong className="text-white">curious beginner</strong>,
                    or someone with a passion for technology, we invite you to
                    join us.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Links */}
          <div
            className="w-full flex flex-col pt-6 border-t"
            style={{ borderColor: "#493F70" }}
          >
            <div className="flex w-full justify-evenly items-center flex-wrap gap-4">
              {footerLinks.map(({ href, text }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  className="transition-colors text-base flex items-center gap-2 group hover:scale-105"
                  style={{
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    color: "#C2C2FF",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#8A86FF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#C2C2FF")
                  }
                >
                  {text}
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
