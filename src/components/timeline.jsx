import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Shuffle from "./Shuffle";

// Material-UI Icons
import SchoolIcon from "@mui/icons-material/School";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import GitHubIcon from "@mui/icons-material/GitHub";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// --- Timeline Data ---

const timelineData = [
  {
    id: 1,
    date: "29th & 30th September 2025",
    title: "Preptember Workshop",
    description:
      "Preptember Workshop helps you gear up for the hackathon with idea-building, tool mastery, and teamwork skills.",
    buttonText: "Learn more",
    href: "/preptember",
    icon: SchoolIcon,
    color: "primary",
  },
  {
    id: 2,
    date: "14th October 2025",
    title: "Registration Opens",
    description:
      "The registrations for CBIT Hacktoberfest 2025 opens for all the students.",
    icon: HowToRegIcon,
    color: "success",
  },
  {
    id: 3,
    date: "23rd October 2025",
    title: "Registration Closes",
    description: "Registration period ends.",
    icon: EventBusyIcon,
    color: "warning",
  },
  {
    id: 4,
    date: "24th October 2025",
    title: "Git/GitHub Workshop",
    description:
      "An introduction to Git and GitHub, covering the fundamentals of version control and how teams collaborate on projects, as we gear up for the hackathon.",
    icon: GitHubIcon,
    color: "secondary",
  },
  {
    id: 5,
    date: "25th October 2025",
    title: "Hackathon Day 1 Begins!",
    description:
      "4:00 PM - Opening Ceremony\n5:30 PM - Releasing Problem Statements\n6:30 PM - Problem Statement Finalization\n7:00 PM - Coding Begins\n1:30 AM - Ice-Breaker Session 1",
    icon: RocketLaunchIcon,
    color: "primary",
  },
  {
    id: 6,
    date: "26th October 2025",
    title: "Day 2 & Closing",
    description:
      "8:00 AM - Ice Breaker Session 2\n1:30 PM - Submissions Open\n2:00 PM - Coding Ends\n2:30 PM - Submissions Close\n3:00 PM - Presentations\n6:30 PM - Closing Ceremony",
    icon: EmojiEventsIcon,
    color: "secondary",
  },
];

