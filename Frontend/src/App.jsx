import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import TechStack from "@/components/techStack/TechStack";
import Developers from "@/components/developers/Developers";
import Footer from "@/components/footer/Footer";

function App() {
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
      </main>

      <Footer />
    </>
  );
}

export default App;