import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase";
import {
  saveRegistration,
  checkUserRegistration,
} from "../services/registrationService";
import { validateEmailFormat } from "../services/emailValidationService";
import AddTeamDetails from "./AddTeamDetails";
import { StarsBackground } from "../components/ui/stars-background";
import {
  User,
  GraduationCap,
  Calendar,
  Book,
  Hash,
  Mail,
  Phone,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader,
  Info,
  UserPlus,
} from "lucide-react";

const Register = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    collegeType: "", // "CBIT" or "Other"
    customCollege: "", // For when "Other" is selected
    degreeType: "",
    customDegree: "",
    degree: "",
    yearOfStudy: "",
    branch: "",
    branchType: "", // "Listed" or "Other"
    customBranch: "",
    rollNumber: "",
    email: "",
    phoneNumber: "",
    teamSize: null,
  });

  // Check if user is already registered
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (user && user.uid) {
        try {
          setIsCheckingRegistration(true);
          const registrationCheck = await checkUserRegistration(user.uid);

          if (registrationCheck.isRegistered) {
            // User is already registered, redirect to success page
            navigate("/registration-success", {
              state: {
                teamSize: registrationCheck.registration.teamSize,
                leaderName: registrationCheck.registration.leaderName,
                leaderEmail:
                  registrationCheck.registration.leaderEmail ||
                  registrationCheck.registration.leader?.email,
                isNewTeam: false, // This is an existing registration
                existingRegistration: true,
              },
            });
          }
        } catch (error) {
          console.error("Error checking registration:", error);
          // Continue to registration form if there's an error
        } finally {
          setIsCheckingRegistration(false);
        }
      } else if (!loading) {
        setIsCheckingRegistration(false);
      }
    };

    if (!loading) {
      checkExistingRegistration();
    }
  }, [user, loading, navigate]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  // Set email from Google account when user is loaded
  useEffect(() => {
    if (user && user.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        name: user.displayName || "",
      }));
    }
  }, [user]);

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60;
    const colors = ["#8A86FF", "#C2C2FF", "#A0A0FF", "#5A5AB5"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.phase += p.pulse;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const pulsedRadius = p.radius + Math.sin(p.phase) * 0.5;
        const pulsedOpacity = p.opacity + Math.sin(p.phase) * 0.2;

        ctx.save();
        ctx.globalAlpha = pulsedOpacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedRadius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for college type selection
    if (name === "collegeType") {
      setFormData((prev) => ({
        ...prev,
        collegeType: value,
        college:
          value === "CBIT" ? "Chaitanya Bharathi Institute of Technology" : "",
        customCollege: value === "CBIT" ? "" : prev.customCollege,
      }));

      // Clear field errors for college-related fields
      if (fieldErrors.college) {
        setFieldErrors((prev) => ({
          ...prev,
          college: null,
        }));
      }
      return;
    }

    // Handle custom college input
    if (name === "customCollege") {
      setFormData((prev) => ({
        ...prev,
        customCollege: value,
        college: value.trim(),
      }));

      // Clear field error when user starts typing
      if (fieldErrors.college) {
        setFieldErrors((prev) => ({
          ...prev,
          college: null,
        }));
      }

      // Validate custom college field
      if (!value.trim()) {
        setFieldErrors((prev) => ({
          ...prev,
          college: "College name is required",
        }));
      } else if (value.trim().length < 2) {
        setFieldErrors((prev) => ({
          ...prev,
          college: "College name must be at least 2 characters",
        }));
      }
      return;
    }
    // Handle degree type selection
    if (name === "degreeType") {
      setFormData((prev) => ({
        ...prev,
        degreeType: value,
        degree: value === "Other" ? "" : value,
        customDegree: value === "Other" ? prev.customDegree : "",
      }));

      if (fieldErrors.degree) {
        setFieldErrors((prev) => ({
          ...prev,
          degree: null,
        }));
      }
      return;
    }

    // Handle custom degree input
    if (name === "customDegree") {
      setFormData((prev) => ({
        ...prev,
        customDegree: value,
        degree: value.trim(),
      }));

      if (fieldErrors.degree) {
        setFieldErrors((prev) => ({
          ...prev,
          degree: null,
        }));
      }

      if (!value.trim()) {
        setFieldErrors((prev) => ({
          ...prev,
          degree: "Degree is required",
        }));
      } else if (value.trim().length < 2) {
        setFieldErrors((prev) => ({
          ...prev,
          degree: "Degree must be at least 2 characters",
        }));
      }
      return;
    }

    if (name === "branchType") {
      setFormData((prev) => ({
        ...prev,
        branchType: value,
        branch: value === "Other" ? "" : value,
        customBranch: value === "Other" ? prev.customBranch : "",
      }));

      if (fieldErrors.branch) {
        setFieldErrors((prev) => ({ ...prev, branch: null }));
      }
      return;
    }

    if (name === "customBranch") {
      setFormData((prev) => ({
        ...prev,
        customBranch: value,
        branch: value.trim(),
      }));

      if (fieldErrors.branch) {
        setFieldErrors((prev) => ({ ...prev, branch: null }));
      }

      if (!value.trim()) {
        setFieldErrors((prev) => ({
          ...prev,
          branch: "Branch name is required",
        }));
      } else if (value.trim().length < 2) {
        setFieldErrors((prev) => ({
          ...prev,
          branch: "Branch name must be at least 2 characters",
        }));
      }
      return;
    }
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Validate email format in real-time
    if (name === "email" && value.trim()) {
      const emailValidation = validateEmailFormat(value);
      if (!emailValidation.isValid) {
        setFieldErrors((prev) => ({
          ...prev,
          email: emailValidation.error,
        }));
      }
    }

    // Validate phone number format
    if (name === "phoneNumber" && value.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value.trim())) {
        setFieldErrors((prev) => ({
          ...prev,
          phoneNumber: "Phone number must be exactly 10 digits",
        }));
      }
    }

    // Validate required text fields
    if (["name", "college", "degree", "branch", "rollNumber"].includes(name)) {
      if (!value.trim()) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
        }));
      } else if (value.trim().length < 2) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } must be at least 2 characters`,
        }));
      }
    }
  };

  const handleTeamSizeSelect = (size) => {
    setFormData((prev) => ({
      ...prev,
      teamSize: size,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save form data to Firebase/database
    // console.log("Form submitted:", formData);
    // For now, just show success or go to next step
  };

  const handleFinalSubmit = async (teamDetailsData) => {
    setIsSubmitting(true);
    try {
      // Prepare registration data
      const registrationData = {
        leaderData: {
          ...formData,
          uid: user.uid,
        },
        teamSize: formData.teamSize,
        teammates: teamDetailsData.teammates || [],
        techStack: teamDetailsData.techStack,
      };

      // Save registration data
      const result = await saveRegistration(registrationData);

      // Navigate to success page
      if (result.success) {
        navigate("/registration-success", {
          state: {
            teamSize: formData.teamSize,
            leaderName: formData.name,
            leaderEmail: formData.email,
            isNewTeam: true,
          },
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSignIn = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      // Still navigate even if logout fails
      navigate("/signin");
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      const requiredFields = [
        "name",
        "degree",
        "yearOfStudy",
        "branch",
        "rollNumber",
        "phoneNumber",
      ];

      // Check if all required fields are filled
      const allFieldsFilled = requiredFields.every(
        (field) => formData[field].trim() !== ""
      );

      // Check if college is properly filled (either CBIT selected or custom college provided)
      const collegeValid =
        formData.collegeType === "CBIT" ||
        (formData.collegeType === "Other" &&
          formData.customCollege.trim() !== "");

      // Check if email is valid (it's pre-filled from Google but should still be valid)
      const emailValid = formData.email && !fieldErrors.email;

      // Check if there are no field errors
      const noErrors = Object.values(fieldErrors).every((error) => !error);

      return allFieldsFilled && collegeValid && emailValid && noErrors;
    }
    if (currentStep === 2) {
      return formData.teamSize !== null;
    }
    if (currentStep === 3) {
      // Validation handled by AddTeamDetails component
      return true;
    }
    return false;
  };

  const steps = [
    {
      id: 1,
      title: "Team Leader Details",
      description: "Enter your personal information",
    },
    { id: 2, title: "Team Size", description: "Choose your team size" },
    { id: 3, title: "Teammate Details", description: "Add your team members" },
  ];

  if (loading || isCheckingRegistration) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
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

        <div className="flex flex-col items-center space-y-4 relative z-10">
          <Loader className="w-8 h-8 animate-spin text-white" />
          <p
            className="text-white"
            style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
          >
            {loading ? "Loading..." : "Checking registration status..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div
      className="min-h-screen py-8 px-4 relative overflow-hidden"
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

      <div className="relative z-10 max-w-4xl mx-auto py-18">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
            }}
          >
            Registration
          </h1>
          <p
            className="text-lg opacity-90"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              color: "#D0CCE3",
            }}
          >
            Welcome, {user.displayName || user.email}!
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex justify-center items-center w-full max-w-3xl mx-auto px-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Circle & Labels */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-[#8A86FF] border-[#8A86FF] text-white shadow-lg"
                        : "border-[#FFFFFF] text-[#FFFFFF] bg-transparent"
                    } ${
                      currentStep > step.id
                        ? "after:absolute after:inset-0 after:rounded-full after:ring-2 after:ring-[#C2C2FF]/40"
                        : ""
                    }`}
                    style={{
                      width: "3rem",
                      height: "3rem",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      fontSize: "0.85rem",
                    }}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-3 text-center w-24 md:w-28">
                    <p
                      className={`text-xs md:text-sm font-semibold leading-snug ${
                        currentStep >= step.id ? "text-white" : "text-[#FFFFFF]"
                      }`}
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        minHeight: "2.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1.15",
                      }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="hidden sm:block text-[0.65rem] md:text-xs"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        minHeight: "1.1rem",
                        color: "#C2C2FF",
                        opacity: 0.85,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div
                    className="flex-1 px-1 sm:px-3 md:px-4 lg:px-6"
                    style={{ minWidth: "2.75rem" }}
                  >
                    <div
                      className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                        currentStep > step.id ? "bg-[#8A86FF]" : "bg-[#5E577C]"
                      }`}
                      style={{
                        backgroundImage:
                          currentStep > step.id
                            ? "linear-gradient(90deg,#8A86FF,#C2C2FF)"
                            : "none",
                        boxShadow:
                          currentStep > step.id
                            ? "0 0 8px rgba(138,134,255,0.5)"
                            : "0 0 4px rgba(94,87,124,0.4)",
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div
          className="backdrop-blur-xl border-2 rounded-2xl p-8 shadow-2xl relative"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.9)",
            borderColor: "#8A86FF",
            boxShadow:
              "0 0 30px rgba(138, 134, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {currentStep === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2
                className="text-2xl font-bold text-white mb-6 text-center"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Team Leader Details
              </h2>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <User className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 ${
                      fieldErrors.name
                        ? "border-red-400 focus:border-red-400"
                        : "focus:border-[#8A86FF]"
                    }`}
                    style={{
                      borderColor: fieldErrors.name ? "#F87171" : "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.name && (
                    <p
                      className="text-red-400 text-xs mt-1"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* College */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <GraduationCap className="w-4 h-4 text-[#C2C2FF]" />
                    <span>College/University*</span>
                  </label>

                  {/* College Type Dropdown */}
                  <select
                    name="collegeType"
                    value={formData.collegeType}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:outline-none transition-all duration-300 ${
                      fieldErrors.college
                        ? "border-red-400 focus:border-red-400"
                        : "focus:border-[#8A86FF]"
                    }`}
                    style={{
                      borderColor: fieldErrors.college ? "#F87171" : "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <option value="">Select your college</option>
                    <option value="CBIT">
                      CBIT (Chaitanya Bharathi Institute of Technology)
                    </option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Custom College Input - Only show when "Other" is selected */}
                  {formData.collegeType === "Other" && (
                    <input
                      type="text"
                      name="customCollege"
                      value={formData.customCollege}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 mt-2 ${
                        fieldErrors.college
                          ? "border-red-400 focus:border-red-400"
                          : "focus:border-[#8A86FF]"
                      }`}
                      style={{
                        borderColor: fieldErrors.college
                          ? "#F87171"
                          : "#5E577C",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                      placeholder="Enter your college/university name"
                    />
                  )}

                  {fieldErrors.college && (
                    <p
                      className="text-red-400 text-xs mt-1"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      {fieldErrors.college}
                    </p>
                  )}
                </div>

                {/* Degree */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Book className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Degree *</span>
                  </label>

                  {/* Degree Dropdown */}
                  <select
                    name="degreeType"
                    value={formData.degreeType || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:outline-none transition-all duration-300 focus:border-[#8A86FF]"
                    style={{
                      borderColor: "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <option value="">Select your degree</option>
                    <option value="B.Tech">
                      B.Tech (Bachelor of Technology)
                    </option>
                    <option value="B.E">B.E (Bachelor of Engineering)</option>
                    <option value="BCA">
                      BCA (Bachelor of Computer Applications)
                    </option>
                    <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                    <option value="M.Tech">
                      M.Tech (Master of Technology)
                    </option>
                    <option value="MCA">
                      MCA (Master of Computer Applications)
                    </option>
                    <option value="M.Sc">M.Sc (Master of Science)</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Custom Degree Input */}
                  {formData.degreeType === "Other" && (
                    <input
                      type="text"
                      name="customDegree"
                      value={formData.customDegree || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 mt-2 focus:border-[#8A86FF]"
                      style={{
                        borderColor: "#5E577C",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                      placeholder="Enter your degree"
                    />
                  )}
                </div>

                {/* Year of Study */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Calendar className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Year of Study *</span>
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:outline-none transition-all duration-300 focus:border-[#8A86FF]"
                    style={{
                      borderColor: "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <option value="">Select year of study</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Book className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Branch/Field of Study *</span>
                  </label>

                  {/* Branch Dropdown */}
                  <select
                    name="branchType"
                    value={formData.branchType}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:outline-none transition-all duration-300 ${
                      fieldErrors.branch
                        ? "border-red-400 focus:border-red-400"
                        : "focus:border-[#8A86FF]"
                    }`}
                    style={{
                      borderColor: fieldErrors.branch ? "#F87171" : "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <option value="">Select your branch</option>
                    <option value="AIDS">
                      AIDS (Artificial Intelligence & Data Science)
                    </option>
                    <option value="AIML">
                      AIML (Artificial Intelligence & Machine Learning)
                    </option>
                    <option value="Bio-Tech">Bio-Technology</option>
                    <option value="Chemical">Chemical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="CSE">
                      CSE (Computer Science & Engineering)
                    </option>
                    <option value="CSE-AIML">
                      CSE - AIML (Computer Science & AIML)
                    </option>
                    <option value="ECE">
                      ECE (Electronics & Communication Engineering)
                    </option>
                    <option value="ECE-EVL">
                      ECE - EVL (Electronics, VLSI & Embedded Systems)
                    </option>
                    <option value="EEE">
                      EEE (Electrical & Electronics Engineering)
                    </option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="IoT">IoT (Internet of Things)</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Custom Branch Input - Only visible when "Other" is selected */}
                  {formData.branchType === "Other" && (
                    <input
                      type="text"
                      name="customBranch"
                      value={formData.customBranch}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 mt-2 ${
                        fieldErrors.branch
                          ? "border-red-400 focus:border-red-400"
                          : "focus:border-[#8A86FF]"
                      }`}
                      style={{
                        borderColor: fieldErrors.branch ? "#F87171" : "#5E577C",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                      placeholder="Enter your branch/field of study"
                    />
                  )}

                  {fieldErrors.branch && (
                    <p
                      className="text-red-400 text-xs mt-1"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      {fieldErrors.branch}
                    </p>
                  )}
                </div>

                {/* Roll Number */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Hash className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Roll Number *</span>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300"
                    style={{
                      borderColor: "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter your roll number"
                  />
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Mail className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#5E577C] text-[#D0CCE3] cursor-not-allowed"
                    style={{
                      borderColor: "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  />
                  <p
                    className="text-xs text-[#D0CCE3]"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    Email from your Google account (cannot be changed)
                  </p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Phone className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 ${
                      fieldErrors.phoneNumber
                        ? "border-red-400 focus:border-red-400"
                        : "focus:border-[#8A86FF]"
                    }`}
                    style={{
                      borderColor: fieldErrors.phoneNumber
                        ? "#F87171"
                        : "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter your phone number"
                  />
                  {fieldErrors.phoneNumber && (
                    <p
                      className="text-red-400 text-xs mt-1"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      {fieldErrors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBackToSignIn}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 hover:bg-red-500/10 hover:border-red-400"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#5E577C",
                    color: "#D0CCE3",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sign Out & Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStepValid()}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#8A86FF",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    boxShadow: "0 0 20px rgba(138, 134, 255, 0.4)",
                  }}
                >
                  <span>Next: Team Size</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Team Size Selection */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <UserPlus className="w-16 h-16 text-[#8A86FF] mx-auto mb-4" />
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Choose Your Team Size
                </h2>
                <p
                  className="text-[#D0CCE3] mb-8"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Select how many members you want in your team (including
                  yourself)
                </p>
              </div>

              {/* Team Size Options */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleTeamSizeSelect(size)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      formData.teamSize === size
                        ? "border-[#8A86FF] bg-[#8A86FF]/20 shadow-lg"
                        : "border-[#5E577C] bg-[#403F7D]/50 hover:border-[#8A86FF]/50"
                    }`}
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        <Users
                          className={`w-8 h-8 ${
                            formData.teamSize === size
                              ? "text-[#C2C2FF]"
                              : "text-[#5E577C]"
                          }`}
                        />
                        <div
                          className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            formData.teamSize === size
                              ? "bg-[#8A86FF] text-white"
                              : "bg-[#5E577C] text-[#D0CCE3]"
                          }`}
                        >
                          {size}
                        </div>
                      </div>
                      <div className="text-center">
                        <p
                          className={`font-semibold ${
                            formData.teamSize === size
                              ? "text-white"
                              : "text-[#D0CCE3]"
                          }`}
                        >
                          {size === 1 ? "Solo" : `${size} Members`}
                        </p>
                        <p
                          className={`text-xs ${
                            formData.teamSize === size
                              ? "text-[#C2C2FF]"
                              : "text-[#5E577C]"
                          }`}
                        >
                          {size === 1
                            ? "register individually (you will be merged with others)"
                            : size === 2
                            ? "You + 1 teammate (your team will be merged with others)"
                            : `You + ${size - 1} teammate${
                                size > 2 ? "s" : ""
                              }`}
                        </p>
                      </div>
                      {formData.teamSize === size && (
                        <CheckCircle className="w-5 h-5 text-[#8A86FF]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Important Note for Small Teams */}
              <div
                className="p-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-400/10"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}
              >
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3
                      className="text-yellow-400 font-semibold mb-2"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      Important Note for Small Teams
                    </h3>
                    <p
                      className="text-yellow-100 text-sm leading-relaxed"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      Teams with less than 3 members (Solo or 2-member teams)
                      may be merged with other small teams during the hackathon
                      to create balanced groups and enhance collaboration. This
                      ensures everyone has a great team experience and can work
                      on more complex projects together.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 hover:bg-white/5"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#5E577C",
                    color: "#D0CCE3",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!isStepValid()}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#8A86FF",
                    color: "#FFFFFF",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    boxShadow: "0 0 20px rgba(138, 134, 255, 0.4)",
                  }}
                >
                  <span>
                    {formData.teamSize === 1
                      ? "Continue Solo"
                      : "Next: Add Teammates"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Add Team Details */}
          {currentStep === 3 && (
            <AddTeamDetails
              teamSize={formData.teamSize}
              leaderData={formData}
              onBack={() => setCurrentStep(2)}
              onSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
