/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button } from "@/components/ui/button"
// import Background from "./custom_components/Background";
import Hyperspeed from "./components/Hyperspeed";
import { hyperspeedPresets } from './components/HyperSpeedPresets';
import CountUp from './components/CountUp';
import './App.css';

export default function App() {
  return (
    <div className="relative w-full min-h-screen flex justify-center">
      <div className="fixed inset-0">
        <Hyperspeed effectOptions={hyperspeedPresets.four as any} />
      </div>

      <div className="relative flex flex-col items-center z-10 w-[70%] mx-auto px-4 py-8">
        {/* Page content goes here — background is the Hyperspeed canvas */}
        <div className="relative text-white p-5 rounded-lg w-full flex flex-col items-center">
          <div className=" bg-black/90 absolute w-full h-full blur-3xl -z-1"></div>
          <h1 className="text-6xl mb-30 md:text-6xl font-extrabold tracking-wide
  text-white animate-[pulse_8s_ease-in-out_infinite]
  drop-shadow-[0_0_25px_rgba(255,255,255,0.35)] TopHeading">Welcome to <span className="text-cyan-400">Obscura</span></h1>
          <p className="mb-20 Subtext">
            Designed for college students, <span className="text-cyan-400">Obscura</span> offers a secure, <span className="text-red-400">anonymous</span> space to connect and seek support. From interest-based matchmaking and private conversations to access to <span className="text-purple-400">qualified</span> mental health professionals,<span className="text-cyan-400">Obscura</span> helps students build meaningful connections and prioritize well-being <span className="text-red-400">without</span> the pressure of public profiles or <span className="text-red-400">premature identity disclosure</span>.
          </p>

          <CountUp
            from={16341}
            to={68042}
            startWhen
            className="count-up-text"
          />
        </div>
        {/* <Button variant="primary">Get Started</Button> */}
      </div>
    </div>
  );
}
