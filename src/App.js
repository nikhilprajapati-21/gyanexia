import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Competitions from "./pages/Competitions";
import PreviousResults from "./pages/PreviousResults";
import ContactUs from "./pages/ContactUs";
import Sponsors from "./pages/Sponsors";
import Donate from "./pages/Donate";
import ThankYou from "./pages/ThankYou";
import RegistrationSuccess from "./pages/RegistrationSuccess";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Disclaimer from "./pages/Disclaimer";

import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import RoleRoute from "./components/RoleRoute";
import StudentCompetitionDetails from "./pages/StudentCompetitionDetails";
import AdminQueries from "./pages/AdminQueries";


function App() {
  return (
    <Router>

      <Layout>

        <Routes>

          {/* ==========================================
              PUBLIC PAGES
          ========================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/competitions"
            element={<Competitions />}
          />

          <Route
            path="/previous-results"
            element={<PreviousResults />}
          />

          <Route
            path="/sponsors"
            element={<Sponsors />}
          />

          <Route
            path="/contact"
            element={<ContactUs />}
          />

          <Route
            path="/donate"
            element={<Donate />}
          />

          <Route
            path="/thank-you"
            element={<ThankYou />}
          />


          {/* ==========================================
              AUTHENTICATION
          ========================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/student/register"
            element={<StudentRegister />}
          />


          {/* ==========================================
              STUDENT DASHBOARD
              
              ONLY STUDENTS
          ========================================== */}

          <Route
            path="/student/dashboard"
            element={
              <RoleRoute
                allowedRoles={["student"]}
              >
                <StudentDashboard />
              </RoleRoute>
            }
          />


               <Route
  path="/student/competition/:id"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <StudentCompetitionDetails />
    </RoleRoute>
  }
/>

          {/* ==========================================
              ADMIN DASHBOARD
              
              ADMIN + SUPERADMIN
          ========================================== */}

          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute
                allowedRoles={[
                  "admin",
                  "superadmin",
                ]}
              >
                <AdminDashboard />
              </RoleRoute>
            }
          />
           

           <Route
  path="/admin/queries"
  element={<AdminQueries />}
/>

          {/* ==========================================
              REGISTRATION
          ========================================== */}

          <Route
            path="/registration-success"
            element={
              <RegistrationSuccess />
            }
          />


          {/* ==========================================
              LEGAL PAGES
          ========================================== */}

          <Route
            path="/terms"
            element={<Terms />}
          />

          <Route
            path="/privacy"
            element={<Privacy />}
          />

          <Route
            path="/refund"
            element={<Refund />}
          />

          <Route
            path="/disclaimer"
            element={<Disclaimer />}
          />

        </Routes>

      </Layout>

    </Router>
  );
}

export default App;