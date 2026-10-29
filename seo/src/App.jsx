import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import RadarClients from "./components/RadarClients/RadarClients";
import CrowdBuyers from "./components/CrowdBuyers/CrowdBuyers";
import Channels from "./components/Channels/Channels";
import FunnelProcess from "./components/FunnelProcess/FunnelProcess";
import CaseStudies from "./components/CaseStudies/CaseStudies";
import BlogInsights from "./components/BlogInsights/BlogInsights";
import SeoProcess from "./components/SeoProcess/SeoProcess";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="seo-portfolio-wrapper">
      {/* Top Floating Glassmorphic Navbar */}
      <Navbar />

      {/* Main Sequential Portfolio Sections (PAGE 01 to 07 in exact order) */}
      <main>
        {/* Hero with Spotlight */}
        <Hero />

        {/* PAGE 01: Project Overview & SEO Objective */}
        <RadarClients />

        {/* PAGE 02: Local SEO Strategy (Alwar) */}
        <CrowdBuyers />

        {/* PAGE 03: SEO Strategy (Six Core Pillars) */}
        <Channels />

        {/* PAGE 04: SEO Implementation (Search Intent → Organic Growth) */}
        <FunnelProcess />

        {/* PAGE 05: SEO Results & Visibility */}
        <CaseStudies />

        {/* PAGE 06: SEO Strategy Deep-Dive */}
        <BlogInsights />

        {/* PAGE 07: SEO Implementation / Step by Step Process */}
        <SeoProcess />
      </main>

      {/* PAGE 08: Footer / Final CTA */}
      <Footer />
    </div>
  );
}

export default App;