export default function TimelineComponent() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      id="Timeline"
      className="scroll-mt-20 min-h-screen relative py-20 px-4"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="heading text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <Shuffle
              text="Timeline"
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

        {/* Timeline Container */}
        <div className="relative">
          <Timeline
            position={isMobile ? "right" : "alternate"}
            sx={{
              padding: 0,
              paddingLeft: isMobile ? 0 : undefined,
              "& .MuiTimelineItem-root": {
                minHeight: isMobile ? "auto" : "200px",
                "&::before": isMobile
                  ? {
                      flex: 0,
                      padding: 0,
                    }
                  : undefined,
              },
              "& .MuiTimelineOppositeContent-root": {
                flex: isMobile ? 0 : 1,
                display: isMobile ? "none" : "flex",
                textAlign: "right",
              },
              "& .MuiTimelineContent-root": {
                flex: 1,
                paddingLeft: isMobile ? "12px" : undefined,
                paddingRight: isMobile ? "0" : undefined,
                paddingTop: isMobile ? "0" : undefined,
                paddingBottom: isMobile ? "24px" : undefined,
              },
              "& .MuiTimelineSeparator-root": {
                position: "relative",
                marginLeft: isMobile ? "0" : undefined,
                marginRight: isMobile ? "0" : undefined,
              },
              "& .MuiTimelineConnector-root": {
                backgroundColor: "#8A86FF",
                width: isMobile ? "2px" : "3px",
                flexGrow: 1,
              },
              "& .MuiTimelineDot-root": {
                boxShadow: "0 0 20px rgba(138, 134, 255, 0.5)",
                border: "3px solid #1C1C3F",
                margin: 0,
                padding: 0,
              },
            }}
          >
            {timelineData.map((item, index) => {
              const IconComponent = item.icon;
              const isFirst = index === 0;
              const isLast = index === timelineData.length - 1;

              return (
                <TimelineItem key={item.id}>
                  {!isMobile && (
                    <TimelineOppositeContent
                      sx={{
                        m: "auto 0",
                        paddingX: 2,
                        paddingY: 2,
                        display: "flex",
                        justifyContent:
                          index % 2 === 0 ? "flex-end" : "flex-start",
                        alignItems: "center",
                      }}
                      align={index % 2 === 0 ? "right" : "left"}
                      variant="body2"
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#C2C2FF",
                          fontWeight: "bold",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.85rem",
                            md: "0.9rem",
                          },
                          textShadow: "1px 1px 0px #493F70",
                          padding: { xs: "6px 10px", sm: "8px 12px" },
                          backgroundColor: "rgba(28, 28, 63, 0.8)",
                          borderRadius: "12px",
                          border: "1px solid #8A86FF",
                          backdropFilter: "blur(10px)",
                          display: "inline-block",
                        }}
                      >
                        {item.date}
                      </Typography>
                    </TimelineOppositeContent>
                  )}

                  <TimelineSeparator>
                    {isFirst ? (
                      <Box sx={{ flexGrow: 1, visibility: "hidden" }} />
                    ) : (
                      <TimelineConnector />
                    )}
                    <TimelineDot
                      sx={{
                        bgcolor: "#8A86FF",
                        color: "white",
                        width: isMobile ? 40 : { xs: 44, sm: 50, md: 56 },
                        height: isMobile ? 40 : { xs: 44, sm: 50, md: 56 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: isMobile ? 20 : { xs: 22, sm: 25, md: 28 },
                        }}
                      />
                    </TimelineDot>
                    {isLast ? (
                      <Box sx={{ flexGrow: 1, visibility: "hidden" }} />
                    ) : (
                      <TimelineConnector />
                    )}
                  </TimelineSeparator>

                  <TimelineContent
                    sx={{
                      paddingX: { xs: 0, sm: 2 },
                      paddingY: { xs: 0, sm: 2 },
                      paddingLeft: isMobile ? "12px !important" : undefined,
                      paddingRight: isMobile ? "0 !important" : undefined,
                      paddingTop: isMobile ? "0 !important" : undefined,
                      paddingBottom: isMobile ? "24px !important" : undefined,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(28, 28, 63, 0.95)",
                        border: "2px solid #6B5FA5",
                        borderRadius: "12px",
                        padding: isMobile ? "14px" : "24px",
                        boxShadow: "0 8px 32px rgba(138, 134, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        width: "100%",
                      }}
                    >
                      {isMobile && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#C2C2FF",
                            fontWeight: "bold",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            fontSize: "0.7rem",
                            textShadow: "1px 1px 0px #493F70",
                            padding: "4px 8px",
                            backgroundColor: "rgba(138, 134, 255, 0.2)",
                            borderRadius: "6px",
                            border: "1px solid #8A86FF",
                            display: "inline-block",
                            marginBottom: "10px",
                          }}
                        >
                          {item.date}
                        </Typography>
                      )}

                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          color: "#E8E6FF",
                          fontWeight: "bold",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          textShadow: "2px 2px 0px #493F70",
                          marginBottom: isMobile ? 1.5 : 2,
                          fontSize: isMobile
                            ? "1rem"
                            : { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "#D4D2FF",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          lineHeight: 1.5,
                          whiteSpace: "pre-line",
                          marginBottom: item.buttonText
                            ? isMobile
                              ? 2
                              : 3
                            : 0,
                          fontSize: isMobile
                            ? "0.8rem"
                            : { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                        }}
                      >
                        {item.description}
                      </Typography>

                      {item.buttonText && (
                        <button
                          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#A0A0FF] to-[#5A5AB5] rounded-full border-2 border-[#A0A0FF]/50 hover:from-[#C2C2FF] hover:to-[#A0A0FF] hover:shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-[1.05] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#A0A0FF]/50 sm:px-6 sm:py-3 sm:text-sm"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            boxShadow: "3px 3px 0px #12122A",
                          }}
                          onClick={() => {
                            item.href && navigate(item.href);
                          }}
                        >
                          {item.buttonText}
                          <span className="ml-2 font-bold transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </button>
                      )}
                    </div>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </div>
      </div>
    </div>
  );
}
