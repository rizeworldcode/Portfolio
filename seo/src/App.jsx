import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import RadarClients from "./components/RadarClients/RadarClients";
import CrowdBuyers from "./components/CrowdBuyers/CrowdBuyers";
import Channels from "./components/Channels/Channels";
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

      {/* Main Sequential Portfolio Sections */}
      <main>
        {/* 01: Hero with Spotlight & Radar */}
        <Hero />

        {/* 02: Clients on Radar */}
        <RadarClients />

        {/* 03: Why Reachwise / Crowd Buyers */}
        <CrowdBuyers />

        {/* 04: Six channels. One growth plan. */}
        <Channels />

        {/* 05: Results you can count (Split Slider) */}
        <CaseStudies />

        {/* 06: From attention to clients (Conversion Funnel) */}
        <FunnelProcess />

        {/* 13: Ideas we test first (Blog & Insights) */}
        <BlogInsights />
      </main>

      {/* 15: Giant Wordmark Editorial Footer */}
      <Footer />
    </div>
  );
}

export default App;
