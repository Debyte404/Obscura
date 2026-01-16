"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import CircularText from "@/components/CircularText";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-[#0a0a0f] to-[#111112] text-gray-200 font-mono flex flex-col items-center px-4 py-16 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* ASCII Header */}
      <pre className="text-cyan-400 text-[9.5px] sm:text-[16px] mb-6 text-center leading-5 select-none font-bold">
{String.raw`
  $$$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$\   $$$$$$\  
  $$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\ $$ |  $$ |$$  __$$\ $$  __$$\ 
  $$ /  $$ |$$ |  $$ |$$ /  \__|$$ /  \__|$$ |  $$ |$$ |  $$ |$$ /  $$ |
  $$ |  $$ |$$$$$$$\ |\$$$$$$\  $$ |      $$ |  $$ |$$$$$$$  |$$$$$$$$ |
  $$ |  $$ |$$  __$$\  \____$$\ $$ |      $$ |  $$ |$$  __$$< $$  __$$ |
  $$ |  $$ |$$ |  $$ |$$\   $$ |$$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |  $$ |
  $$$$$$  |$$$$$$$  |\$$$$$$  |\$$$$$$  |\$$$$$$  |$$ |  $$ |$$ |  $$ |
  \______/ \_______/  \______/  \______/  \______/ \__|  \__|\__|  \__|
                                                                        
      
                                                     
`}
      </pre>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-5xl font-bold text-center text-cyan-400 mb-6 font-doto"
      >
        Obscura — Built by Team Syntax Error
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl text-center text-gray-400 mb-10 leading-relaxed"
      >
        <span className="text-cyan-400 font-semibold text-lg">Obscura</span> is a mental health community platform built for 
        <span className="text-cyan-300"> GDG Hackathon 2026</span>. We believe everyone deserves a safe, anonymous space 
        to connect with people who truly understand them. By combining <span className="text-cyan-400">Gemini AI </span> 
        with anonymous matchmaking and ephemeral support sessions, we're breaking the barriers of traditional social interaction.
      </motion.p>

      <div className="my-12">
        <CircularText
            text="connect*share*heal*"
            onHover="slowDown"
            spinDuration={20}
            className="mb-3"
            />
        </div>

      {/* Team Section */}
      <div className="w-full max-w-5xl text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4 font-doto">👨‍💻 Team Syntax Error</h2>
        <p className="text-gray-400 mb-6 italic">
          "Building bridges across the digital abyss."
        </p>

        <div className="w-full flex justify-center mb-8 px-4">
          <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden border border-cyan-700/40 shadow-2xl shadow-cyan-500/10 group">
             <Image
                src="/Group.jpeg" 
                alt="Team Syntax Error Creative Concept"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                 <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase">Conceptual Visualization</p>
                 <p className="text-white/60 text-xs">A peek into the anonymous builders of Obscura</p>
              </div>
          </div>
        </div>
      </div>

      {/* Build Stack Section */}
      <Card className="bg-[#151515]/70 border border-cyan-700/30 w-full max-w-4xl backdrop-blur-md">
        <CardContent className="p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-6 text-center font-doto">
            🛠️ Mission & Tech
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h3 className="text-cyan-300 font-bold uppercase text-xs tracking-widest">Our Mission</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    To eliminate the loneliness epidemic by providing a judgment-free zone where technology serves humanity. 
                    Obscura ensures your data and your identity remain yours through strict ephemerality and anonymous architecture.
                </p>
             </div>
             <div className="space-y-4">
                <h3 className="text-cyan-300 font-bold uppercase text-xs tracking-widest">The Stack</h3>
                <ul className="grid grid-cols-1 gap-2 text-gray-300 text-sm font-mono">
                    <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Next.js 15 (App Router)</li>
                    <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Gemini 2.5 Flash API</li>
                    <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> MongoDB Atlas</li>
                    <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> DiceBear API</li>
                    <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Tailwind + ShadCN UI</li>
                </ul>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-16 text-center text-[10px] text-gray-600 uppercase tracking-[0.2em]">
        <p>
          Finalist Entry | GDG Hackathon 2026 | Built with 💜 by Syntax Error
        </p>
      </div>
    </main>
  );
}
