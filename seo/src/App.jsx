import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import CrowdBuyers from "./components/CrowdBuyers/CrowdBuyers";
import Channels from "./components/Channels/Channels";
import RadarClients from "./components/RadarClients/RadarClients";
import CaseStudies from "./components/CaseStudies/CaseStudies";
import FunnelProcess from "./components/FunnelProcess/FunnelProcess";
import BlogInsights from "./components/BlogInsights/BlogInsights";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="seo-portfolio-wrapper">
      {/* Top Floating Glassmorphic Navbar */}
      <Navbar />

      {/* Main Sequential Portfolio Sections (01 to 06 in exact order) */}
      <main>
        {/* Hero with Spotlight & Crowd */}
        <Hero />

        {/* 01: Why Reachwise / Crowd & Buyers */}
        <CrowdBuyers />

        {/* 02: Six channels. One growth plan. */}
        <Channels />

        {/* 03: Clients on Radar */}
        <RadarClients />

        {/* 04: Results you can count (Split Slider) */}
        <CaseStudies />

        {/* 05: From attention to clients (Conversion Funnel) */}
        <FunnelProcess />

        {/* 06: Ideas we test first (Blog & Insights) */}
        <BlogInsights />
      </main>

      {/* Giant Wordmark Editorial Footer */}
      <Footer />
    </div>
  );
}

export default App;
