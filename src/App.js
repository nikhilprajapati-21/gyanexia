import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Competitions from "./pages/Competitions";
import PreviousResults from "./pages/PreviousResults";
import ContactUs from "./pages/ContactUs";
import Sponsors from "./pages/Sponsors";
import Donate from "./pages/Donate";
import ThankYou from "./pages/ThankYou";
//import ClassGraph from "./pages/ClassGraph";

// New Success Page
import RegistrationSuccess from "./pages/RegistrationSuccess";

// Legal Pages
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Disclaimer from "./pages/Disclaimer"; // ✅ Imported Disclaimer page
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/previous-results" element={<PreviousResults />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Legal Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/disclaimer" element={<Disclaimer />} /> {/* ✅ Added new route */}

          {/* ✅ Registration Success Page */}
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
