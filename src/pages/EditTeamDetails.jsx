import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StarsBackground } from "../components/ui/stars-background";
import {
  getRegistrationByLeaderEmail,
  updateTeamDetails,
} from "../services/registrationService";
import {
  validateEmailFormat,
  checkEmailUniqueness,
  validateTeamEmails,
  validateSingleTeammateEmail,
} from "../services/emailValidationService";
import {
  ArrowLeft,
  Save,
  Loader,
  User,
  Users,
  Mail,
  Phone,
  Book,
  Calendar,
  Hash,
  GraduationCap,
  AlertTriangle,
  Code,
  X,
  CheckCircle,
} from "lucide-react";

const EditTeamDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingEmails, setIsValidatingEmails] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [formData, setFormData] = useState({
    teamSize: 1,
    techStack: "",
    teammates: [],
    leader: {
      name: "",
      college: "",
      collegeType: "",
      customCollege: "",
      degree: "",
      degreeType: "",
      customDegree: "",
      yearOfStudy: "",
      branch: "",
      branchType: "",
      customBranch: "",
      rollNumber: "",
      phoneNumber: "",
    },
  });
  const [emailErrors, setEmailErrors] = useState({});
  const [phoneErrors, setPhoneErrors] = useState({});
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState([]);
  const [newTeamSize, setNewTeamSize] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);

  // Refs for scrolling to errors
  const teammateRefs = useRef([]);

  // Get registration data from navigation state
  const registrationState = location.state?.registration;

  // Animated background particles
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = "#8A86FF";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load registration data
  useEffect(() => {
    const loadRegistrationData = async () => {
      if (!registrationState?.leaderEmail) {
        navigate("/");
        return;
      }

      setIsLoading(true);
      try {
        const registrationData = await getRegistrationByLeaderEmail(
          registrationState.leaderEmail
        );
        setRegistration(registrationData);

        // Initialize form data
        setFormData({
          teamSize: registrationData.teamSize,
          techStack: (() => {
            // Handle both array and string formats for backward compatibility
            if (Array.isArray(registrationData.techStack)) {
              return registrationData.techStack;
            } else if (
              typeof registrationData.techStack === "string" &&
              registrationData.techStack
            ) {
              try {
                const parsed = JSON.parse(registrationData.techStack);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            }
            return [];
          })(),
          teammates: registrationData.teammates.map((teammate) => {
            const storedDegree = teammate.degree || "";
            const storedBranch = teammate.branch || "";

            // List of known degree types
            const knownDegrees = [
              "B.Tech",
              "B.E",
              "BCA",
              "B.Sc",
              "M.Tech",
              "MCA",
              "M.Sc",
            ];
            const degreeType = knownDegrees.includes(storedDegree)
              ? storedDegree
              : storedDegree
              ? "Other"
              : "";
            const customDegree = knownDegrees.includes(storedDegree)
              ? ""
              : storedDegree;

            // List of known branch types
            const knownBranches = [
              "AIDS",
              "AIML",
              "Bio-Tech",
              "Chemical",
              "Civil",
              "CSE",
              "CSE-AIML",
              "ECE",
              "ECE-EVL",
              "EEE",
              "IT",
              "IoT",
              "Mechanical",
            ];
            const branchType = knownBranches.includes(storedBranch)
              ? storedBranch
              : storedBranch
              ? "Other"
              : "";
            const customBranch = knownBranches.includes(storedBranch)
              ? ""
              : storedBranch;

            return {
              name: teammate.name || "",
              college: teammate.college || "",
              collegeType:
                teammate.college ===
                "Chaitanya Bharathi Institute of Technology"
                  ? "CBIT"
                  : "Other",
              customCollege:
                teammate.college ===
                "Chaitanya Bharathi Institute of Technology"
                  ? ""
                  : teammate.college || "",
              degree: storedDegree,
              degreeType: degreeType,
              customDegree: customDegree,
              yearOfStudy: teammate.yearOfStudy || "",
              branch: storedBranch,
              branchType: branchType,
              customBranch: customBranch,
              rollNumber: teammate.rollNumber || "",
              email: teammate.email || "",
              phoneNumber: teammate.phoneNumber || "",
            };
          }),
          leader: {
            name: registrationData.leader?.name || "",
            college: registrationData.leader?.college || "",
            collegeType:
              registrationData.leader?.college ===
              "Chaitanya Bharathi Institute of Technology"
                ? "CBIT"
                : "Other",
            customCollege:
              registrationData.leader?.college ===
              "Chaitanya Bharathi Institute of Technology"
                ? ""
                : registrationData.leader?.college || "",
            degree: registrationData.leader?.degree || "",
            degreeType: (() => {
              const storedDegree = registrationData.leader?.degree || "";
              const knownDegrees = [
                "B.Tech",
                "B.E",
                "BCA",
                "B.Sc",
                "M.Tech",
                "MCA",
                "M.Sc",
              ];
              return knownDegrees.includes(storedDegree)
                ? storedDegree
                : storedDegree
                ? "Other"
                : "";
            })(),
            customDegree: (() => {
              const storedDegree = registrationData.leader?.degree || "";
              const knownDegrees = [
                "B.Tech",
                "B.E",
                "BCA",
                "B.Sc",
                "M.Tech",
                "MCA",
                "M.Sc",
              ];
              return knownDegrees.includes(storedDegree) ? "" : storedDegree;
            })(),
            yearOfStudy: registrationData.leader?.yearOfStudy || "",
            branch: registrationData.leader?.branch || "",
            branchType: (() => {
              const storedBranch = registrationData.leader?.branch || "";
              const knownBranches = [
                "AIDS",
                "AIML",
                "Bio-Tech",
                "Chemical",
                "Civil",
                "CSE",
                "CSE-AIML",
                "ECE",
                "ECE-EVL",
                "EEE",
                "IT",
                "IoT",
                "Mechanical",
              ];
              return knownBranches.includes(storedBranch)
                ? storedBranch
                : storedBranch
                ? "Other"
                : "";
            })(),
            customBranch: (() => {
              const storedBranch = registrationData.leader?.branch || "";
              const knownBranches = [
                "AIDS",
                "AIML",
                "Bio-Tech",
                "Chemical",
                "Civil",
                "CSE",
                "CSE-AIML",
                "ECE",
                "ECE-EVL",
                "EEE",
                "IT",
                "IoT",
                "Mechanical",
              ];
              return knownBranches.includes(storedBranch) ? "" : storedBranch;
            })(),
            rollNumber: registrationData.leader?.rollNumber || "",
            phoneNumber: registrationData.leader?.phoneNumber || "",
          },
        });

        setNewTeamSize(registrationData.teamSize);
      } catch (error) {
        console.error("Error loading registration data:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrationData();
  }, [registrationState, navigate]);

  // Validate form whenever data changes
  useEffect(() => {
    const validateFormSync = async () => {
      if (!registration) return;

      const requiredLeaderFields = [
        "name",
        "college",
        "degree",
        "yearOfStudy",
        "branch",
        "rollNumber",
        "phoneNumber",
      ];
      const requiredTeammateFields = [
        "name",
        "email",
        "college",
        "degree",
        "yearOfStudy",
        "branch",
        "rollNumber",
        "phoneNumber",
      ];

      // Check if leader has all required fields
      const leaderValid = requiredLeaderFields.every((field) => {
        if (field === "college") {
          return (
            formData.leader.collegeType === "CBIT" ||
            (formData.leader.collegeType === "Other" &&
              formData.leader.customCollege?.trim())
          );
        }
        return formData.leader[field]?.trim();
      });

      // Check if all teammates have required fields
      const allTeammatesValid = formData.teammates.every((teammate) =>
        requiredTeammateFields.every((field) => {
          if (field === "college") {
            return (
              teammate.collegeType === "CBIT" ||
              (teammate.collegeType === "Other" &&
                teammate.customCollege.trim())
            );
          }
          return teammate[field] && teammate[field].trim();
        })
      );

      // Check if tech stack is required and valid for small teams
      const techStackValid =
        formData.teamSize >= 3 ||
        (formData.teamSize < 3 &&
          Array.isArray(formData.techStack) &&
          formData.techStack.length > 0);

      // Check if there are no email or phone errors
      const noErrors =
        Object.keys(emailErrors).length === 0 &&
        Object.keys(phoneErrors).length === 0;

      setIsFormValid(
        leaderValid && allTeammatesValid && techStackValid && noErrors
      );
    };

    validateFormSync();
  }, [formData, emailErrors, phoneErrors, registration]);

  // Handle leader field change
  const handleLeaderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      leader: {
        ...prev.leader,
        [field]: value,
      },
    }));

    // Special handling for college selection
    if (field === "collegeType") {
      setFormData((prev) => ({
        ...prev,
        leader: {
          ...prev.leader,
          collegeType: value,
          customCollege: value === "CBIT" ? "" : prev.leader.customCollege,
        },
      }));
    }
    if (field === "degreeType") {
      setFormData((prev) => ({
        ...prev,
        leader: {
          ...prev.leader,
          degreeType: value,
          degree: value === "Other" ? "" : value,
          customDegree: value === "Other" ? prev.leader.customDegree : "",
        },
      }));
      return;
    }

    if (field === "customDegree") {
      setFormData((prev) => ({
        ...prev,
        leader: {
          ...prev.leader,
          customDegree: value,
          degree: value.trim(),
        },
      }));
      return;
    }

    if (field === "branchType") {
      setFormData((prev) => ({
        ...prev,
        leader: {
          ...prev.leader,
          branchType: value,
          branch: value === "Other" ? "" : value,
          customBranch: value === "Other" ? prev.leader.customBranch : "",
        },
      }));
      return;
    }

    if (field === "customBranch") {
      setFormData((prev) => ({
        ...prev,
        leader: {
          ...prev.leader,
          customBranch: value,
          branch: value.trim(),
        },
      }));
      return;
    }

    // Clear phone error when user starts typing
    if (field === "phoneNumber" && phoneErrors.leader) {
      setPhoneErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.leader;
        return newErrors;
      });
    }

    // Validate phone number format
    if (field === "phoneNumber" && value.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value.trim())) {
        setPhoneErrors((prev) => ({
          ...prev,
          leader: "Phone number must be exactly 10 digits",
        }));
      } else {
        setPhoneErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.leader;
          return newErrors;
        });
      }
    }
  };

  // Handle team size change
  const handleTeamSizeChange = (newSize) => {
    const currentSize = formData.teamSize;

    if (newSize < currentSize) {
      // Reducing team size - show removal modal
      setNewTeamSize(newSize);
      setSelectedForRemoval([]);
      setShowRemovalModal(true);
    } else if (newSize > currentSize) {
      // Increasing team size - add empty teammates
      const newTeammates = [...formData.teammates];
      for (let i = currentSize - 1; i < newSize - 1; i++) {
        newTeammates.push({
          name: "",
          college: "",
          collegeType: "",
          customCollege: "",
          degree: "",
          degreeType: "",
          customDegree: "",
          yearOfStudy: "",
          branch: "",
          branchType: "",
          customBranch: "",
          rollNumber: "",
          email: "",
          phoneNumber: "",
        });
      }
      setFormData((prev) => ({
        ...prev,
        teamSize: newSize,
        teammates: newTeammates,
      }));
    }
  };

  // Handle teammate removal confirmation
  const handleConfirmRemoval = () => {
    const removedTeammates = selectedForRemoval.map(
      (index) => formData.teammates[index]
    );
    const remainingTeammates = formData.teammates.filter(
      (_, index) => !selectedForRemoval.includes(index)
    );

    setFormData((prev) => ({
      ...prev,
      teamSize: newTeamSize,
      teammates: remainingTeammates,
      removedTeammates: removedTeammates, // Store for database cleanup
    }));

    setShowRemovalModal(false);
    setSelectedForRemoval([]);
  };

  // Revalidate all emails to ensure consistency
  const revalidateAllEmails = async (teammates) => {
    if (teammates.length === 0) {
      setEmailErrors({});
      return;
    }

    setIsValidatingEmails(true);
    try {
      const teammateEmails = teammates
        .map((t) => t.email)
        .filter((e) => e && e.trim());
      const existingTeammateEmails =
        registration?.teammates
          ?.map((t) => t.email)
          .filter((e) => e && e.trim()) || [];

      const emailValidation = await validateTeamEmails(
        registration.leader.email,
        teammateEmails,
        existingTeammateEmails
      );

      if (!emailValidation.isValid) {
        setEmailErrors(emailValidation.teammateErrors || {});
      } else {
        setEmailErrors({});
      }
    } catch (error) {
      console.error("Email revalidation error:", error);
    } finally {
      setIsValidatingEmails(false);
    }
  };

  // Handle teammate field change
  const handleTeammateChange = async (index, field, value) => {
    const updatedTeammates = [...formData.teammates];

    // Special handling for college type selection
    if (field === "collegeType") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        collegeType: value,
        college:
          value === "CBIT" ? "Chaitanya Bharathi Institute of Technology" : "",
        customCollege:
          value === "Other" ? updatedTeammates[index].customCollege : "",
      };
    } else if (field === "customCollege") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        customCollege: value,
        college: value,
      };
    } else {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        [field]: value,
      };
    }
    if (field === "degreeType") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        degreeType: value,
        degree: value === "Other" ? "" : value,
        customDegree:
          value === "Other" ? updatedTeammates[index].customDegree : "",
      };
      setFormData((prev) => ({ ...prev, teammates: updatedTeammates }));
      return;
    }

    if (field === "customDegree") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        customDegree: value,
        degree: value.trim(),
      };
      setFormData((prev) => ({ ...prev, teammates: updatedTeammates }));
      return;
    }

    if (field === "branchType") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        branchType: value,
        branch: value === "Other" ? "" : value,
        customBranch:
          value === "Other" ? updatedTeammates[index].customBranch : "",
      };
      setFormData((prev) => ({ ...prev, teammates: updatedTeammates }));
      return;
    }

    if (field === "customBranch") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        customBranch: value,
        branch: value.trim(),
      };
      setFormData((prev) => ({ ...prev, teammates: updatedTeammates }));
      return;
    }

    setFormData((prev) => ({ ...prev, teammates: updatedTeammates }));

    // Clear email error when user starts typing
    if (field === "email") {
      if (emailErrors[index]) {
        const newEmailErrors = { ...emailErrors };
        delete newEmailErrors[index];
        setEmailErrors(newEmailErrors);
      }

      // If email is empty, don't validate
      if (!value.trim()) {
        return;
      }
    }

    // Clear phone error when user starts typing
    if (field === "phoneNumber" && phoneErrors[index]) {
      const newPhoneErrors = { ...phoneErrors };
      delete newPhoneErrors[index];
      setPhoneErrors(newPhoneErrors);
    }

    // Validate phone number format
    if (field === "phoneNumber" && value.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value.trim())) {
        setPhoneErrors((prev) => ({
          ...prev,
          [index]: "Phone number must be exactly 10 digits",
        }));
      } else {
        const newPhoneErrors = { ...phoneErrors };
        delete newPhoneErrors[index];
        setPhoneErrors(newPhoneErrors);
      }
    }

    // Validate email format and uniqueness when email field changes
    if (field === "email" && value.trim()) {
      // Clear validation state and revalidate all emails
      await revalidateAllEmails(updatedTeammates);
    }
  };

  // Scroll to first error field
  const scrollToFirstError = () => {
    // Check for email errors first (only actual errors, not null values)
    const firstEmailErrorIndex = Object.entries(emailErrors)
      .filter(
        ([key, value]) =>
          value !== null && value !== undefined && !isNaN(parseInt(key))
      )
      .map(([key]) => parseInt(key))
      .sort((a, b) => a - b)[0];

    if (
      firstEmailErrorIndex !== undefined &&
      teammateRefs.current[firstEmailErrorIndex]
    ) {
      // console.log(
      //   "Scrolling to email error at index:",
      //   firstEmailErrorIndex,
      //   emailErrors[firstEmailErrorIndex]
      // );
      teammateRefs.current[firstEmailErrorIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return true;
    }

    // Check for phone errors (only actual errors, not null values)
    const firstPhoneErrorIndex = Object.entries(phoneErrors)
      .filter(
        ([key, value]) =>
          value !== null && value !== undefined && !isNaN(parseInt(key))
      )
      .map(([key]) => parseInt(key))
      .sort((a, b) => a - b)[0];

    if (
      firstPhoneErrorIndex !== undefined &&
      teammateRefs.current[firstPhoneErrorIndex]
    ) {
      // console.log(
      //   "Scrolling to phone error at index:",
      //   firstPhoneErrorIndex,
      //   phoneErrors[firstPhoneErrorIndex]
      // );
      teammateRefs.current[firstPhoneErrorIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return true;
    }

    // If no specific field error found, check if all required fields are filled
    // console.log("No specific error found. Checking form data:", formData);
    for (let i = 0; i < formData.teammates.length; i++) {
      const teammate = formData.teammates[i];
      const hasEmptyField =
        !teammate.name ||
        !teammate.email ||
        !teammate.phoneNumber ||
        !teammate.degree ||
        !teammate.yearOfStudy ||
        !teammate.branch ||
        !teammate.rollNumber ||
        !teammate.collegeType ||
        (teammate.collegeType === "Other" && !teammate.customCollege);

      if (hasEmptyField) {
        // console.log("Found incomplete teammate at index:", i, teammate);
        if (teammateRefs.current[i]) {
          teammateRefs.current[i].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return true;
      }
    }

    return false;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Check for actual errors (not null values)
    const hasEmailErrors = Object.values(emailErrors).some(
      (error) => error !== null && error !== undefined
    );
    const hasPhoneErrors = Object.values(phoneErrors).some(
      (error) => error !== null && error !== undefined
    );

    // If form has errors, scroll to first error
    if (!isFormValid || hasEmailErrors || hasPhoneErrors) {
      // console.log("Form validation failed:", {
      //   isFormValid,
      //   hasEmailErrors,
      //   hasPhoneErrors,
      //   emailErrors,
      //   phoneErrors,
      // });
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);
    try {
      // Final validation of all emails before submission
      if (formData.teammates.length > 0) {
        const teammateEmails = formData.teammates
          .map((t) => t.email)
          .filter((e) => e && e.trim());
        const existingTeammateEmails =
          registration?.teammates
            ?.map((t) => t.email)
            .filter((e) => e && e.trim()) || [];

        const emailValidation = await validateTeamEmails(
          registration.leader.email,
          teammateEmails,
          existingTeammateEmails
        );

        if (!emailValidation.isValid) {
          setEmailErrors(emailValidation.teammateErrors || {});
          setIsSubmitting(false);
          scrollToFirstError();
          return;
        }

        // Clear email errors if validation passes
        setEmailErrors({});
      }

      const updateData = {
        teamSize: formData.teamSize,
        leader: {
          name: formData.leader.name,
          college:
            formData.leader.collegeType === "CBIT"
              ? "Chaitanya Bharathi Institute of Technology"
              : formData.leader.customCollege,
          degree: formData.leader.degree,
          yearOfStudy: formData.leader.yearOfStudy,
          branch: formData.leader.branch,
          rollNumber: formData.leader.rollNumber,
          phoneNumber: formData.leader.phoneNumber,
        },
        teammates: formData.teammates.map((teammate) => ({
          name: teammate.name,
          email: teammate.email,
          college:
            teammate.collegeType === "CBIT"
              ? "Chaitanya Bharathi Institute of Technology"
              : teammate.customCollege,
          degree: teammate.degree,
          yearOfStudy: teammate.yearOfStudy,
          branch: teammate.branch,
          rollNumber: teammate.rollNumber,
          phoneNumber: teammate.phoneNumber,
        })),
        techStack: formData.techStack,
        removedTeammates: formData.removedTeammates || [],
      };

      await updateTeamDetails(registration.leaderEmail, updateData);

      // Navigate back to registration success with updated data
      navigate("/registration-success", {
        state: {
          teamSize: formData.teamSize,
          leaderName: formData.leader.name,
          leaderEmail: registration.leaderEmail,
          isNewTeam: false,
          existingRegistration: false,
        },
      });
    } catch (error) {
      console.error("Error updating team details:", error);
      alert("Failed to update team details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse at top, #1e1e3f 0%, #1a1a35 50%, #16162b 100%)",
        }}
      >
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#8A86FF] animate-spin mx-auto mb-4" />
          <p
            className="text-white text-lg"
            style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
          >
            Loading team details...
          </p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return null;
  }

  return (
    <div
      className="min-h-screen py-8 px-4 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #1e1e3f 0%, #1a1a35 50%, #16162b 100%)",
      }}
    >
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

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

      <div className="relative z-10 max-w-4xl mx-auto pt-16 sm:pt-20 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
            }}
          >
            Edit Team Details
          </h1>
          <p
            className="text-[#D0CCE3] text-lg"
            style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
          >
            Update your team information for CBIT Hacktoberfest 2025
          </p>
        </div>

        {/* Main Form Container */}
        <div
          className="backdrop-blur-xl border-2 rounded-2xl p-6 md:p-8 shadow-2xl"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.95)",
            borderColor: "#8A86FF",
            boxShadow:
              "0 0 40px rgba(138, 134, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Team Leader Info (Editable except email) */}
            <div className="p-6 rounded-xl border-2 border-[#8A86FF] bg-[#8A86FF]/15">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-[#8A86FF]" />
                <h3
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Team Leader Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <User className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.leader.name}
                    onChange={(e) => handleLeaderChange("name", e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300"
                    style={{
                      borderColor: "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Mail className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={registration.leader.email}
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
                    Email cannot be changed
                  </p>
                </div>

                {/* College */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <GraduationCap className="w-4 h-4 text-[#C2C2FF]" />
                    <span>College/University *</span>
                  </label>

                  <select
                    value={formData.leader.collegeType}
                    onChange={(e) =>
                      handleLeaderChange("collegeType", e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:border-[#8A86FF] focus:outline-none transition-all duration-300"
                    style={{
                      borderColor: "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <option value="">Select college</option>
                    <option value="CBIT">
                      CBIT (Chaitanya Bharathi Institute of Technology)
                    </option>
                    <option value="Other">Other</option>
                  </select>

                  {formData.leader.collegeType === "Other" && (
                    <input
                      type="text"
                      value={formData.leader.customCollege}
                      onChange={(e) =>
                        handleLeaderChange("customCollege", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300 mt-2"
                      style={{
                        borderColor: "#5E577C",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                      placeholder="Enter college/university name"
                    />
                  )}
                </div>

                {/* Degree */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-white font-medium text-sm">
                    <Book className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Degree *</span>
                  </label>

                  <select
                    value={formData.leader.degreeType || ""}
                    onChange={(e) =>
                      handleLeaderChange("degreeType", e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white"
                  >
                    <option value="">Select degree</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E">B.E</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="Other">Other</option>
                  </select>

                  {formData.leader.degreeType === "Other" && (
                    <input
                      type="text"
                      value={formData.leader.customDegree}
                      onChange={(e) =>
                        handleLeaderChange("customDegree", e.target.value)
                      }
                      placeholder="Enter your degree"
                      className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white mt-2"
                    />
                  )}
                </div>

                {/* Year of Study */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Calendar className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Year of Study *</span>
                  </label>
                  <select
                    value={formData.leader.yearOfStudy}
                    onChange={(e) =>
                      handleLeaderChange("yearOfStudy", e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:outline-none transition-all duration-300"
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
                  <label className="flex items-center space-x-2 text-white font-medium text-sm">
                    <Hash className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Branch *</span>
                  </label>

                  <select
                    value={formData.leader.branchType || ""}
                    onChange={(e) =>
                      handleLeaderChange("branchType", e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white"
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

                  {formData.leader.branchType === "Other" && (
                    <input
                      type="text"
                      value={formData.leader.customBranch}
                      onChange={(e) =>
                        handleLeaderChange("customBranch", e.target.value)
                      }
                      placeholder="Enter your branch"
                      className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white mt-2"
                    />
                  )}
                </div>

                {/* Roll Number */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Hash className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Roll Number *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.leader.rollNumber}
                    onChange={(e) =>
                      handleLeaderChange("rollNumber", e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300"
                    style={{
                      borderColor: "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter roll number"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Phone className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.leader.phoneNumber}
                    onChange={(e) =>
                      handleLeaderChange("phoneNumber", e.target.value)
                    }
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 ${
                      phoneErrors.leader
                        ? "border-red-400 focus:border-red-400"
                        : "focus:border-[#8A86FF]"
                    }`}
                    style={{
                      borderColor: phoneErrors.leader ? "#F87171" : "#5E577C",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter phone number"
                  />
                  {phoneErrors.leader && (
                    <p
                      className="text-red-400 text-xs mt-1"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      {phoneErrors.leader}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Team Size Selector */}
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold text-white flex items-center space-x-2"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                <Users className="w-6 h-6 text-[#8A86FF]" />
                <span>Team Size</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleTeamSizeChange(size)}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-300 hover:scale-105 ${
                      formData.teamSize === size
                        ? "border-[#8A86FF] bg-[#8A86FF]/20 shadow-lg"
                        : "border-[#5E577C] bg-[#403F7D]/30 hover:border-[#8A86FF]/50"
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
                            ? "You will be merged with others"
                            : size === 2
                            ? "You + 1 teammate (will be merged with others)"
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
            </div>

            {/* Teammates Section */}
            {formData.teamSize > 1 && (
              <div className="space-y-6">
                <h3
                  className="text-xl font-semibold text-white flex items-center space-x-2"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  <Users className="w-6 h-6 text-[#8A86FF]" />
                  <span>Team Members</span>
                </h3>

                {formData.teammates.map((teammate, index) => (
                  <div
                    key={index}
                    ref={(el) => (teammateRefs.current[index] = el)}
                    className="p-6 rounded-xl border-2 border-[#5E577C] bg-[#403F7D]/30 space-y-6"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full bg-[#8A86FF] flex items-center justify-center text-white font-bold text-sm"
                        style={{
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        {index + 1}
                      </div>
                      <h4
                        className="text-lg font-semibold text-white"
                        style={{
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        Teammate {index + 1}
                      </h4>
                    </div>

                    {/* Teammate Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label
                          className="flex items-center space-x-2 text-white font-medium text-sm"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          <User className="w-4 h-4 text-[#C2C2FF]" />
                          <span>Full Name *</span>
                        </label>
                        <input
                          type="text"
                          value={teammate.name}
                          onChange={(e) =>
                            handleTeammateChange(index, "name", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300"
                          style={{
                            borderColor: "#5E577C",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                          placeholder="Enter teammate's full name"
                        />
                      </div>

                      {/* College */}
                      <div className="space-y-2">
                        <label
                          className="flex items-center space-x-2 text-white font-medium text-sm"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          <GraduationCap className="w-4 h-4 text-[#C2C2FF]" />
                          <span>College/University *</span>
                        </label>

                        <select
                          value={teammate.collegeType}
                          onChange={(e) =>
                            handleTeammateChange(
                              index,
                              "collegeType",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:border-[#8A86FF] focus:outline-none transition-all duration-300"
                          style={{
                            borderColor: "#5E577C",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          <option value="">Select college</option>
                          <option value="CBIT">
                            CBIT (Chaitanya Bharathi Institute of Technology)
                          </option>
                          <option value="Other">Other</option>
                        </select>

                        {teammate.collegeType === "Other" && (
                          <input
                            type="text"
                            value={teammate.customCollege}
                            onChange={(e) =>
                              handleTeammateChange(
                                index,
                                "customCollege",
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300 mt-2"
                            style={{
                              borderColor: "#5E577C",
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            }}
                            placeholder="Enter college/university name"
                          />
                        )}
                      </div>

                      {/* Degree */}
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-white font-medium text-sm">
                          <Book className="w-4 h-4 text-[#C2C2FF]" />
                          <span>Degree *</span>
                        </label>

                        <select
                          value={teammate.degreeType || ""}
                          onChange={(e) =>
                            handleTeammateChange(
                              index,
                              "degreeType",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white"
                        >
                          <option value="">Select degree</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="B.E">B.E</option>
                          <option value="BCA">BCA</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="MCA">MCA</option>
                          <option value="M.Sc">M.Sc</option>
                          <option value="Other">Other</option>
                        </select>

                        {teammate.degreeType === "Other" && (
                          <input
                            type="text"
                            value={teammate.customDegree}
                            onChange={(e) =>
                              handleTeammateChange(
                                index,
                                "customDegree",
                                e.target.value
                              )
                            }
                            placeholder="Enter your degree"
                            className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white mt-2"
                          />
                        )}
                      </div>

                      {/* Year of Study */}
                      <div className="space-y-2">
                        <label
                          className="flex items-center space-x-2 text-white font-medium text-sm"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          <Calendar className="w-4 h-4 text-[#C2C2FF]" />
                          <span>Year of Study *</span>
                        </label>
                        <select
                          value={teammate.yearOfStudy}
                          onChange={(e) =>
                            handleTeammateChange(
                              index,
                              "yearOfStudy",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:outline-none transition-all duration-300"
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
                        <label className="flex items-center space-x-2 text-white font-medium text-sm">
                          <Hash className="w-4 h-4 text-[#C2C2FF]" />
                          <span>Branch *</span>
                        </label>

                        <select
                          value={teammate.branchType || ""}
                          onChange={(e) =>
                            handleTeammateChange(
                              index,
                              "branchType",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white"
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
                          <option value="IT">
                            IT (Information Technology)
                          </option>
                          <option value="IoT">IoT (Internet of Things)</option>
                          <option value="Mechanical">
                            Mechanical Engineering
                          </option>
                          <option value="Other">Other</option>
                        </select>

                        {teammate.branchType === "Other" && (
                          <input
                            type="text"
                            value={teammate.customBranch}
                            onChange={(e) =>
                              handleTeammateChange(
                                index,
                                "customBranch",
                                e.target.value
                              )
                            }
                            placeholder="Enter your branch"
                            className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white mt-2"
                          />
                        )}
                      </div>

                      {/* Roll Number */}
                      <div className="space-y-2">
                        <label
                          className="flex items-center space-x-2 text-white font-medium text-sm"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          <Hash className="w-4 h-4 text-[#C2C2FF]" />
                          <span>Roll Number *</span>
                        </label>
                        <input
                          type="text"
                          value={teammate.rollNumber}
                          onChange={(e) =>
                            handleTeammateChange(
                              index,
                              "rollNumber",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300"
                          style={{
                            borderColor: "#5E577C",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                          placeholder="Enter roll number"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label
                          className="flex items-center space-x-2 text-white font-medium text-sm"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          <Mail className="w-4 h-4 text-[#C2C2FF]" />
                          <span>Email Address *</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={teammate.email}
                            onChange={(e) =>
                              handleTeammateChange(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                            required
                            className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 ${
                              emailErrors[index]
                                ? "border-red-400 focus:border-red-400"
                                : "focus:border-[#8A86FF]"
                            }`}
                            style={{
                              borderColor: emailErrors[index]
                                ? "#F87171"
                                : "#5E577C",
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            }}
                            placeholder="Enter email address"
                          />
                          {isValidatingEmails && teammate.email.trim() && (
                            <div className="absolute right-3 top-3">
                              <Loader className="w-5 h-5 animate-spin text-[#8A86FF]" />
                            </div>
                          )}
                        </div>
                        {emailErrors[index] && (
                          <p
                            className="text-red-400 text-xs mt-1"
                            style={{
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            }}
                          >
                            {emailErrors[index]}
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label
                          className="flex items-center space-x-2 text-white font-medium text-sm"
                          style={{
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                        >
                          <Phone className="w-4 h-4 text-[#C2C2FF]" />
                          <span>Phone Number *</span>
                        </label>
                        <input
                          type="tel"
                          value={teammate.phoneNumber}
                          onChange={(e) =>
                            handleTeammateChange(
                              index,
                              "phoneNumber",
                              e.target.value
                            )
                          }
                          required
                          className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 ${
                            phoneErrors[index]
                              ? "border-red-400 focus:border-red-400"
                              : "focus:border-[#8A86FF]"
                          }`}
                          style={{
                            borderColor: phoneErrors[index]
                              ? "#F87171"
                              : "#5E577C",
                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                          }}
                          placeholder="Enter phone number"
                        />
                        {phoneErrors[index] && (
                          <p
                            className="text-red-400 text-xs mt-1"
                            style={{
                              fontFamily: "'Atkinson Hyperlegible', sans-serif",
                            }}
                          >
                            {phoneErrors[index]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack for Small Teams */}
            {formData.teamSize < 3 && (
              <div className="space-y-4">
                <div className="p-6 rounded-xl border-l-4 border-[#8A86FF] bg-[#8A86FF]/10 backdrop-blur-sm">
                  <h3
                    className="text-[#C2C2FF] font-semibold mb-2 flex items-center space-x-2"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Code className="w-5 h-5" />
                    <span>Tech Stack of All Your Teammates</span>
                  </h3>
                  <p
                    className="text-[#D0CCE3] text-sm mb-4 leading-relaxed"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    Since your team has less than 3 members, please select the
                    technical areas you and your teammate(s) are familiar with.
                    This will help us match you with compatible teams if needed.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { value: "frontend", label: "Frontend" },
                      { value: "backend", label: "Backend" },
                      { value: "nosql", label: "NoSQL DB" },
                      { value: "sql", label: "SQL DB" },
                      { value: "aiml", label: "AI/ML" },
                      { value: "blockchain", label: "Blockchain" },
                      { value: "iot", label: "IoT" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-[#8A86FF] ${
                          formData.techStack.includes(option.value)
                            ? "border-[#8A86FF] bg-[#8A86FF]/20 shadow-md"
                            : "border-[#5E577C] bg-[#403F7D]/30 hover:border-[#8A86FF]/50"
                        }`}
                        style={{
                          fontFamily: "'Atkinson Hyperlegible', sans-serif",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.techStack.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                techStack: [...prev.techStack, option.value],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                techStack: prev.techStack.filter(
                                  (item) => item !== option.value
                                ),
                              }));
                            }
                          }}
                          className="w-5 h-5 text-[#8A86FF] bg-[#403F7D] border-[#5E577C] rounded focus:ring-[#8A86FF] focus:ring-2"
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.techStack.includes(option.value)
                              ? "text-white"
                              : "text-[#D0CCE3]"
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {(!formData.techStack || formData.techStack.length === 0) && (
                    <p
                      className="text-red-400 text-xs mt-2"
                      style={{
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                    >
                      Please select at least one technical area
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
              <button
                type="button"
                onClick={() =>
                  navigate("/registration-success", {
                    state: {
                      teamSize: registration.teamSize,
                      leaderName: registration.leader.name,
                      leaderEmail: registration.leaderEmail,
                      isNewTeam: false,
                      existingRegistration: false,
                    },
                  })
                }
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 hover:bg-white/5 disabled:opacity-50"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#5E577C",
                  color: "#D0CCE3",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                style={{
                  backgroundColor: "#8A86FF",
                  color: "#FFFFFF",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  boxShadow: "0 0 20px rgba(138, 134, 255, 0.4)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Teammate Removal Modal */}
      {showRemovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-[#1c1c3f] border-2 border-red-400 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            style={{
              boxShadow: "0 0 40px rgba(239, 68, 68, 0.4)",
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Select Teammates to Remove
              </h3>
            </div>

            <p
              className="text-[#D0CCE3] mb-6"
              style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
            >
              You're changing team size from {formData.teamSize} to{" "}
              {newTeamSize}. Please select {formData.teamSize - newTeamSize}{" "}
              teammate{formData.teamSize - newTeamSize > 1 ? "s" : ""} to
              remove:
            </p>

            <div className="space-y-3 mb-6">
              {formData.teammates.map((teammate, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-[#5E577C] bg-[#403F7D]/30 cursor-pointer hover:bg-[#403F7D]/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedForRemoval.includes(index)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (
                          selectedForRemoval.length <
                          formData.teamSize - newTeamSize
                        ) {
                          setSelectedForRemoval((prev) => [...prev, index]);
                        }
                      } else {
                        setSelectedForRemoval((prev) =>
                          prev.filter((i) => i !== index)
                        );
                      }
                    }}
                    disabled={
                      !selectedForRemoval.includes(index) &&
                      selectedForRemoval.length >=
                        formData.teamSize - newTeamSize
                    }
                    className="w-4 h-4 text-red-400 bg-[#403F7D] border-[#5E577C] rounded focus:ring-red-400"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {teammate.name || `Teammate ${index + 1}`}
                    </p>
                    <p className="text-[#C2C2FF] text-sm">{teammate.email}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRemovalModal(false);
                  setSelectedForRemoval([]);
                }}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-[#5E577C] text-[#D0CCE3] hover:bg-white/5 transition-colors"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoval}
                disabled={
                  selectedForRemoval.length !== formData.teamSize - newTeamSize
                }
                className="flex-1 px-4 py-3 rounded-lg bg-red-400 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500 transition-colors"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Remove Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTeamDetails;