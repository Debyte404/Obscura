/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button } from "@/components/ui/button"
// import Background from "./custom_components/Background";
import Hyperspeed from "./components/Hyperspeed";
import { hyperspeedPresets } from './components/HyperSpeedPresets';

export default function App() {
  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0">
        <Hyperspeed effectOptions={hyperspeedPresets.four as any} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Page content goes here — background is the Hyperspeed canvas */}
        
        {/* <Button variant="primary">Get Started</Button> */}
      </div>
    </div>
  );
}
