import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Competitions from "./pages/Competitions";
import PreviousResults from "./pages/PreviousResults";
import ContactUs from "./pages/ContactUs";
import Sponsors from "./pages/Sponsors"; // ✅ Import Sponsors

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/previous-results" element={<PreviousResults />} />
          <Route path="/sponsors" element={<Sponsors />} /> {/* ✅ Add this */}
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
