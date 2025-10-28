import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { StarsBackground } from "./ui/stars-background";
import {
  Send,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Users,
  Award,
  Heart,
} from "lucide-react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    participantName: "",
    email: "",
    feedback: {
      experience: "",
      suggestions: "",
      highlights: "",
    },
    ratings: {
      organization: 0,
      problemStatements: 0,
      mentorship: 0,
      overallExperience: 0,
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic field validation
    if (!formData.participantName.trim()) {
      newErrors.participantName = "Participant name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Feedback validation - only first question is mandatory
    if (!formData.feedback.experience.trim()) {
      newErrors.experience = "Please share your experience";
    }

    // Rating validation
    const ratingFields = ['organization', 'problemStatements', 'mentorship', 'overallExperience'];
    ratingFields.forEach(field => {
      if (formData.ratings[field] === 0) {
        newErrors[field] = "Please provide a rating";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkDuplicateSubmission = async () => {
    try {
      // Check for duplicate email
      const emailQuery = query(
        collection(db, "feedback"),
        where("email", "==", formData.email.toLowerCase())
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        return "A feedback submission already exists for this email address.";
      }

      return null;
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return "Error checking submission status. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage("Please fix the errors above and try again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Check for duplicate submissions
      const duplicateError = await checkDuplicateSubmission();
      if (duplicateError) {
        setSubmitMessage(duplicateError);
        setIsSubmitting(false);
        return;
      }

      // Submit to Firestore
      const feedbackData = {
        participantName: formData.participantName.trim(),
        email: formData.email.toLowerCase().trim(),
        feedback: {
          experience: formData.feedback.experience.trim(),
          suggestions: formData.feedback.suggestions.trim(),
          highlights: formData.feedback.highlights.trim(),
        },
        ratings: formData.ratings,
        submittedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "feedback"), feedbackData);

      setIsSubmitted(true);
      setSubmitMessage("Thank you for your feedback! Your submission has been recorded.");
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitMessage("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleFeedbackChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleRatingChange = (field, rating) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [field]: rating
      }
    }));
    
    // Clear error when user selects a rating
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const StarRating = ({ field, label, value, onChange, error, icon: Icon }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6 text-[#8A86FF]" />
        <label 
          className="text-base font-medium text-white"
          style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
        >
          {label}
        </label>
      </div>
      <div className="flex space-x-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(field, star)}
            disabled={isSubmitted}
            className={`p-3 rounded-lg transition-all duration-200 ${
              star <= value
                ? "text-yellow-400 bg-yellow-400/20"
                : "text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/10"
            } ${isSubmitted ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <Star 
              className={`w-7 h-7 ${star <= value ? "fill-current" : ""}`} 
            />
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-2" style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );

  if (isSubmitted) {
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

        {/* Success Message */}
        <div className="relative z-10 w-full max-w-2xl mx-auto">
          <div
            className="backdrop-blur-xl border-2 rounded-2xl p-8 sm:p-12 shadow-2xl text-center"
            style={{
              backgroundColor: "rgba(28, 28, 63, 0.95)",
              borderColor: "#8A86FF",
              boxShadow:
                "0 0 40px rgba(138, 134, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" 
                style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
                textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
              }}
            >
              Feedback Submitted!
            </h1>
            <p
              className="text-lg text-[#D0CCE3] leading-relaxed"
              style={{
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
              }}
            >
              {submitMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden px-4 pt-24 pb-12 sm:pt-28 sm:pb-16"
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
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
            }}
          >
            Event Feedback
          </h1>
          <p
            className="text-lg text-[#D0CCE3] leading-relaxed"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
            }}
          >
            Help us improve future events by sharing your experience
          </p>
        </div>

        {/* Form Card */}
        <div
          className="backdrop-blur-xl border-2 rounded-2xl p-6 sm:p-10 shadow-2xl"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.95)",
            borderColor: "#8A86FF",
            boxShadow:
              "0 0 40px rgba(138, 134, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Ratings Section - Moved to top */}
            <div className="space-y-8">
              <h2
                className="text-2xl font-bold text-white mb-8"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Rate Your Experience
              </h2>
              <p 
                className="text-base text-[#D0CCE3] leading-relaxed mb-8 -mt-4"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Please rate each aspect of the event from 1 (poor) to 5 (excellent).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <StarRating
                  field="organization"
                  label="Event Organization"
                  value={formData.ratings.organization}
                  onChange={handleRatingChange}
                  error={errors.organization}
                  icon={Users}
                />

                <StarRating
                  field="problemStatements"
                  label="Problem Statements"
                  value={formData.ratings.problemStatements}
                  onChange={handleRatingChange}
                  error={errors.problemStatements}
                  icon={MessageSquare}
                />

                <StarRating
                  field="mentorship"
                  label="Mentorship & Support"
                  value={formData.ratings.mentorship}
                  onChange={handleRatingChange}
                  error={errors.mentorship}
                  icon={Award}
                />

                <StarRating
                  field="overallExperience"
                  label="Overall Experience"
                  value={formData.ratings.overallExperience}
                  onChange={handleRatingChange}
                  error={errors.overallExperience}
                  icon={Heart}
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold text-white mb-8"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Your Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Participant Name */}
                <div className="space-y-3">
                  <label 
                    className="block text-base font-medium text-white"
                    style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.participantName}
                    onChange={(e) => handleInputChange("participantName", e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 rounded-lg border-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A86FF] transition-all duration-200 text-base"
                    style={{
                      borderColor: errors.participantName ? "#EF4444" : "rgba(138, 134, 255, 0.3)",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter your full name"
                  />
                  {errors.participantName && (
                    <p className="text-red-400 text-sm mt-2" style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
                      {errors.participantName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label 
                    className="block text-base font-medium text-white"
                    style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 rounded-lg border-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A86FF] transition-all duration-200 text-base"
                    style={{
                      borderColor: errors.email ? "#EF4444" : "rgba(138, 134, 255, 0.3)",
                      fontFamily: "'Atkinson Hyperlegible', sans-serif",
                    }}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2" style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Questions */}
            <div className="space-y-8">
              <h2
                className="text-2xl font-bold text-white mb-8"
                style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
              >
                Share Your Feedback
              </h2>

              {/* Experience - Mandatory */}
              <div className="space-y-4">
                <label 
                  className="block text-base font-medium text-white leading-relaxed"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  How was your overall experience at CBIT Hacktoberfest 2025? *
                </label>
                <textarea
                  value={formData.feedback.experience}
                  onChange={(e) => handleFeedbackChange("experience", e.target.value)}
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-5 py-4 rounded-lg border-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A86FF] transition-all duration-200 resize-vertical text-base leading-relaxed"
                  style={{
                    borderColor: errors.experience ? "#EF4444" : "rgba(138, 134, 255, 0.3)",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                  placeholder="Tell us about what you enjoyed most and how the event met your expectations..."
                />
                {errors.experience && (
                  <p className="text-red-400 text-sm mt-2" style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
                    {errors.experience}
                  </p>
                )}
              </div>

              {/* Suggestions & Improvements - Merged */}
              <div className="space-y-4">
                <label 
                  className="block text-base font-medium text-white leading-relaxed"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  What suggestions or improvements do you have for future events?
                </label>
                <textarea
                  value={formData.feedback.suggestions}
                  onChange={(e) => handleFeedbackChange("suggestions", e.target.value)}
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-5 py-4 rounded-lg border-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A86FF] transition-all duration-200 resize-vertical text-base leading-relaxed"
                  style={{
                    borderColor: "rgba(138, 134, 255, 0.3)",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                  placeholder="Share your ideas for making future hackathons even better, or tell us about any challenges you faced or areas that could be enhanced..."
                />
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <label 
                  className="block text-base font-medium text-white leading-relaxed"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  What were the highlights of the event for you?
                </label>
                <textarea
                  value={formData.feedback.highlights}
                  onChange={(e) => handleFeedbackChange("highlights", e.target.value)}
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-5 py-4 rounded-lg border-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A86FF] transition-all duration-200 resize-vertical text-base leading-relaxed"
                  style={{
                    borderColor: "rgba(138, 134, 255, 0.3)",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                  placeholder="Share the most memorable moments, sessions, or aspects of the event..."
                />
              </div>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-5 rounded-xl border-2 flex items-start space-x-4 ${
                  submitMessage.includes("Thank you") || submitMessage.includes("Success")
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                {submitMessage.includes("Thank you") || submitMessage.includes("Success") ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-base leading-relaxed ${
                    submitMessage.includes("Thank you") || submitMessage.includes("Success")
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  {submitMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                style={{
                  backgroundColor: "#8A86FF",
                  color: "#FFFFFF",
                  fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  boxShadow: "0 0 20px rgba(138, 134, 255, 0.4)",
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;