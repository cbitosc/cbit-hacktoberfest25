import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { checkUserRegistration } from "../services/registrationService";
import { Loader, Users, User } from "lucide-react";
import { StarsBackground } from "../components/ui/stars-background";
import {
  MessageCircle,
  ExternalLink,
  Phone,
} from "lucide-react";

export default function TeamPage() {
  const { user } = useAuth();
  // console.log("Authenticated user:", user);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTeamData = async () => {
      try {
        const registrationCheck = await checkUserRegistration(user.uid);

        if (registrationCheck.isRegistered) {
          const registrationData = registrationCheck.registration;
          // Transform registration data to match expected teamData format
          const transformedTeamData = {
            leaderName: registrationData.leader.name,
            leaderEmail: registrationData.leaderEmail || registrationData.leader.email, // Use top-level field or fallback
            leaderCollege: registrationData.leader.college,
            teamSize: registrationData.teamSize,
            teammates: registrationData.teammates || [],
            techStack: registrationData.techStack,
            teamName: `Team of ${registrationData.teamSize}` // Default team name based on size
          };
          setTeamData(transformedTeamData);
          // console.log("Fetched team data:", transformedTeamData);
        } else {
          console.warn("No registration found");
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader className="w-6 h-6 animate-spin mr-2" />
        Loading team details...
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="text-center text-white mt-20">
        <Users className="w-16 h-16 mx-auto text-[#9F9FFF]" />
        <p className="text-lg mt-4">No team details found.</p>
        <p className="text-sm text-[#aaa] mt-2">Please register your team first.</p>
      </div>
    );
  }

  const teamSize = teamData.teammates?.length ? teamData.teammates.length + 1 : 1;

  return (
    <div
      className="min-h-screen py-8 px-4 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #1e1e3f 0%, #1a1a35 50%, #16162b 100%)",
      }}
    >
      {/* Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        <StarsBackground
          starDensity={0.0005}
          allStarsTwinkle={true}
          twinkleProbability={0.9}
          minTwinkleSpeed={0.3}
          maxTwinkleSpeed={2}
          className="absolute inset-0"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center py-18">
        
        {/* Info Card */}
        <div
          className="backdrop-blur-xl border-2 rounded-2xl p-8 shadow-2xl relative"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.95)",
            borderColor: "#8A86FF",
            boxShadow:
              "0 0 40px rgba(138, 134, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Team Name */}
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-8"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
            }}
          >
            {teamData.teamName}
          </h1>

          {/* Team Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
            {/* Team Leader */}
            <div className="p-4 rounded-lg bg-[#403F7D]/50 border border-[#5E577C]">
              <div className="flex items-center space-x-3 mb-2">
                <User className="w-5 h-5 text-[#C2C2FF]" />
                <span className="text-white font-semibold">Team Leader</span>
              </div>
              <p className="text-[#D0CCE3]">{teamData.leaderName}</p>
              <p className="text-sm text-[#aaa]">{user.email}</p>
              <p className="text-sm text-[#aaa]">{teamData.leaderCollege}</p>
            </div>

            {/* Team Size */}
            <div className="p-4 rounded-lg bg-[#403F7D]/50 border border-[#5E577C]">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-5 h-5 text-[#C2C2FF]" />
                <span className="text-white font-semibold">Team Size</span>
              </div>
              <p className="text-[#D0CCE3]">
                {teamSize === 1 ? "Solo Participant" : `${teamSize} Members`}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          {teamData.techStack && 
            <div className="text-left mb-8">
              <h3 className="text-white font-semibold mb-2">Tech Stack</h3>
              <p className="text-[#D0CCE3]">
                {teamData.techStack}
              </p>
            </div>
          }

          {/* ============ ADDITIONAL SECTIONS ============ */}
          <div className="space-y-6 mb-8">
            {teamData.teammates?.length > 0 && (
              <div className="text-left space-y-4">
                <h3 className="text-white font-semibold mb-2">Teammates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamData.teammates.map((mate, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-[#403F7D]/30 border border-[#5E577C]"
                    >
                      <p className="text-[#D0CCE3]">
                        <strong>Name:</strong> {mate.name}
                      </p>
                      <p className="text-[#aaa] text-sm">
                        <strong>Email:</strong> {mate.email}
                      </p>
                      <p className="text-[#aaa] text-sm">
                        <strong>College:</strong> {mate.college}
                      </p>
                      <p className="text-[#aaa] text-sm">
                        <strong>Branch:</strong> {mate.branch}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discord Channel - COMPULSORY */}
            <div
              className="p-6 rounded-lg border-l-4 border-red-400 bg-red-400/10"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <MessageCircle className="w-6 h-6 text-red-400" />
                <h3
                  className="text-red-400 font-bold"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  🚨 COMPULSORY: Join Discord Channel
                </h3>
              </div>
              <p
                className="text-red-100 mb-4 text-sm"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                ALL team members must join our Discord channel for
                announcements, updates, and team coordination.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => window.open("https://discord.gg/your-link", "_blank")}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "#5865F2",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Join Discord Channel</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* WhatsApp Group for Team Leaders */}
            <div
              className="p-6 rounded-lg border-l-4 border-green-400 bg-green-400/10"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="w-6 h-6 text-green-400" />
                <h3
                  className="text-green-400 font-bold"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Team Leaders WhatsApp Group
                </h3>
              </div>
              <p
                className="text-green-100 mb-4 text-sm"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Exclusive group for team leaders to receive important updates
                and coordination information.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => window.open("https://chat.whatsapp.com/your-link", "_blank")}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "#25D366",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  <Phone className="w-5 h-5" />
                  <span>Join WhatsApp Group</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Teammates */}

        </div>
      </div>
    </div>
  );
}
