import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import CrowdBuyers from "./components/CrowdBuyers/CrowdBuyers";
import RadarClients from "./components/RadarClients/RadarClients";
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
      </main>
    </div>
  );
}

export default App;
