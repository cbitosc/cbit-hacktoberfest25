import React from "react";
import { StarsBackground } from "../components/ui/stars-background";
import {
  Calendar,
  AlertCircle,
  Info,
} from "lucide-react";

const RegistrationsClosed = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12 sm:py-16"
      style={{
        background:
          "radial-gradient(ellipse at top, #1e1e3f 0%, #1a1a35 50%, #16162b 100%)",
      }}
    >
      {/* Stars Background */}
      <div className="absolute inset-0">
        <StarsBackground
          starDensity={0.0005}
          allStarsTwinkle={true}
          twinkleProbability={0.9}
          minTwinkleSpeed={0.3}
          maxTwinkleSpeed={2}
          className="absolute inset-0"
        />
      </div>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
        </div>

        {/* Main Card */}
        <div
          className="backdrop-blur-xl border-2 rounded-2xl p-6 sm:p-10 shadow-2xl mb-8 sm:mb-10 transition-all duration-300 hover:shadow-3xl"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.95)",
            borderColor: "#8A86FF",
            boxShadow:
              "0 0 40px rgba(138, 134, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Status Message */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" 
                style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
              >
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
                textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
              }}
            >
              Registrations Are Closed
            </h1>
            <p
              className="text-lg text-[#D0CCE3] mb-8 leading-relaxed"
              style={{
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
              }}
            >
              The registration window for CBIT Hacktoberfest 2025 has officially closed. 
              We received an overwhelming response and are excited to see the incredible 
              teams that will be participating in this year's hackathon.
            </p>
          </div>

          {/* Information Sections */}
          <div className="space-y-8">
            {/* Access Restrictions Notice */}
            <div
              className="p-6 sm:p-8 rounded-xl border-2 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                borderColor: "rgba(255, 193, 7, 0.3)",
              }}
            >
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-yellow-400 mb-4"
                    style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                  >
                    Team Access & Editing Disabled
                  </h3>
                  <div className="space-y-4">
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "#D0CCE3",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      <strong className="text-yellow-300">• Team Editing:</strong> The ability to edit team details has been permanently disabled now that registrations have closed.
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "#D0CCE3",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      <strong className="text-yellow-300">• Team Details Access:</strong> Access to detailed team information is no longer available through this portal.
                    </p>
                    <p
                      className="text-sm leading-relaxed font-medium"
                      style={{
                        color: "#E8E6FF",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      All team information has been finalized and locked in preparation for the hackathon.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Registered Teams */}
            <div
              className="p-6 sm:p-8 rounded-xl border-2 transition-all duration-300 hover:border-opacity-50 hover:shadow-lg"
              style={{
                backgroundColor: "rgba(138, 134, 255, 0.1)",
                borderColor: "rgba(138, 134, 255, 0.3)",
              }}
            >
              <div className="flex items-start space-x-4">
                <Info className="w-6 h-6 text-[#C2C2FF] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                  >
                    Already Registered?
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "#E8E6FF",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      lineHeight: "1.6",
                    }}
                  >
                    If you're already registered for CBIT Hacktoberfest 2025, please follow the Discord and WhatsApp groups for important communication and updates. You will receive an email with your allotted team number soon.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div
              className="p-6 sm:p-8 rounded-xl border-2 transition-all duration-300 hover:border-opacity-50 hover:shadow-lg"
              style={{
                backgroundColor: "rgba(194, 194, 255, 0.1)",
                borderColor: "rgba(194, 194, 255, 0.3)",
              }}
            >
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-[#C2C2FF] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                  >
                    What's Next?
                  </h3>
                  <ul
                    className="text-sm space-y-3 leading-relaxed"
                    style={{
                      color: "#E8E6FF",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      lineHeight: "1.6",
                    }}
                  >
                    <li className="flex items-start">
                      <span className="text-[#8A86FF] mr-3 flex-shrink-0 font-bold">•</span>
                      <span>Join the Git & GitHub Workshop on October 24th at 7:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8A86FF] mr-3 flex-shrink-0 font-bold">•</span>
                      <span>Prepare for the hackathon starting October 25th at 4:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8A86FF] mr-3 flex-shrink-0 font-bold">•</span>
                      <span>Follow the discord and whatsapp groups for further updates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8A86FF] mr-3 flex-shrink-0 font-bold">•</span>
                      <span>Follow our social media for updates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className="p-6 sm:p-8 rounded-xl border-2 transition-all duration-300 hover:border-opacity-50 hover:shadow-lg"
              style={{
                backgroundColor: "rgba(160, 160, 255, 0.1)",
                borderColor: "rgba(160, 160, 255, 0.3)",
              }}
            >
              <div className="flex items-start space-x-4">
                <Info className="w-6 h-6 text-[#C2C2FF] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                  >
                    Questions or Concerns?
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "#E8E6FF",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      lineHeight: "1.6",
                    }}
                  >
                    If you have any questions about your registration or the event, 
                    please don't hesitate to reach out to our team. We're here to help!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p
            className="text-sm opacity-90 leading-relaxed px-4"
            style={{
              color: "#C2C2FF",
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
            }}
          >
            Thank you for being part of the CBIT Hacktoberfest 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsClosed;