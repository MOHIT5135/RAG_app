import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import TechStack from "@/components/techStack/TechStack";
import Developers from "@/components/developers/Developers";
import Footer from "@/components/footer/Footer";
import UploadSection from "@/components/upload/UploadSection";

import ChatPage from "@/pages/ChatPage";

function HomePage() {

  const location = useLocation();

  useEffect(() => {

    if (location.state?.scrollToUpload) {

      document
        .getElementById("upload")
        ?.scrollIntoView({
          behavior: "smooth",
        });

      // Clear the navigation state
      window.history.replaceState({}, document.title);

    }

  }, [location]);

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <TechStack />
        <Developers />
        <UploadSection />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/chat"
        element={<ChatPage />}
      />
    </Routes>
  );
}

export default App;