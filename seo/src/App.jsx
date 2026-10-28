import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import RadarClients from "./components/RadarClients/RadarClients";
import CrowdBuyers from "./components/CrowdBuyers/CrowdBuyers";
import Channels from "./components/Channels/Channels";
import CaseStudies from "./components/CaseStudies/CaseStudies";
import FunnelProcess from "./components/FunnelProcess/FunnelProcess";
import BlogInsights from "./components/BlogInsights/BlogInsights";
import "./App.css";

function App() {
  return (
    <div className="seo-portfolio-wrapper">
      {/* Top Floating Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main>
        {/* Section 1: Hero */}
        <Hero />

        {/* Section 2: Clients on Radar */}
        <RadarClients />

        {/* Section 3: Why Reachwise / Crowd Buyers */}
        <CrowdBuyers />

        {/* Section 4: Six channels. One growth plan. */}
        <Channels />

        {/* Section 5: Results you can count. (Before/After Slider) */}
        <CaseStudies />

        {/* Section 6: From attention to clients. (Conversion Funnel) */}
        <FunnelProcess />

        {/* Section 7: Ideas we test first. (Blog & Insights) */}
        <BlogInsights />
      </main>
    </div>
  );
}

export default App;
