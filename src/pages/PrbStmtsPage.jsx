import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Check,
  BookOpen,
  Calendar,
  IdCard,
  Users,
} from "lucide-react";
import { db, auth } from "../firebase";
import {
  collection,
  doc,
  runTransaction,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTeamAuth } from "../hooks/useTeamAuth";
import { initializeProblemStatement } from "../services/authService";
import { StarsBackground } from "../components/ui/stars-background";
import "../styles/hacktober-fest-colors.css";
import localProblemStatements from "../data/problemStatements";

// Domain taxonomy
const DOMAINS = [
  { id: "Mobile App Development", label: "Mobile App Development" },
  { id: "web3", label: "Web3" },
  { id: "AI", label: "AI" },
  { id: "Web Development", label: "Web Development" },
];

// Maximum number of slots to display in UI
const MAX_DISPLAY_SLOTS = 8;

const PrbStmtsPage = () => {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    isLoggedIn,
    teamNumber,
    isTeamLeader,
    hasSelectedProblem,
    authCheckComplete,
    error: authError,
    authAction,
    registrationData,
    refreshTeamStatus,
  } = useTeamAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problemStatements, setProblemStatements] = useState([]);
  const [problemDocsMap, setProblemDocsMap] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showOnlyBeginner, setShowOnlyBeginner] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);
  const [teamProblemData, setTeamProblemData] = useState(null);
  const [loadingTeamProblem, setLoadingTeamProblem] = useState(false);
  const [selectingProblem, setSelectingProblem] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(12); // Show 12 problems per page

  // Helper function to refresh team problem data
  const refreshTeamProblemData = async () => {
    if (teamNumber) {
      setLoadingTeamProblem(true);
      try {
        const teamprobDocRef = doc(db, "teamprob", String(teamNumber));
        const docSnap = await getDoc(teamprobDocRef);

        if (docSnap.exists()) {
          const problemData = docSnap.data();
          setTeamProblemData(problemData);
          // console.log("Team problem data refreshed:", problemData);
        } else {
          setTeamProblemData(null);
        }
      } catch (error) {
        console.error("Error refreshing team problem data:", error);
        setTeamProblemData(null);
      } finally {
        setLoadingTeamProblem(false);
      }
    }
  };

  // Fetch selected problem statement from teamprob collection
  useEffect(() => {
    refreshTeamProblemData();
  }, [teamNumber, hasSelectedProblem]); // Added hasSelectedProblem as dependency

  // Handle authentication redirects
  useEffect(() => {
    if (authCheckComplete) {
      if (!isLoggedIn) {
        // Redirect to signin if user is not logged in
        navigate("/signin");
        return;
      }
      
      // User is logged in, handle other auth states
      if (authAction === "redirect_registration") {
        // Don't redirect to registration since it's closed - just log
        // console.log("Registration is closed, but user can still access problem statements");
      } else if (authAction === "unauthorized") {
        // User is not authorized - redirect to signin
        navigate("/signin");
        return;
      }
      // If authAction === 'proceed', user can access the page normally
    }
  }, [authCheckComplete, isLoggedIn, authAction, navigate, authError]);

  useEffect(() => {
    // Only set up the batch listener if user hasn't selected a problem
    if (hasSelectedProblem) {
      // User has already selected, no need for live updates
      setLoading(false);
      return;
    }

    let problemUnsub = null;

    const initializeData = async () => {
      try {
        // Initialize with local problem statements first
        setProblemStatements(
          localProblemStatements.map((prob) => ({
            ...prob,
            count: 0, // Will be updated from Firestore
            limit: prob.maxSlots || 3, // Default limit
          }))
        );

        // Initialize problem statements in Firestore if they don't exist
        await Promise.all(
          localProblemStatements.map((problem) =>
            initializeProblemStatement(problem.id, problem)
          )
        );

        // Single batch listener for all problem statements - more cost-effective
        const colRef = collection(db, "problemStatements");
        problemUnsub = onSnapshot(
          colRef,
          (querySnapshot) => {
            try {
              // Process all problem updates in one batch
              const updatedProblemsMap = {};
              
              querySnapshot.docs.forEach((doc) => {
                const data = doc.data();
                updatedProblemsMap[doc.id] = {
                  problemNumber: data.problemNumber || 0,
                  limit: data.limit || 3,
                  teamsChosen: data.teamsChosen || 0,
                  lastUpdated: data.lastUpdated,
                  title: data.title,
                  level: data.level,
                };
              });

              // Update the problemDocsMap for reference
              setProblemDocsMap(updatedProblemsMap);

              // Merge all Firestore data with local problem statements in one operation
              setProblemStatements((prevProblems) =>
                prevProblems.map((localProblem) => {
                  const firestoreData = updatedProblemsMap[localProblem.id];
                  
                  if (firestoreData) {
                    return {
                      ...localProblem,
                      count: firestoreData.teamsChosen,
                      maxSlots: firestoreData.limit,
                      problemNumber: firestoreData.problemNumber || localProblem.number,
                      // Preserve local data but update with Firestore counts
                    };
                  }
                  
                  // Return local problem with default values if not in Firestore yet
                  return {
                    ...localProblem,
                    count: 0,
                    maxSlots: localProblem.maxSlots || 3,
                  };
                })
              );

              // console.log(`Updated ${Object.keys(updatedProblemsMap).length} problem statements in batch`);
            } catch (error) {
              console.error("Error processing problem statements update:", error);
              toast.error("Error updating problem statements");
            }
          },
          (error) => {
            console.error("Problem statements listener error:", error);
            toast.error("Failed to listen for problem updates. Please refresh the page.");
          }
        );

        setLoading(false);
      } catch (error) {
        console.error("Error in initialization:", error);
        toast.error("An error occurred while loading data");
        setLoading(false);
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      if (problemUnsub) {
        problemUnsub();
        // console.log("Problem statements listener cleaned up");
      }
    };
  }, [hasSelectedProblem]); // Add hasSelectedProblem as dependency

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Update debug info when auth state changes
  useEffect(() => {
    if (authCheckComplete && isLoggedIn) {
      setDebugInfo({
        userEmail: user?.email,
        teamNumber,
        isTeamLeader,
        hasSelectedProblem,
        authError,
      });
    }
  }, [
    user,
    teamNumber,
    isTeamLeader,
    hasSelectedProblem,
    authError,
    authCheckComplete,
    isLoggedIn,
  ]);

  const toggleDescription = (problemId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const openModal = (problem) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProblem(null);
    setIsModalOpen(false);
  };

  const selectProblemStatement = async (problem) => {
    // Prevent double clicks and multiple simultaneous selections
    if (selectingProblem) {
      // console.log("Selection already in progress, ignoring click");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/signin");
      return;
    }

    if (hasSelectedProblem) {
      toast.error("You have already selected a problem statement");
      return;
    }

    if (!teamNumber) {
      toast.error("No team number found. Please contact administrators.");
      return;
    }

    setSelectingProblem(true);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading("Selecting problem statement...");

      // Use a transaction to ensure concurrency-safe selection
      await runTransaction(db, async (transaction) => {
        // Check if team has already selected a problem (teamprob collection)
        const teamProbRef = doc(db, "teamprob", teamNumber.toString());
        const teamProbSnap = await transaction.get(teamProbRef);

        if (teamProbSnap.exists() && teamProbSnap.data().problemStatement) {
          throw new Error("TEAM_ALREADY_SELECTED");
        }

        // Get or create the problem statement document
        const problemRef = doc(db, "problemStatements", problem.id);
        const problemSnap = await transaction.get(problemRef);

        let currentTeamsChosen = 0;
        let limit = problem.maxSlots || 3;

        if (problemSnap.exists()) {
          const problemData = problemSnap.data();
          currentTeamsChosen = problemData.teamsChosen || 0;
          limit = problemData.limit || limit;
        }

        // Check if problem statement has reached its limit
        if (currentTeamsChosen >= limit) {
          throw new Error("SLOTS_FULL");
        }

        // Update problem statement document (increment teamsChosen)
        transaction.set(
          problemRef,
          {
            problemNumber: problem.number,
            limit: limit,
            teamsChosen: currentTeamsChosen + 1,
            lastUpdated: new Date(),
            title: problem.title,
            level: problem.level,
          },
          { merge: true }
        );

        // Create team-problem mapping (teamprob collection)
        transaction.set(teamProbRef, {
          teamNumber: teamNumber,
          problemStatement: problem.id,
          problemNumber: problem.number,
          problemTitle: problem.title,
          problemLevel: problem.level,
          selectedAt: new Date(),
          selectedBy: auth.currentUser.email,
        });
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // If transaction succeeds
      toast.success("Problem statement selected successfully!");
      
      // Refresh the team status to update UI
      await refreshTeamStatus();
      
      // Refresh team problem data to ensure UI updates immediately
      await refreshTeamProblemData();
      
      // Close modal
      closeModal();
      
    } catch (error) {
      console.error("Error in selectProblemStatement:", error);
      
      if (error.message === "TEAM_ALREADY_SELECTED") {
        toast.error("Your team has already selected a problem statement");
        // Refresh to get latest status
        await refreshTeamStatus();
        await refreshTeamProblemData();
      } else if (error.message === "SLOTS_FULL") {
        toast.error("Sorry, this problem statement has reached maximum capacity");
      } else {
        console.error("Unexpected error selecting problem statement:", error);
        toast.error("Failed to select problem statement. Please try again.");
      }
    } finally {
      setSelectingProblem(false);
    }
  };

  const filteredProblems = problemStatements.filter((problem) => {
    const levelOk = !showOnlyBeginner || problem.level === "beginner";
    const domainOk =
      !selectedDomain ||
      (Array.isArray(problem.domains) &&
        problem.domains.includes(selectedDomain));
    return levelOk && domainOk;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const startIndex = (currentPage - 1) * problemsPerPage;
  const endIndex = startIndex + problemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  const selectDomain = (id) => {
    setSelectedDomain(selectedDomain === id ? "" : id);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const clearDomain = () => {
    setSelectedDomain("");
    setCurrentPage(1); // Reset to first page when clearing filter
  };

  const toggleBeginnerFilter = () => {
    setShowOnlyBeginner(!showOnlyBeginner);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const getDomainStyle = (domainId) => {
    // Return same color scheme for all domains
    return {
      bg: "rgba(138, 134, 255, 0.18)",
      bgActive: "rgba(138, 134, 255, 0.35)",
      color: "var(--space-white)",
      borderColor: "#8A86FF",
      glow: "0 0 16px rgba(138, 134, 255, 0.45)",
    };
  };

  const labelForDomain = (id) => DOMAINS.find((d) => d.id === id)?.label || id;

  // Function to truncate description
  const truncateDescription = (text, maxLength = 300) => {
    if (text.length <= maxLength) return text;
    
    // Find the last space before maxLength to avoid cutting words
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return {
          backgroundColor: "rgba(194, 194, 255, 0.1)",
          color: "var(--melrose)",
          borderColor: "var(--melrose)",
        };
      case "intermediate":
        return {
          backgroundColor: "rgba(160, 160, 255, 0.1)",
          color: "var(--lavender)",
          borderColor: "var(--lavender)",
        };
      case "advanced":
        return {
          backgroundColor: "rgba(90, 90, 181, 0.1)",
          color: "var(--blue-violet)",
          borderColor: "var(--blue-violet)",
        };
      default:
        return {
          backgroundColor: "rgba(208, 204, 227, 0.1)",
          color: "var(--space-dust)",
          borderColor: "var(--space-dust)",
        };
    }
  };

  if (loading || authLoading || !authCheckComplete) {
    return (
      <section
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
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

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-2"
            style={{ borderColor: "#8A86FF" }}
          ></div>
          <p
            className="mt-4"
            style={{
              color: "#FFFFFF",
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              fontSize: "1.125rem",
            }}
          >
            Loading problem statements...
          </p>
        </div>
      </section>
    );
  }

  return (
    <div
      className="text-space-white min-h-screen relative overflow-hidden"
      style={{
        paddingTop: "5rem",
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

      <Toaster position="top-right" />

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
          {/* Status Notice */}
          {/* <div
            className="mb-6 p-4 rounded-xl border-2 backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(138, 134, 255, 0.15)",
              borderColor: "#8A86FF",
              boxShadow: "0 0 20px rgba(138, 134, 255, 0.2)",
            }}
          >
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6" style={{ color: "#22C55E" }} />
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  Problem Selection Open
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: "#C2C2FF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  Registration and team editing are closed, but you can still select problem statements for your team.
                </p>
              </div>
            </div>
          </div> */}

          <div className="flex items-end justify-between">
            <div>
              <h1
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{
                  color: "var(--space-white)",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
                }}
              >
                Problem Statements
              </h1>
              <p
                className="mt-2 text-sm md:text-base"
                style={{
                  color: "#D0CCE3",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                }}
              >
                Select your team's challenge from the available problem statements.
              </p>
            </div>
            <div
              className="hidden md:block text-sm"
              style={{
                color: "#D0CCE3",
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
              }}
            >
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProblems.length)} of {filteredProblems.length} problems
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-8">
            {/* Team Number and Selected Problem Statement Section */}
            {teamNumber && (
              <div className="space-y-4">
                {/* Team Number Display */}
                <div
                  className="p-4 rounded-xl border-2 flex items-center justify-between backdrop-blur-xl shadow-xl"
                  style={{
                    backgroundColor: "rgba(28, 28, 63, 0.8)",
                    borderColor: "#8A86FF",
                    boxShadow: "0 0 20px rgba(138, 134, 255, 0.3)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <IdCard className="w-5 h-5" style={{ color: "#8A86FF" }} />
                    <div>
                      <span
                        className="text-sm"
                        style={{
                          color: "#C2C2FF",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        Your Team Number
                      </span>
                      <p
                        className="text-xl font-bold font-mono"
                        style={{
                          color: "#FFFFFF",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        #{teamNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Problem Statement Display */}
                {loadingTeamProblem ? (
                  <div
                    className="p-6 rounded-xl border-2 flex items-center justify-center backdrop-blur-xl"
                    style={{
                      backgroundColor: "rgba(28, 28, 63, 0.8)",
                      borderColor: "#5E577C",
                    }}
                  >
                    <div
                      className="animate-spin rounded-full h-6 w-6 border-b-2 mr-3"
                      style={{ borderColor: "#8A86FF" }}
                    ></div>
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      Loading your selected problem statement...
                    </span>
                  </div>
                ) : teamProblemData && teamProblemData.problemStatement ? (
                  <div
                    className="p-6 rounded-xl border-2 backdrop-blur-xl shadow-xl"
                    style={{
                      backgroundColor: "rgba(28, 28, 63, 0.8)",
                      borderColor: "#22C55E",
                      boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <BookOpen
                          className="w-6 h-6"
                          style={{ color: "#22C55E" }}
                        />
                        <h3
                          className="text-xl font-bold"
                          style={{
                            color: "#FFFFFF",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          Your Selected Problem Statement
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span
                          className="font-mono text-2xl font-bold"
                          style={{ color: "#22C55E" }}
                        >
                          #
                          {teamProblemData.problemStatement.replace("prob", "")}
                        </span>
                        <div
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                            color: "#86EFAC",
                          }}
                        >
                          ✓ Selected
                        </div>
                      </div>

                      {teamProblemData.problemTitle && (
                        <div className="mt-2">
                          <h4
                            className="text-lg font-semibold"
                            style={{
                              color: "var(--space-white)",
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            }}
                          >
                            {teamProblemData.problemTitle}
                          </h4>
                        </div>
                      )}

                      <div
                        className="mt-4 p-4 rounded-lg"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.15)",
                        }}
                      >
                        <p
                          className="text-sm"
                          style={{
                            color: "#86EFAC",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          You have confirmed your team's problem statement. All the best!
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-6 rounded-xl border-2 backdrop-blur-xl shadow-xl"
                    style={{
                      backgroundColor: "rgba(28, 28, 63, 0.8)",
                      borderColor: "#FFC107",
                      boxShadow: "0 0 20px rgba(255, 193, 7, 0.2)",
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <BookOpen
                        className="w-6 h-6 flex-shrink-0"
                        style={{ color: "#FFC107" }}
                      />
                      <div>
                        <h3
                          className="text-lg font-bold mb-2"
                          style={{
                            color: "#FFFFFF",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          No Problem Statement Selected Yet
                        </h3>
                        <p
                          className="text-sm mb-3"
                          style={{
                            color: "#FFE082",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          Browse the problem statements below and select one for
                          your team to work on.
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: "#FFD54F",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          💡 Tip: Choose a problem that aligns with your team's
                          skills and interests!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Only show problem statements section if user hasn't selected one yet */}
            {!hasSelectedProblem && (
              <>
                {/* Filter Controls */}
                <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <label
                  htmlFor="beginnerFilter"
                  className="inline-flex items-center gap-2 cursor-pointer group select-none"
                >
                  <input
                    type="checkbox"
                    id="beginnerFilter"
                    checked={showOnlyBeginner}
                    onChange={toggleBeginnerFilter}
                    className="peer sr-only"
                  />
                  <span
                    className={`relative grid place-items-center w-5 h-5 rounded-[4px] border transition-all duration-200 shadow-inner ${
                      showOnlyBeginner ? "scale-105" : ""
                    }`}
                    style={{
                      background: showOnlyBeginner
                        ? "linear-gradient(135deg, var(--melrose), var(--lavender))"
                        : "var(--void)",
                      borderColor: showOnlyBeginner
                        ? "var(--melrose)"
                        : "var(--space-haze)",
                      boxShadow: showOnlyBeginner
                        ? "0 0 12px rgba(194,194,255,0.35)"
                        : "inset 0 1px 2px rgba(0,0,0,0.25)",
                    }}
                  >
                    <Check
                      className={`w-3.5 h-3.5 text-white transition-all duration-200 ${
                        showOnlyBeginner
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75"
                      }`}
                    />
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: "#D0CCE3",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    Show only Beginner level problems
                  </span>
                </label>
                {selectedDomain && (
                  <button
                    onClick={clearDomain}
                    className="ml-2 text-xs px-3 py-1.5 border rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    style={{
                      color: "#D0CCE3",
                      borderColor: "#5E577C",
                      backgroundColor: "rgba(28, 28, 63, 0.5)",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    title="Clear domain filter"
                  >
                    Clear domain
                  </button>
                )}
              </div>

              {/* Domain filter chips */}
              <div>
                <div
                  className="text-xs uppercase tracking-wide mb-3 font-semibold"
                  style={{
                    color: "#C2C2FF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  Filter by Domain
                </div>
                <div className="flex flex-wrap gap-3">
                  {DOMAINS.map((d) => {
                    const active = selectedDomain === d.id;
                    const baseStyle = getDomainStyle(d.id);
                    return (
                      <motion.button
                        key={d.id}
                        onClick={() => selectDomain(d.id)}
                        className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-300 ease-out flex items-center gap-2 backdrop-blur-sm ${
                          active
                            ? "opacity-100 shadow-lg"
                            : "opacity-80 hover:opacity-100 hover:shadow-md"
                        }`}
                        style={{
                          backgroundColor: active
                            ? baseStyle.bgActive
                            : baseStyle.bg,
                          color: baseStyle.color,
                          borderColor: baseStyle.borderColor,
                          boxShadow: active
                            ? `${baseStyle.glow}, 0 0 0 1px rgba(255,255,255,0.1) inset`
                            : "0 2px 8px rgba(0,0,0,0.15)",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{ 
                          scale: active ? 1.02 : 1,
                          y: active ? -2 : 0
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                        aria-pressed={active}
                      >
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                        <span className="font-semibold">{d.label}</span>
                        {active && (
                          <motion.div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: baseStyle.color,
                              boxShadow: `0 0 6px ${baseStyle.color}`
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {isLoggedIn && hasSelectedProblem && (
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "rgba(194, 194, 255, 0.1)",
                  borderColor: "var(--melrose)",
                }}
              >
                <p style={{ color: "var(--melrose)" }}>
                  ✓ You have successfully selected a problem statement for your team. All the best for the hackathon!
                </p>
              </div>
            )}

            {!isLoggedIn && (
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "rgba(90, 90, 181, 0.1)",
                  borderColor: "var(--blue-violet)",
                }}
              >
                <p style={{ color: "var(--blue-violet)" }}>
                  ⓘ Log in to select a problem statement for your team.
                </p>
              </div>
            )}

            {/* Problem Statements Grid */}
            <div className="grid gap-6">
              {currentProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="backdrop-blur-xl border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-2xl"
                  style={{
                    backgroundColor: "rgba(28, 28, 63, 0.8)",
                    borderColor: "#5E577C",
                    boxShadow: "0 0 30px rgba(138, 134, 255, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#8A86FF";
                    e.currentTarget.style.boxShadow =
                      "0 0 40px rgba(138, 134, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#5E577C";
                    e.currentTarget.style.boxShadow =
                      "0 0 30px rgba(138, 134, 255, 0.2)";
                  }}
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span
                            className="font-mono text-xl font-bold"
                            style={{
                              color: "#8A86FF",
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            }}
                          >
                            #{problem.number.toString().padStart(2, "0")}
                          </span>
                          <div
                            className="px-3 py-1 text-sm rounded-full border"
                            style={getLevelColor(problem.level)}
                          >
                            {problem.level.charAt(0).toUpperCase() +
                              problem.level.slice(1)}
                          </div>
                        </div>
                        <h3
                          className="text-2xl font-bold mb-2"
                          style={{
                            color: "#FFFFFF",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            textShadow: "0 0 20px rgba(194, 194, 255, 0.3)",
                          }}
                        >
                          {problem.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-sm font-medium"
                          style={{
                            color: "#C2C2FF",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          Teams Selected
                        </div>
                        <div
                          className="text-2xl font-bold"
                          style={{
                            color:
                              problem.count >= problem.maxSlots
                                ? "#FF6B6B"
                                : "#8A86FF",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          {Math.min(problem.count, MAX_DISPLAY_SLOTS)}/{Math.min(problem.maxSlots, MAX_DISPLAY_SLOTS)}
                        </div>
                        {problem.count >= MAX_DISPLAY_SLOTS && (
                          <div
                            className="text-xs font-medium px-2 py-1 rounded-full border mt-1"
                            style={{
                              backgroundColor: "rgba(255, 107, 107, 0.2)",
                              borderColor: "#FF6B6B",
                              color: "#FF6B6B",
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            }}
                          >
                            FULL
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <p
                        className="leading-relaxed"
                        style={{
                          color: "#D0CCE3",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        {expandedDescriptions[problem.id] 
                          ? problem.description 
                          : truncateDescription(problem.description, 300)
                        }
                      </p>
                      
                      {problem.description.length > 300 && (
                        <button
                          onClick={() => toggleDescription(problem.id)}
                          className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                          style={{
                            color: "#8A86FF",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          {expandedDescriptions[problem.id] ? (
                            <>
                              Read Less
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Read More
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Debug panel: visible when URL has ?debug */}
                    {new URLSearchParams(window.location.search).has("debug") &&
                      debugInfo && (
                        <div className="fixed bottom-4 right-4 bg-white/90 text-sm text-slate-900 p-3 rounded-md shadow-lg max-w-xs z-50">
                          <div className="font-semibold">Debug Info</div>
                          <div className="mt-2">
                            <pre
                              style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                maxHeight: 300,
                                overflow: "auto",
                              }}
                            >
                              {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    {/* Action Button */}
                    {isLoggedIn &&
                      !hasSelectedProblem &&
                      !authError &&
                      teamNumber && (
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={() => openModal(problem)}
                            disabled={
                              (problem.maxSlots &&
                                problem.count >= problem.maxSlots) ||
                              selectingProblem
                            }
                            className="px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            style={{
                              backgroundColor: "#8A86FF",
                              color: "#FFFFFF",
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                              boxShadow: "0 0 20px rgba(138, 134, 255, 0.4)",
                            }}
                          >
                            {problem.maxSlots &&
                            problem.count >= problem.maxSlots
                              ? "Full"
                              : selectingProblem
                              ? "Selecting..."
                              : "Select This Problem"}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredProblems.length > problemsPerPage && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentPage === 1 ? "rgba(28, 28, 63, 0.5)" : "#8A86FF",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    boxShadow: currentPage !== 1 ? "0 0 15px rgba(138, 134, 255, 0.3)" : "none",
                  }}
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === page ? 'scale-110' : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: currentPage === page ? "#8A86FF" : "rgba(28, 28, 63, 0.8)",
                        color: "#FFFFFF",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        boxShadow: currentPage === page ? "0 0 15px rgba(138, 134, 255, 0.4)" : "none",
                        border: currentPage === page ? "2px solid #8A86FF" : "2px solid transparent",
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentPage === totalPages ? "rgba(28, 28, 63, 0.5)" : "#8A86FF",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    boxShadow: currentPage !== totalPages ? "0 0 15px rgba(138, 134, 255, 0.3)" : "none",
                  }}
                >
                  Next
                </button>
              </div>
            )}

            {filteredProblems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: "var(--space-haze)" }}>
                  No problem statements match your current filter.
                </p>
              </div>
            )}
              </>
            )}
          </div>
        </div>

        {/* Selection Confirmation Modal */}
        {isModalOpen && selectedProblem && (() => {
          // Get the current live problem data from the state
          const currentProblemData = problemStatements.find(p => p.id === selectedProblem.id) || selectedProblem;
          
          // Debug logging to understand the values
          // console.log("Modal Debug:", {
          //   selectedProblemId: selectedProblem.id,
          //   currentProblemData: currentProblemData,
          //   count: currentProblemData.count,
          //   maxSlots: currentProblemData.maxSlots,
          //   isAtCapacity: currentProblemData.count >= currentProblemData.maxSlots,
          //   MAX_DISPLAY_SLOTS: MAX_DISPLAY_SLOTS
          // });
          
          return (
          <div
            className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            onClick={closeModal}
          >
            <div className="min-h-full flex items-center justify-center px-4 py-8">
              <div
                className="w-full max-w-2xl rounded-2xl p-8 space-y-6 backdrop-blur-xl border-2 shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{
                  backgroundColor: "rgba(28, 28, 63, 0.95)",
                  borderColor: "#8A86FF",
                  boxShadow:
                    "0 0 40px rgba(138, 134, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center">
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
                    }}
                  >
                    Confirm Problem Statement Selection
                  </h2>
                  <span
                    className="font-mono text-xl"
                    style={{
                      color: "#8A86FF",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    #{selectedProblem.number.toString().padStart(2, "0")}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3
                    className="text-xl font-semibold"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    {selectedProblem.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div
                      className="inline-block px-3 py-1 text-sm rounded-full border"
                      style={getLevelColor(selectedProblem.level)}
                    >
                      {selectedProblem.level.charAt(0).toUpperCase() +
                        selectedProblem.level.slice(1)}{" "}
                      Level
                    </div>
                    <div className="text-right">
                      <div
                        className="text-sm"
                        style={{
                          color: "#C2C2FF",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        Teams Selected:
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{
                          color:
                            currentProblemData.count >= MAX_DISPLAY_SLOTS
                              ? "#FF6B6B"
                              : "#8A86FF",
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        {Math.min(currentProblemData.count, MAX_DISPLAY_SLOTS)}/{Math.min(currentProblemData.maxSlots, MAX_DISPLAY_SLOTS)}
                        {currentProblemData.count >= MAX_DISPLAY_SLOTS && (
                            <span
                              className="ml-2 text-xs px-2 py-1 rounded-full border"
                              style={{
                                backgroundColor: "rgba(255, 90, 90, 0.1)",
                                borderColor: "var(--red)",
                                color: "var(--red)",
                              }}
                            >
                              FULL
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4
                      className="font-medium mb-2"
                      style={{ color: "var(--melrose)" }}
                    >
                      Description:
                    </h4>
                    <p style={{ color: "var(--space-dust)" }}>
                      {selectedProblem.description}
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: "rgba(160, 160, 255, 0.1)",
                      borderColor: "var(--lavender)",
                    }}
                  >
                    <p className="text-sm" style={{ color: "var(--lavender)" }}>
                      ⚠️ Once selected, you cannot change your team's problem
                      statement. Make sure this is the problem you want to work
                      on.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 hover:bg-white/5 cursor-pointer"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "#5E577C",
                        color: "#D0CCE3",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => selectProblemStatement(selectedProblem)}
                      disabled={
                        currentProblemData.count >= MAX_DISPLAY_SLOTS ||
                        hasSelectedProblem ||
                        selectingProblem
                      }
                      className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                        currentProblemData.count >= MAX_DISPLAY_SLOTS ||
                        hasSelectedProblem ||
                        selectingProblem
                          ? ""
                          : "hover:scale-[1.02]"
                      }`}
                      style={{
                        backgroundColor:
                          currentProblemData.count >= MAX_DISPLAY_SLOTS ||
                          hasSelectedProblem ||
                          selectingProblem
                            ? "#5E577C"
                            : "#8A86FF",
                        color: "#FFFFFF",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        boxShadow:
                          currentProblemData.count >= MAX_DISPLAY_SLOTS ||
                          hasSelectedProblem ||
                          selectingProblem
                            ? "none"
                            : "0 0 20px rgba(138, 134, 255, 0.4)",
                      }}
                    >
                      {selectingProblem
                        ? "Selecting..."
                        : hasSelectedProblem
                        ? "Already Selected"
                        : currentProblemData.count >= MAX_DISPLAY_SLOTS
                        ? "Problem Full"
                        : "Confirm Selection"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })()}
      </div>
    </div>
  );
};

export default PrbStmtsPage;
