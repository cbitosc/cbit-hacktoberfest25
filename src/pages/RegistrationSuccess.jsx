import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StarsBackground } from "../components/ui/stars-background";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  CheckCircle,
  Users,
  User,
  Home,
  Download,
  Calendar,
  Mail,
  MessageCircle,
  ExternalLink,
  Phone,
  Loader,
  School,
  BookOpen,
  GraduationCap,
  PhoneCall,
  IdCard,
  Copy,
  Check,
  Edit3,
  Code,
} from "lucide-react";

// Custom Discord Icon Component
const DiscordIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488" />
  </svg>
);

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeamDetails, setLoadingTeamDetails] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [techStack, setTechStack] = useState(null);
  const [currentRegistrationData, setCurrentRegistrationData] = useState(null);
  const [teamProblemData, setTeamProblemData] = useState(null);
  const [loadingProblemStatement, setLoadingProblemStatement] = useState(false);

  // Discord channel link - replace with actual link
  const discordChannelLink = "https://discord.gg/JjbrMx8td";

  // WhatsApp group link - replace with actual link
  const whatsappGroupLink = "https://chat.whatsapp.com/Ij0kQb7rD3uHqyRxjDkxMK";

  // Copy Discord link function
  const copyDiscordLink = async () => {
    try {
      await navigator.clipboard.writeText(discordChannelLink);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Copy WhatsApp link function
  const copyWhatsAppLink = async () => {
    try {
      await navigator.clipboard.writeText(whatsappGroupLink);
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Get registration data from navigation state
  const registrationData = location.state;
  // Redirect to home if no registration data
  useEffect(() => {
    if (!registrationData) {
      navigate("/");
    } else {
      // Initialize currentRegistrationData with the state data
      setCurrentRegistrationData(registrationData);
    }
  }, [registrationData, navigate]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch complete team member details from registrations collection
  // AND problem statement from teamprob collection in ONE useEffect
  useEffect(() => {
    const fetchTeamData = async () => {
      if (registrationData) {
        setLoadingTeamDetails(true);
        setLoadingProblemStatement(true);
        try {
          const registrationsRef = collection(db, "registrations");
          let q;

          if (registrationData.leaderEmail) {
            // Fast query using top-level leaderEmail field
            q = query(
              registrationsRef,
              where("leaderEmail", "==", registrationData.leaderEmail)
            );
          } else {
            // Fallback for older registrations without leaderEmail field
            q = query(
              registrationsRef,
              where("leader.email", "==", registrationData.leaderEmail)
            );
          }

          const querySnapshot = await getDocs(q);
          const allMembers = [];
          let teamNum = null;

          querySnapshot.forEach((doc) => {
            const regData = doc.data();

            // Update current registration data with latest from database
            const updatedData = {
              ...registrationData,
              ...regData,
              registrationId: doc.id,
            };
            setCurrentRegistrationData(updatedData);

            // Get team number for problem statement fetch
            teamNum = regData.teamNumber || regData.mergedIntoTeam;

            // Store tech stack if it exists and team size is less than 3
            if (regData.teamSize < 3 && regData.techStack) {
              // Handle both array and string formats
              if (Array.isArray(regData.techStack)) {
                setTechStack(regData.techStack);
              } else if (
                typeof regData.techStack === "string" &&
                regData.techStack
              ) {
                try {
                  const parsed = JSON.parse(regData.techStack);
                  setTechStack(Array.isArray(parsed) ? parsed : null);
                } catch {
                  setTechStack(null);
                }
              }
            }

            // Add leader with complete details
            if (regData.leader) {
              allMembers.push({
                ...regData.leader,
                role: "leader",
                id: `leader_${doc.id}`,
                registrationId: doc.id,
              });
            }

            // Add teammates with complete details
            if (regData.teammates && regData.teammates.length > 0) {
              regData.teammates.forEach((teammate, index) => {
                allMembers.push({
                  ...teammate,
                  role: `teammate_${index + 1}`,
                  id: `teammate_${doc.id}_${index}`,
                  registrationId: doc.id,
                });
              });
            }
          });

          // Sort members: leader first, then teammates
          allMembers.sort((a, b) => {
            if (a.role === "leader") return -1;
            if (b.role === "leader") return 1;
            return a.role.localeCompare(b.role);
          });

          setTeamMembers(allMembers);

          // Now fetch problem statement using the team number we just retrieved
          // This is done AFTER getting registration data to avoid extra reads
          if (teamNum) {
            try {
              // Fetch document directly using team number as document ID
              const teamprobDocRef = doc(db, "teamprob", String(teamNum));
              const docSnap = await getDoc(teamprobDocRef);

              if (docSnap.exists()) {
                const problemData = docSnap.data();
                setTeamProblemData(problemData);
                // console.log("Problem statement already picked:", problemData);
              } else {
                // No document found - problem statement not picked yet
                setTeamProblemData(null);
                // console.log(
                //   "Problem statement not picked yet for team:",
                //   teamNum
                // );
              }
            } catch (error) {
              console.error(
                "Error fetching problem statement from teamprob:",
                error
              );
              setTeamProblemData(null);
            }
          } else {
            // No team number available
            setTeamProblemData(null);
          }
        } catch (error) {
          console.error(
            "Error fetching team members from registrations:",
            error
          );
        } finally {
          setLoadingTeamDetails(false);
          setLoadingProblemStatement(false);
        }
      }
    };

    fetchTeamData();
  }, [registrationData]);

  if (!registrationData) {
    return null;
  }

  // Use currentRegistrationData if available, otherwise fall back to registrationData
  const displayData = currentRegistrationData || registrationData;

  const { teamSize, leaderName, isNewTeam, existingRegistration } =
    registrationData;

  return (
    <div
      className="min-h-screen py-4 sm:py-8 px-3 sm:px-4 relative overflow-hidden"
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

      <div className="relative z-10 max-w-2xl mx-auto text-center py-18">
        {/* Success Card */}
        <div
          className="backdrop-blur-xl border-2 rounded-2xl p-4 sm:p-8 shadow-2xl relative"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.95)",
            borderColor: "#8A86FF",
            boxShadow:
              "0 0 40px rgba(138, 134, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Success Icon */}
          <div className="mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#10B981" }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
            }}
          >
            {existingRegistration
              ? "Already Registered!"
              : "Registration Successful!!!"}
          </h1>

          <p
            className="text-lg text-[#D0CCE3] mb-8"
            style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
          >
            {existingRegistration
              ? "You have already registered for CBIT Hacktoberfest 2025. Here are your registration details:"
              : "Thank you for registering for CBIT Hacktoberfest 2025!"}
          </p>

          {/* Registration Details */}
          <div className="space-y-6 mb-8">
            {/* Discord Channel - COMPULSORY */}
            <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-r from-[#5865F2]/20 to-[#5865F2]/10 border border-[#5865F2]/40 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <DiscordIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#5865F2] flex-shrink-0" />
                <h3
                  className="text-[#5865F2] font-bold text-base sm:text-lg"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  COMPULSORY: Join Discord Channel
                </h3>
              </div>

              <p
                className="text-white/90 mb-4 text-sm leading-relaxed"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                ALL team members must join our Discord channel for
                announcements, updates, and team coordination.
              </p>
              <div className="flex flex-col gap-3 justify-center">
                <button
                  onClick={() => window.open(discordChannelLink, "_blank")}
                  className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                  style={{
                    backgroundColor: "#5865F2",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    boxShadow: "0 4px 15px rgba(88, 101, 242, 0.3)",
                  }}
                >
                  <DiscordIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">Join Discord Channel</span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </button>

                <button
                  onClick={copyDiscordLink}
                  className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-[#5865F2] hover:bg-[#5865F2]/10 text-sm sm:text-base"
                  style={{
                    backgroundColor: "transparent",
                    color: "#5865F2",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  {copiedDiscord ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* WhatsApp Group - COMPULSORY */}
            <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-r from-[#25D366]/20 to-[#25D366]/10 border border-[#25D366]/40 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366] flex-shrink-0" />
                <h3
                  className="text-[#25D366] font-bold text-base sm:text-lg"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  COMPULSORY: Join WhatsApp Group
                </h3>
              </div>

              <p
                className="text-white/90 mb-4 text-sm leading-relaxed"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                ALL team members must join our WhatsApp group for important
                updates, announcements, and team coordination.
              </p>
              <div className="flex flex-col gap-3 justify-center">
                <button
                  onClick={() => window.open(whatsappGroupLink, "_blank")}
                  className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                  style={{
                    backgroundColor: "#25D366",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
                  }}
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">Join WhatsApp Group</span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </button>

                <button
                  onClick={copyWhatsAppLink}
                  className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-[#25D366] hover:bg-[#25D366]/10 text-sm sm:text-base"
                  style={{
                    backgroundColor: "transparent",
                    color: "#25D366",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  {copiedWhatsApp ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Team Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Team Number Display */}
              {(displayData.teamNumber || displayData.mergedIntoTeam) && (
                <div className="p-4 rounded-lg bg-[#403F7D]/50 border border-[#5E577C]">
                  <div className="flex items-center space-x-3 mb-2">
                    <IdCard className="w-5 h-5 text-[#C2C2FF]" />
                    <span
                      className="text-white font-semibold"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      {displayData.mergedIntoTeam
                        ? "Merged Team Number"
                        : "Team Number"}
                    </span>
                  </div>
                  <p
                    className="text-[#D0CCE3] font-mono text-lg"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    #{displayData.mergedIntoTeam || displayData.teamNumber}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg bg-[#403F7D]/50 border border-[#5E577C]">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-[#C2C2FF]" />
                  <span
                    className="text-white font-semibold"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    Team Leader
                  </span>
                </div>
                <p
                  className="text-[#D0CCE3]"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  {leaderName}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#403F7D]/50 border border-[#5E577C]">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-[#C2C2FF]" />
                  <span
                    className="text-white font-semibold"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    Team Size
                  </span>
                </div>
                <p
                  className="text-[#D0CCE3]"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  {teamSize === 1 ? "Solo Participant" : `${teamSize} Members`}
                </p>
              </div>
            </div>

            {/* Detailed Team Members Section */}
            {(teamMembers.length > 0 || loadingTeamDetails) && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-white font-bold text-xl flex items-center space-x-2"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Users className="w-6 h-6 text-[#8A86FF]" />
                    <span>Team Members Details</span>
                  </h3>
                  {loadingTeamDetails && (
                    <Loader className="w-5 h-5 text-[#8A86FF] animate-spin" />
                  )}
                </div>

                {loadingTeamDetails ? (
                  <div className="text-center py-4">
                    <Loader className="w-8 h-8 text-[#8A86FF] animate-spin mx-auto mb-2" />
                    <p className="text-[#C2C2FF]">Loading team details...</p>
                  </div>
                ) : teamMembers.length > 0 ? (
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div
                        key={member.id || index}
                        className={`p-4 sm:p-6 rounded-lg border ${
                          member.role === "leader"
                            ? "border-[#8A86FF] bg-[#8A86FF]/15"
                            : "border-[#5E577C] bg-[#403F7D]/30"
                        }`}
                      >
                        {/* Member Header */}
                        <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                          {member.role === "leader" ? (
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#8A86FF] flex-shrink-0" />
                          ) : (
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#C2C2FF] flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4
                              className="text-white font-semibold text-base sm:text-lg truncate"
                              style={{
                                fontFamily:
                                  "'Atkinson Hyperlegible', sans-serif",
                              }}
                            >
                              {member.name}
                            </h4>
                            <span
                              className={`text-xs sm:text-sm font-medium capitalize ${
                                member.role === "leader"
                                  ? "text-[#8A86FF]"
                                  : "text-[#C2C2FF]"
                              }`}
                              style={{
                                fontFamily:
                                  "'Atkinson Hyperlegible', sans-serif",
                              }}
                            >
                              {member.role === "leader"
                                ? "Team Leader"
                                : "Team Member"}
                            </span>
                          </div>
                        </div>

                        {/* Member Details - Mobile Optimized */}
                        <div className="space-y-3 text-sm">
                          {/* Email - Always show */}
                          <div className="flex items-start space-x-2">
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Mail className="w-4 h-4 text-[#C2C2FF]" />
                              <span className="text-[#C2C2FF] font-medium">
                                Email:
                              </span>
                            </div>
                            <span className="text-[#D0CCE3] break-words min-w-0">
                              {member.email}
                            </span>
                          </div>

                          {/* Phone Number */}
                          {member.phoneNumber && (
                            <div className="flex items-start space-x-2">
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <PhoneCall className="w-4 h-4 text-[#C2C2FF]" />
                                <span className="text-[#C2C2FF] font-medium">
                                  Phone:
                                </span>
                              </div>
                              <span className="text-[#D0CCE3] break-words min-w-0">
                                {member.phoneNumber}
                              </span>
                            </div>
                          )}

                          {/* Academic Info - Grouped together */}
                          {(member.college ||
                            member.branch ||
                            member.degree ||
                            member.yearOfStudy ||
                            member.rollNumber) && (
                            <div className="mt-4 pt-3 border-t border-[#5E577C]/30">
                              <h5 className="text-[#C2C2FF] font-medium mb-2 text-xs uppercase tracking-wide">
                                Academic Details
                              </h5>
                              <div className="space-y-2">
                                {member.college && (
                                  <div className="flex items-start space-x-2">
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                      <School className="w-4 h-4 text-[#C2C2FF]" />
                                      <span className="text-[#C2C2FF] font-medium">
                                        College:
                                      </span>
                                    </div>
                                    <span className="text-[#D0CCE3] break-words min-w-0">
                                      {member.college}
                                    </span>
                                  </div>
                                )}

                                {member.branch && (
                                  <div className="flex items-start space-x-2">
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                      <BookOpen className="w-4 h-4 text-[#C2C2FF]" />
                                      <span className="text-[#C2C2FF] font-medium">
                                        Branch:
                                      </span>
                                    </div>
                                    <span className="text-[#D0CCE3] break-words min-w-0">
                                      {member.branch}
                                    </span>
                                  </div>
                                )}

                                {member.degree && (
                                  <div className="flex items-start space-x-2">
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                      <GraduationCap className="w-4 h-4 text-[#C2C2FF]" />
                                      <span className="text-[#C2C2FF] font-medium">
                                        Degree:
                                      </span>
                                    </div>
                                    <span className="text-[#D0CCE3] break-words min-w-0">
                                      {member.degree}
                                    </span>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {member.yearOfStudy && (
                                    <div className="flex items-start space-x-2">
                                      <div className="flex items-center space-x-2 flex-shrink-0">
                                        <Calendar className="w-4 h-4 text-[#C2C2FF]" />
                                        <span className="text-[#C2C2FF] font-medium">
                                          Year:
                                        </span>
                                      </div>
                                      <span className="text-[#D0CCE3] break-words min-w-0">
                                        {member.yearOfStudy}
                                      </span>
                                    </div>
                                  )}

                                  {member.rollNumber && (
                                    <div className="flex items-start space-x-2">
                                      <div className="flex items-center space-x-2 flex-shrink-0">
                                        <IdCard className="w-4 h-4 text-[#C2C2FF]" />
                                        <span className="text-[#C2C2FF] font-medium">
                                          Roll No:
                                        </span>
                                      </div>
                                      <span className="text-[#D0CCE3] break-words min-w-0">
                                        {member.rollNumber}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[#C2C2FF]">
                      No detailed team information available.
                    </p>
                  </div>
                )}

                {/* Tech Stack Display - Only for small teams */}
                {techStack &&
                  Array.isArray(techStack) &&
                  techStack.length > 0 &&
                  teamSize < 3 && (
                    <div className="mt-6">
                      <h4
                        className="text-white font-semibold text-lg mb-3 flex items-center space-x-2"
                        style={{
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        <Code className="w-5 h-5 text-[#8A86FF]" />
                        <span>Tech Stack of All Your Teammates</span>
                      </h4>
                      <div className="p-4 rounded-lg bg-[#403F7D]/50 border border-[#5E577C]">
                        <div className="flex flex-wrap gap-2">
                          {techStack.map((tech, index) => {
                            const techLabels = {
                              frontend: "Frontend",
                              backend: "Backend",
                              nosql: "NoSQL DB",
                              sql: "SQL DB",
                              aiml: "AI/ML",
                              blockchain: "Blockchain",
                              iot: "IoT",
                            };

                            return (
                              <span
                                key={index}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                style={{
                                  backgroundColor: "#8A86FF",
                                  color: "#FFFFFF",
                                  fontFamily:
                                    "'Atkinson Hyperlegible', sans-serif",
                                }}
                              >
                                {techLabels[tech] || tech}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Edit Team Details Button */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() =>
                      navigate("/edit-team-details", {
                        state: {
                          registration: {
                            ...registrationData,
                            leaderEmail:
                              registrationData.leaderEmail ||
                              registrationData.leader?.email,
                          },
                        },
                      })
                    }
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] border-2 border-[#8A86FF] hover:bg-[#8A86FF]/10"
                    style={{
                      backgroundColor: "transparent",
                      color: "#8A86FF",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Team Details</span>
                  </button>
                </div>
              </div>
            )}

            {/* Merged Team Notice */}
            {displayData.mergedIntoTeam && (
              <div
                className="p-6 rounded-lg border-l-4 border-green-400 bg-green-400/10"
                style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
              >
                <h3
                  className="text-green-400 font-semibold mb-3 flex items-center space-x-2"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  <Users className="w-5 h-5" />
                  <span>Team Merged Successfully!</span>
                </h3>
                <p
                  className="text-green-100 text-sm mb-4"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  {teamSize === 1
                    ? "You have been successfully merged with other participants to form "
                    : "Your team has been successfully merged with other participants to form "}
                  <span className="font-bold text-green-300">
                    Team #{displayData.mergedIntoTeam}
                  </span>
                  . This collaboration will enhance your hackathon experience
                  and provide better learning opportunities.
                </p>
                <button
                  onClick={() => navigate("/team")}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm"
                  style={{
                    backgroundColor: "#22C55E",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(34, 197, 94, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(34, 197, 94, 0.3)";
                  }}
                >
                  <Users className="w-4 h-4" />
                  <span>View Team Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Special Message for Small Teams (only if NOT merged) */}
            {teamSize < 3 && !displayData.mergedIntoTeam && (
              <div
                className="p-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-400/10"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}
              >
                <h3
                  className="text-yellow-400 font-semibold mb-2"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  {teamSize === 1
                    ? "Solo Participant Notice"
                    : "Small Team Notice"}
                </h3>
                <p
                  className="text-yellow-100 text-sm"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  {teamSize === 1
                    ? "As a solo participant, you may be paired with other solo participants or small teams during the hackathon to enhance collaboration and learning opportunities."
                    : "Your small team may be merged with other small teams during the hackathon to create balanced groups and foster better collaboration."}
                </p>
              </div>
            )}

            {/* Existing Registration Notice */}
            {existingRegistration && (
              <div
                className="p-6 rounded-lg border-l-4 border-blue-400 bg-blue-400/10"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              >
                <h3
                  className="text-blue-400 font-semibold mb-2"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Registration Already Complete
                </h3>
                <p
                  className="text-blue-100 text-sm"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  You have already completed your registration for CBIT
                  Hacktoberfest 2025. If you need to make any changes to your
                  registration, please contact the organizers.
                </p>
              </div>
            )}
          </div>

          {/* Problem Statement Section */}
          {teamProblemData && teamProblemData.problemStatement ? (
            <div className="p-6 rounded-lg bg-gradient-to-br from-[#8A86FF]/20 to-[#C2C2FF]/10 border border-[#8A86FF]/40 backdrop-blur-sm mb-8">
              <h3
                className="text-white font-bold text-xl mb-4 flex items-center space-x-2"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                <BookOpen className="w-6 h-6 text-[#8A86FF]" />
                <span>Selected Problem Statement</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className="font-mono text-lg font-bold"
                        style={{ color: "#8A86FF" }}
                      >
                        #{teamProblemData.problemStatement.replace("prob", "")}
                      </span>
                    </div>
                    <h4
                      className="text-lg font-semibold text-white mb-3"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      Problem Statement Selected
                    </h4>
                  </div>
                </div>

                {teamProblemData.selectedAt && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#C2C2FF]" />
                    <span style={{ color: "#C2C2FF" }}>Selected on:</span>
                    <span style={{ color: "#D0CCE3" }}>
                      {new Date(teamProblemData.selectedAt).toLocaleString()}
                    </span>
                  </div>
                )}

                <div
                  className="p-3 rounded-lg border-l-4"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    borderColor: "#22C55E",
                  }}
                >
                  <p
                    className="text-sm"
                    style={{
                      color: "#86EFAC",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    ✓ Great choice! You're all set to work on this problem
                    statement. Check the detailed requirements and start
                    planning your solution!
                  </p>
                </div>
              </div>
            </div>
          ) : loadingProblemStatement ? (
            <div className="p-6 rounded-lg bg-gradient-to-br from-[#8A86FF]/20 to-[#C2C2FF]/10 border border-[#8A86FF]/40 backdrop-blur-sm mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Loader className="w-5 h-5 text-[#8A86FF] animate-spin" />
                <span className="text-white">Loading problem statement...</span>
              </div>
            </div>
          ) : (
            displayData && (
              <div className="p-6 rounded-lg bg-gradient-to-br from-[#FF6B6B]/20 to-[#FFE66D]/10 border border-[#FF6B6B]/40 backdrop-blur-sm mb-8">
                <h3
                  className="text-white font-bold text-xl mb-4 flex items-center space-x-2"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  <BookOpen className="w-6 h-6 text-[#FF6B6B]" />
                  <span>Problem Statement Not Selected</span>
                </h3>

                <div className="space-y-4">
                  <div
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                      borderColor: "#FF6B6B",
                    }}
                  >
                    <p
                      className="text-sm mb-3"
                      style={{
                        color: "#FFB3B3",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      ⚠️ Your team hasn't selected a problem statement yet. Team
                      leaders can browse and select from our exciting problem
                      statements to participate in the hackathon.
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: "#FF8A8A",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      Note: Only team leaders can select problem statements for
                      their teams.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate("/prob")}
                      className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #FF6B6B, #FFE66D)",
                        color: "#FFFFFF",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(255, 107, 107, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(255, 107, 107, 0.3)";
                      }}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Browse Problem Statements</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Next Steps */}
          <div className="p-6 rounded-lg bg-[#403F7D]/30 border border-[#5E577C] mb-8">
            <h3
              className="text-white font-semibold mb-4 flex items-center space-x-2"
              style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
            >
              <Calendar className="w-5 h-5 text-[#8A86FF]" />
              <span>What's Next?</span>
            </h3>
            <ul className="space-y-2 text-left">
              <li
                className="flex items-start space-x-2 text-[#D0CCE3]"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                <span className="text-[#8A86FF]">•</span>
                <span>
                  Check your email for confirmation and further instructions
                </span>
              </li>
              <li
                className="flex items-start space-x-2 text-[#D0CCE3]"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                <span className="text-[#8A86FF]">•</span>
                <span>Attend the Git/GitHub workshop on October 24th</span>
              </li>
              <li
                className="flex items-start space-x-2 text-[#D0CCE3]"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                <span className="text-[#8A86FF]">•</span>
                <span>Hackathon begins on October 25th at 4:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="p-4 rounded-lg bg-[#403F7D]/20 border border-[#5E577C]/50 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Mail className="w-4 h-4 text-[#C2C2FF]" />
              <span
                className="text-white font-semibold text-sm"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Need Help?
              </span>
            </div>
            <p
              className="text-[#D0CCE3] text-sm"
              style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
            >
              Contact the organizers for any questions or assistance
            </p>
          </div>
          {/* View Team Details Button */}
          {/* <div className="flex flex-col items-center space-y-4 mt-8">
            {/* View Team Details Button */}
          {/* <button
              onClick={() => navigate("/team")}
              className="w-full max-w-xs flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#8A86FF",
                color: "#FFFFFF",
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
                boxShadow: "0 0 25px rgba(138, 134, 255, 0.5)",
              }}
            >
              <Users className="w-5 h-5" />
              <span>View Team Details</span>
            </button> */}

          {/* Back to Home Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="w-full max-w-xs flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#8A86FF",
                color: "#FFFFFF",
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
                boxShadow: "0 0 25px rgba(138, 134, 255, 0.5)",
              }}
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
          {/* </div> */}
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationSuccess;
