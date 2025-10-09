import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Competitions from "./pages/Competitions";
import PreviousResults from "./pages/PreviousResults";
import ContactUs from "./pages/ContactUs";
import Sponsors from "./pages/Sponsors";

// ✅ Import new legal pages
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";

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

          {/* ✅ Legal Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;