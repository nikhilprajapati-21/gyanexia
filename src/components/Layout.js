// src/components/Layout.js

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIAssistant from "./AIAssistant";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

      {/* ==========================================
          GLOBAL GYANEXIA AI ASSISTANT
          Available across the entire website
      ========================================== */}

      <AIAssistant />
    </>
  );
};

export default Layout;