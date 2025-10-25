import React, { useState, useEffect } from "react";
import {
  validateTeamEmails,
  validateSingleTeammateEmail,
} from "../services/emailValidationService";
import {
  User,
  GraduationCap,
  Calendar,
  Book,
  Hash,
  Mail,
  Phone,
  Code,
  ArrowLeft,
  ArrowRight,
  Loader,
  Users,
  Plus,
  Minus,
} from "lucide-react";

const AddTeamDetails = ({
  teamSize,
  initialData, // For editing mode
  onBack,
  onSubmit,
  isSubmitting = false,
  leaderData,
}) => {
  const [teammates, setTeammates] = useState(() => {
    // If initialData is provided (editing mode), use existing teammates
    if (initialData && initialData.teammates) {
      return initialData.teammates.map((teammate) => {
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
            teammate.college === "Chaitanya Bharathi Institute of Technology"
              ? "CBIT"
              : teammate.college
              ? "Other"
              : "",
          customCollege:
            teammate.college === "Chaitanya Bharathi Institute of Technology"
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
      });
    }

    // Initialize teammates array based on team size (new team mode)
    const initialTeammates = [];
    for (let i = 0; i < teamSize - 1; i++) {
      initialTeammates.push({
        name: "",
        college: "",
        collegeType: "",
        customCollege: "",
        degree: "",
        degreeType: "",
        customDegree: "",
        yearOfStudy: "",
        branchType: "",
        branch: "",
        customBranch: "",
        rollNumber: "",
        email: "",
        phoneNumber: "",
      });
    }
    return initialTeammates;
  });

  const [techStack, setTechStack] = useState(() => {
    // If initialData is provided (editing mode), use existing techStack
    if (initialData && initialData.techStack) {
      // Handle both array and string formats for backward compatibility
      if (Array.isArray(initialData.techStack)) {
        return initialData.techStack;
      } else if (
        typeof initialData.techStack === "string" &&
        initialData.techStack
      ) {
        // Try to parse if it's a JSON string, otherwise return empty array
        try {
          const parsed = JSON.parse(initialData.techStack);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [emailErrors, setEmailErrors] = useState({});
  const [phoneErrors, setPhoneErrors] = useState({});
  const [isValidatingEmails, setIsValidatingEmails] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Refs for scrolling to errors
  const teammateRefs = React.useRef([]);

  // Validate form whenever teammates or techStack changes
  useEffect(() => {
    const validateFormSync = async () => {
      try {
        const isValid = await validateForm();
        // console.log('Form validation result:', isValid, { teamSize, teammates, techStack });
        setIsFormValid(isValid);
      } catch (error) {
        console.error("Form validation error:", error);
        setIsFormValid(false);
      }
    };

    validateFormSync();
  }, [
    teammates,
    techStack,
    emailErrors,
    phoneErrors,
    teamSize,
    initialData,
    leaderData,
  ]);

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
        initialData && initialData.teammates
          ? initialData.teammates
              .map((t) => t.email)
              .filter((e) => e && e.trim())
          : [];

      const emailValidation = await validateTeamEmails(
        leaderData.email,
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

  const handleTeammateChange = async (index, field, value) => {
    const updatedTeammates = [...teammates];

    // --- Handle College Type ---
    if (field === "collegeType") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        collegeType: value,
        college:
          value === "CBIT" ? "Chaitanya Bharathi Institute of Technology" : "",
        customCollege:
          value === "CBIT" ? "" : updatedTeammates[index].customCollege,
      };
      setTeammates(updatedTeammates);
      return;
    }

    // --- Handle Custom College ---
    if (field === "customCollege") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        customCollege: value,
        college: value.trim(),
      };
      setTeammates(updatedTeammates);
      return;
    }
    // ----- 🎓 DEGREE SELECTION -----
    if (field === "degreeType") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        degreeType: value,
        degree: value === "Other" ? "" : value,
        customDegree:
          value === "Other" ? updatedTeammates[index].customDegree : "",
      };
      setTeammates(updatedTeammates);
      return;
    }

    if (field === "customDegree") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        customDegree: value,
        degree: value.trim(),
      };
      setTeammates(updatedTeammates);
      return;
    }

    // --- Handle Branch Type (dropdown) ---
    if (field === "branchType") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        branchType: value,
        branch: value === "Other" ? "" : value,
        customBranch:
          value === "Other" ? updatedTeammates[index].customBranch : "",
      };
      setTeammates(updatedTeammates); // <-- missing before
      return;
    }

    // --- Handle Custom Branch ---
    if (field === "customBranch") {
      updatedTeammates[index] = {
        ...updatedTeammates[index],
        customBranch: value,
        branch: value.trim(),
      };
      setTeammates(updatedTeammates); // <-- missing before
      return;
    }

    // --- Handle Other Fields ---
    updatedTeammates[index] = {
      ...updatedTeammates[index],
      [field]: value,
    };
    setTeammates(updatedTeammates);

    // --- Handle Validation Cleanup ---
    if (field === "email") {
      if (emailErrors[index]) {
        setEmailErrors((prev) => ({ ...prev, [index]: null }));
      }

      if (!value.trim()) return; // skip if empty
      await revalidateAllEmails(updatedTeammates);
    }

    if (field === "phoneNumber") {
      if (phoneErrors[index]) {
        setPhoneErrors((prev) => ({ ...prev, [index]: null }));
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (value.trim() && !phoneRegex.test(value.trim())) {
        setPhoneErrors((prev) => ({
          ...prev,
          [index]: "Phone number must be exactly 10 digits",
        }));
      } else {
        setPhoneErrors((prev) => ({ ...prev, [index]: null }));
      }
    }
  };

  const validateForm = async () => {
    try {
      // console.log('Validating form with:', { teamSize, teammates: teammates.length, techStack });

      // For teams > 1, validate all teammate fields
      if (teamSize > 1) {
        const requiredFields = [
          "name",
          "degree",
          "yearOfStudy",
          "branch",
          "rollNumber",
          "email",
          "phoneNumber",
        ];
        const allFieldsValid = teammates.every((teammate) => {
          // Check if all required fields are filled
          const allRequiredFilled = requiredFields.every((field) => {
            const value = teammate[field] ? teammate[field].trim() : "";
            return value !== "";
          });

          // Check if college is properly filled (either CBIT selected or custom college provided)
          const collegeValid =
            teammate.collegeType === "CBIT" ||
            (teammate.collegeType === "Other" &&
              teammate.customCollege &&
              teammate.customCollege.trim() !== "");

          const isValid = allRequiredFilled && collegeValid;

          return isValid;
        });

        if (!allFieldsValid) return false;

        // Check if there are any email validation errors
        const hasEmailErrors = Object.values(emailErrors).some(
          (error) => error !== null && error !== undefined
        );
        if (hasEmailErrors) {
          return false;
        }

        // Validate emails
        const teammateEmails = teammates
          .map((t) => t.email)
          .filter((e) => e && e.trim());

        // Get existing teammate emails for exclusion (if in editing mode)
        const existingTeammateEmails =
          initialData && initialData.teammates
            ? initialData.teammates
                .map((t) => t.email)
                .filter((e) => e && e.trim())
            : [];

        const emailValidation = await validateTeamEmails(
          leaderData.email,
          teammateEmails,
          existingTeammateEmails
        );

        if (!emailValidation.isValid) {
          setEmailErrors(emailValidation.teammateErrors || {});
          return false;
        }

        // Clear email errors if validation passes
        setEmailErrors({});

        // Validate phone numbers - check for phone errors
        const hasPhoneErrors = Object.values(phoneErrors).some(
          (error) => error !== null && error !== undefined
        );
        if (hasPhoneErrors) {
          return false;
        }
      }

      // For teams < 3, tech stack is required (at least one option selected)
      if (
        teamSize < 3 &&
        (!Array.isArray(techStack) || techStack.length === 0)
      ) {
        // console.log('Tech stack validation failed:', { teamSize, techStack });
        return false;
      }

      // console.log('Form validation passed');
      return true;
    } catch (error) {
      console.error("Form validation error:", error);
      return false;
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
      // console.log('Scrolling to email error at index:', firstEmailErrorIndex, emailErrors[firstEmailErrorIndex]);
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
      // console.log('Scrolling to phone error at index:', firstPhoneErrorIndex, phoneErrors[firstPhoneErrorIndex]);
      teammateRefs.current[firstPhoneErrorIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return true;
    }

    // If no specific field error found, check if all required fields are filled
    // console.log('No specific error found. Checking teammates:', teammates);
    for (let i = 0; i < teammates.length; i++) {
      const teammate = teammates[i];
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
        // console.log('Found incomplete teammate at index:', i, teammate);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for actual errors (not null values)
    const hasEmailErrors = Object.values(emailErrors).some(
      (error) => error !== null && error !== undefined
    );
    const hasPhoneErrors = Object.values(phoneErrors).some(
      (error) => error !== null && error !== undefined
    );

    // If form has errors, scroll to first error
    if (!isFormValid || hasEmailErrors || hasPhoneErrors) {
      // console.log('Form validation failed:', { isFormValid, hasEmailErrors, hasPhoneErrors, emailErrors, phoneErrors });
      scrollToFirstError();
      return;
    }

    setIsValidatingEmails(true);

    try {
      const isValid = await validateForm();
      if (isValid) {
        onSubmit({
          teammates,
          techStack: teamSize < 3 ? techStack : null,
        });
      } else {
        // console.log('Final validation failed');
        scrollToFirstError();
      }
    } catch (error) {
      console.error("Submit validation error:", error);
    } finally {
      setIsValidatingEmails(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Users className="w-16 h-16 text-[#8A86FF] mx-auto mb-4" />
        <h2
          className="text-2xl font-bold text-white mb-4"
          style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
        >
          {initialData
            ? "Edit Team Details"
            : teamSize === 1
            ? "Additional Information"
            : "Add Teammate Details"}
        </h2>
        <p
          className="text-[#D0CCE3] mb-8"
          style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
        >
          {initialData
            ? "Update your team information below"
            : teamSize === 1
            ? "Complete your solo registration"
            : `Enter details for your ${teamSize - 1} teammate${
                teamSize > 2 ? "s" : ""
              }`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Teammate Details Forms */}
        {teamSize > 1 &&
          teammates.map((teammate, index) => (
            <div
              key={index}
              ref={(el) => (teammateRefs.current[index] = el)}
              className="p-6 rounded-xl border-2 border-[#5E577C] bg-[#403F7D]/30 space-y-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-8 h-8 rounded-full bg-[#8A86FF] flex items-center justify-center text-white font-bold text-sm"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  {index + 1}
                </div>
                <h3
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Teammate {index + 1}
                </h3>
              </div>

              {/* Form Grid for each teammate */}
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

                  {/* College Type Dropdown */}
                  <select
                    value={teammate.collegeType}
                    onChange={(e) =>
                      handleTeammateChange(index, "collegeType", e.target.value)
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

                  {/* Custom College Input - Only show when "Other" is selected */}
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
                    value={teammate.degreeType || ""}
                    onChange={(e) =>
                      handleTeammateChange(index, "degreeType", e.target.value)
                    }
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
                  {teammate.degreeType === "Other" && (
                    <input
                      type="text"
                      value={teammate.customDegree || ""}
                      onChange={(e) =>
                        handleTeammateChange(
                          index,
                          "customDegree",
                          e.target.value
                        )
                      }
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
                      handleTeammateChange(index, "yearOfStudy", e.target.value)
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
                  <label
                    className="flex items-center space-x-2 text-white font-medium text-sm"
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <Book className="w-4 h-4 text-[#C2C2FF]" />
                    <span>Branch/Field of Study *</span>
                  </label>

                  {/* Branch Dropdown */}
                  <select
                    value={teammate.branchType || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updatedTeammates = [...teammates];
                      updatedTeammates[index] = {
                        ...updatedTeammates[index],
                        branchType: value,
                        branch: value === "Other" ? "" : value,
                        customBranch:
                          value === "Other"
                            ? updatedTeammates[index].customBranch
                            : "",
                      };
                      setTeammates(updatedTeammates);
                    }}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white focus:outline-none transition-all duration-300"
                    style={{
                      borderColor: "#5E577C",
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

                  {/* Custom Branch Input - Only show when "Other" is selected */}
                  {teammate.branchType === "Other" && (
                    <input
                      type="text"
                      value={teammate.customBranch || ""}
                      onChange={(e) =>
                        handleTeammateChange(
                          index,
                          "customBranch",
                          e.target.value
                        )
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:border-[#8A86FF] focus:outline-none transition-all duration-300 mt-2"
                      style={{
                        borderColor: "#5E577C",
                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                      }}
                      placeholder="Enter your branch/field of study"
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
                      handleTeammateChange(index, "rollNumber", e.target.value)
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
                        handleTeammateChange(index, "email", e.target.value)
                      }
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 ${
                        emailErrors[index]
                          ? "border-red-400 focus:border-red-400"
                          : "focus:border-[#8A86FF]"
                      }`}
                      style={{
                        borderColor: emailErrors[index] ? "#F87171" : "#5E577C",
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
                      handleTeammateChange(index, "phoneNumber", e.target.value)
                    }
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-[#403F7D] text-white placeholder-[#D0CCE3] focus:outline-none transition-all duration-300 ${
                      phoneErrors[index]
                        ? "border-red-400 focus:border-red-400"
                        : "focus:border-[#8A86FF]"
                    }`}
                    style={{
                      borderColor: phoneErrors[index] ? "#F87171" : "#5E577C",
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

        {/* Tech Stack Field for small teams */}
        {teamSize < 3 && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border-l-4 border-[#8A86FF] bg-[#8A86FF]/10 backdrop-blur-sm">
              <h3
                className="text-[#C2C2FF] font-semibold mb-2 flex items-center space-x-2"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                <Code className="w-5 h-5" />
                <span>Tech Stack of All Your Teammates</span>
              </h3>
              <p
                className="text-[#D0CCE3] text-sm mb-4 leading-relaxed"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Since your team has less than 3 members, please select the
                technical areas you and your teammate(s) are familiar with. This
                will help us match you with compatible teams if needed.
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
                      techStack.includes(option.value)
                        ? "border-[#8A86FF] bg-[#8A86FF]/20 shadow-md"
                        : "border-[#5E577C] bg-[#403F7D]/30 hover:border-[#8A86FF]/50"
                    }`}
                    style={{
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={techStack.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTechStack([...techStack, option.value]);
                        } else {
                          setTechStack(
                            techStack.filter((item) => item !== option.value)
                          );
                        }
                      }}
                      className="w-5 h-5 text-[#8A86FF] bg-[#403F7D] border-[#5E577C] rounded focus:ring-[#8A86FF] focus:ring-2"
                    />
                    <span
                      className={`text-sm font-medium ${
                        techStack.includes(option.value)
                          ? "text-white"
                          : "text-[#D0CCE3]"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {(!techStack || techStack.length === 0) && (
                <p
                  className="text-red-400 text-xs mt-2"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Please select at least one technical area
                </p>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
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
            <span>{initialData ? "Cancel" : "Back to Team Size"}</span>
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
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>
                  {initialData
                    ? "Update Team Details"
                    : "Complete Registration"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeamDetails;
