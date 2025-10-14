// App.jsx
import { Routes, Route, Link } from "react-router-dom";
import PreptemberPage from "./preptemberComponents/PreptemberPage";
import Home from "./pages/Home";
import About from "./components/About";
import Mentors from "./components/Mentors";
import ProbStatements from "./components/ProbStatements"; 
import PrepSection from "./preptemberComponents/PrepSection";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import TeamPage from "./pages/TeamPage";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import EditTeamDetails from "./pages/EditTeamDetails";
import Footer from "./components/Footer"
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/navbar" element={<Navbar/>}/>
        <Route path="/Footer" element={<Footer/>}/> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/prob" element={<ProbStatements />} /> */}
        <Route path="/preptember" element={<PreptemberPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/edit-team-details" element={<EditTeamDetails />} />
        {/* <Route path="/team"element={<ProtectedRoute><TeamPage /></ProtectedRoute>}/> */}
        {/* <Route path="/prepSection" element={<PrepSection />} /> */}
      </Routes>
      <div className="relative z-30">
        <Footer />
      </div>
    </>
  );
}

export default App;
