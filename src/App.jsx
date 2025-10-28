// App.jsx
import { Routes, Route, Link } from "react-router-dom";
import PreptemberPage from "./preptemberComponents/PreptemberPage";
import Home from "./pages/Home";
import RegistrationsClosed from "./pages/RegistrationsClosed";
import FeedbackForm from "./components/FeedbackForm";
import Footer from "./components/Footer"
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preptember" element={<PreptemberPage />} />
        <Route path="/register" element={<RegistrationsClosed />} />
        <Route path="/signin" element={<RegistrationsClosed />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/registration-success" element={<RegistrationsClosed />} />
        <Route path="/edit-team-details" element={<RegistrationsClosed />} />
      </Routes>
      <div className="relative z-30">
        <Footer />
      </div>
    </>
  );
}

export default App;