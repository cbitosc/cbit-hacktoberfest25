import React, { useState, useEffect, useRef } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { checkEmailUniqueness } from "../services/emailValidationService";
import { FcGoogle } from "react-icons/fc";
import {
  ArrowRight,
  Sparkles,
  Users,
  Mail,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { StarsBackground } from "../components/ui/stars-background";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;
    const colors = ["#8A86FF", "#C2C2FF", "#A0A0FF", "#5A5AB5", "#403F7D"];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        p.phase += p.pulse;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Pulsing effect
        const pulsedRadius = p.radius + Math.sin(p.phase) * 0.8;
        const pulsedOpacity = p.opacity + Math.sin(p.phase) * 0.3;

        // Draw outer glow
        ctx.save();
        ctx.globalAlpha = pulsedOpacity * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedRadius * 3, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();

        // Draw particle
        ctx.save();
        ctx.globalAlpha = pulsedOpacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedRadius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const distance = Math.hypot(p.x - other.x, p.y - other.y);
          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = ((120 - distance) / 120) * 0.2;
            ctx.strokeStyle = "#C2C2FF";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.restore();
          }
        });
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // console.log("User signed in:", user.email);

      // Check if email is already registered
      const emailCheck = await checkEmailUniqueness(user.email);
      if (!emailCheck.isUnique) {
        const existingUser = emailCheck.existingUser;

        // Registration/editing is closed, but existing users can access problem statements
        // Redirect directly to problem statements regardless of role
        console.log("Existing user found, redirecting to problem statements");
        navigate("/prob");
        return;
      }

      // Email is not registered and registration is closed
      setError(
        "Registration period has ended. Only registered participants can sign in to access problem statements."
      );

      // Sign out the user since they can't proceed
      await auth.signOut();
    } catch (error) {
      console.error("Sign-in error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        setError(
          "Pop-up was blocked by your browser. Please allow pop-ups and try again."
        );
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              textShadow: "0 0 20px rgba(194, 194, 255, 0.5)",
            }}
          >
            Welcome to CBIT Hacktoberfest 2025
          </h1>
          <p
            className="text-lg opacity-90"
            style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              color: "#D0CCE3",
            }}
          >
            Sign in to access problem statements
          </p>
          
          {/* Registration Status Notice */}
          <div
            className="mt-4 p-3 rounded-lg border"
            style={{
              backgroundColor: "rgba(255, 193, 7, 0.1)",
              borderColor: "#FFC107",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{
                color: "#FFE082",
                fontFamily: "'Atkinson Hyperlegible', sans-serif",
              }}
            >
              ⚠️ New registrations and team editing are closed. Problem selection is still open for registered participants.
            </p>
          </div>
        </div>

        {/* Sign In Card */}
        <div
          className="backdrop-blur-xl border-2 rounded-2xl p-8 shadow-2xl relative group hover:scale-[1.02] transition-all duration-300"
          style={{
            backgroundColor: "rgba(28, 28, 63, 0.85)",
            borderColor: "#8A86FF",
            boxShadow:
              "0 0 30px rgba(138, 134, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Sparkle decoration */}
          {/* <div className="absolute -top-3 -right-3">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div> */}

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg border text-left"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "#EF4444",
                color: "#FCA5A5",
              }}
            >
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">{error}</div>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="cursor-pointer w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#1C1C3F",
              border: "2px solid #8A86FF",
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
            }}
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 -translate-x-full group-hover:translate-x-full" />

            <FcGoogle className="w-6 h-6 flex-shrink-0" />
            <span className="text-lg">
              {isLoading ? "Signing in..." : "Continue with Google"}
            </span>
            <ArrowRight
              className={`w-5 h-5 transition-transform duration-300 ${
                isLoading ? "animate-pulse" : "group-hover:translate-x-1"
              }`}
            />
          </button>

          {/* Info Section */}
          <div className="mt-8 space-y-4">
            <div
              className="flex items-start space-x-3 p-4 rounded-lg"
              style={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}
            >
              <AlertTriangle className="w-5 h-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
              <div>
                <p
                  className="text-white font-semibold mb-1"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Registration & Editing Closed
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: "#FFE082",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  New team registrations and editing existing team details are no longer available. Only registered participants can sign in.
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3 p-4 rounded-lg"
              style={{ backgroundColor: "rgba(138, 134, 255, 0.1)" }}
            >
              <UserCheck className="w-5 h-5 text-[#C2C2FF] flex-shrink-0 mt-0.5" />
              <div>
                <p
                  className="text-white font-semibold mb-1"
                  style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
                >
                  Problem Statement Access
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: "#D0CCE3",
                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                  }}
                >
                  Registered participants can access and select problem statements. Team leaders and members both have access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-8">
          <p
            className="text-sm opacity-75"
            style={{
              color: "#D0CCE3",
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
            }}
          >
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </div> */}
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

export default SignIn;
