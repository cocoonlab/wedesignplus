import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, PlayCircle, MapPin, Landmark, 
  ShieldCheck, ArrowUpRight, Download, SlidersHorizontal, ArrowUpDown,
  Sparkles, Globe, Mail, Share, Loader2
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from './lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Types ---
type Page = 'overview' | 'studio' | 'pilot' | 'research';

// --- Components ---

const Navbar = ({ activePage, setPage }: { activePage: Page, setPage: (p: Page) => void }) => (
  <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
    <nav className="flex justify-between items-center w-full px-8 py-6 max-w-[1440px] mx-auto">
      <div className="font-sans font-bold tracking-tight text-primary text-xl cursor-pointer" onClick={() => setPage('overview')}>
        WeDesign+
      </div>
      <div className="hidden md:flex space-x-8">
        {(['overview', 'studio', 'pilot', 'research'] as Page[]).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={cn(
              "text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer pb-1",
              activePage === p 
                ? "text-primary border-b-2 border-primary font-bold" 
                : "text-stone-500 hover:text-primary"
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <button className="bg-primary text-white px-6 py-2 text-sm font-sans uppercase tracking-wider hover:opacity-90 transition-opacity">
        Join Consultation
      </button>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="w-full border-t border-outline-variant/20 bg-surface-container-highest mt-24">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-16 w-full max-w-[1440px] mx-auto">
      <div className="space-y-6">
        <div className="font-serif italic text-2xl text-stone-900">WeDesign+</div>
        <p className="font-sans text-xs uppercase tracking-tighter text-stone-600 leading-relaxed max-w-xs">
          Civic technology for the next generation of participatory urban design. Rebuilding trust through radical visual transparency.
        </p>
      </div>
      <div className="flex flex-col space-y-4">
        <span className="font-sans text-xs uppercase tracking-widest font-bold mb-2">Resources</span>
        <a href="#" className="text-stone-600 text-xs uppercase tracking-tighter hover:text-primary transition-all">Privacy Policy</a>
        <a href="#" className="text-stone-600 text-xs uppercase tracking-tighter hover:text-primary transition-all">Research Papers</a>
        <a href="#" className="text-stone-600 text-xs uppercase tracking-tighter hover:text-primary transition-all">Partners</a>
      </div>
      <div className="space-y-6">
        <span className="font-sans text-xs uppercase tracking-widest font-bold mb-2 block">Location</span>
        <p className="font-sans text-xs uppercase tracking-tighter text-stone-600">
          © 2024 WeDesign+ Civic Consultation. Montreal, QC.
        </p>
        <div className="flex space-x-4 text-stone-500">
          <Globe size={18} className="cursor-pointer hover:text-primary" />
          <Share size={18} className="cursor-pointer hover:text-primary" />
          <Mail size={18} className="cursor-pointer hover:text-primary" />
        </div>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const OverviewPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <section className="pt-24 pb-32 max-w-[1440px] mx-auto px-8">
      <div className="asymmetric-header max-w-4xl">
        <h1 className="text-7xl md:text-8xl italic font-light text-stone-900 leading-tight">
          Visual public consultations <span className="text-primary">shaped by local values.</span>
        </h1>
        <p className="mt-12 text-2xl md:text-3xl font-serif font-light text-stone-600 max-w-2xl leading-relaxed">
          Moving from abstract bureaucratic plans to immediate, tangible visual consensus. We bridge the gap between policy and people.
        </p>
        <div className="mt-16 flex items-center space-x-6">
          <button className="bg-primary text-white px-8 py-4 text-sm font-bold tracking-widest uppercase">Start Exploring</button>
          <div className="flex items-center space-x-3 text-stone-600 group cursor-pointer">
            <PlayCircle className="text-3xl" />
            <span className="font-sans text-sm uppercase tracking-widest group-hover:text-primary transition-colors">See the Pilot</span>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-surface-container-low py-32 px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <span className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-6 block">The Cost of Delay</span>
          <h2 className="text-5xl italic mb-8">The Risk of Abstract Consultation</h2>
          <p className="text-stone-600 text-lg leading-relaxed mb-12">
            Traditional civic engagement happens too late. By the time a project is visualized, decisions are often immutable. This "Consultation Gap" leads to project friction, community resentment, and lost trust.
          </p>
          <div className="bg-white p-12 rounded-xl shadow-sm border border-outline-variant/10">
            <div className="flex items-end justify-between h-48 space-x-4 mb-6">
              <div className="w-full bg-surface-container-high h-[20%] transition-all relative group">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-sans uppercase">Early Concept</div>
              </div>
              <div className="w-full bg-surface-container-high h-[45%] transition-all"></div>
              <div className="w-full bg-primary/40 h-[75%] transition-all"></div>
              <div className="w-full bg-red-600 h-[100%] transition-all relative group">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-sans text-red-600 font-bold uppercase whitespace-nowrap">Max Conflict Risk</div>
              </div>
            </div>
            <div className="flex justify-between font-sans text-[10px] uppercase tracking-widest text-stone-500">
              <span>Stage 1: Ideation</span>
              <span>Stage 4: Implementation</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-square">
          <img 
            className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" 
            src="https://picsum.photos/seed/civic/800/800" 
            alt="Civic visualization"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        </div>
      </div>
    </section>

    <section className="py-32 px-8 max-w-[1440px] mx-auto">
      <div className="text-center mb-24">
        <span className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4 block">The WeDesign+ Methodology</span>
        <h2 className="text-6xl italic">A cycle of clarity.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
        <div className="md:col-span-8 bg-surface-container-low p-12 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-sans mb-8">01</div>
            <h3 className="text-4xl italic mb-4">Describe</h3>
            <p className="text-stone-600 max-w-md">Citizens express their needs in natural language—not technical jargon. We capture the essence of what "home" or "safety" looks like to them.</p>
          </div>
          <img className="w-full h-64 object-cover mt-12 opacity-80" src="https://picsum.photos/seed/workshop/1200/400" alt="Workshop" referrerPolicy="no-referrer" />
        </div>
        <div className="md:col-span-4 bg-primary text-white p-12 flex flex-col justify-between civic-gradient">
          <div>
            <div className="w-12 h-12 bg-white text-primary flex items-center justify-center font-sans mb-8">02</div>
            <h3 className="text-4xl italic mb-4">Generate</h3>
            <p className="text-white/80">Our proprietary model renders high-fidelity visual possibilities in real-time, instantly manifesting civic desires into architectural vistas.</p>
          </div>
          <Sparkles className="w-24 h-24 opacity-20" />
        </div>
        <div className="md:col-span-4 bg-surface-container-highest p-12 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 border border-primary text-primary flex items-center justify-center font-sans mb-8">03</div>
            <h3 className="text-4xl italic mb-4">Debate</h3>
            <p className="text-stone-600">Stakeholders critique visuals, not just documents. The debate moves from speculation to grounded aesthetic and functional feedback.</p>
          </div>
        </div>
        <div className="md:col-span-8 bg-white border border-outline-variant/30 p-12 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="max-w-md">
              <div className="w-12 h-12 bg-tertiary text-white flex items-center justify-center font-sans mb-8">04</div>
              <h3 className="text-4xl italic mb-4">Decide</h3>
              <p className="text-stone-600">Achieve consensus backed by visual proof. We produce a final Consultation Record that serves as a visual mandate for developers.</p>
            </div>
            <div className="text-right">
              <span className="font-sans text-5xl text-tertiary block">92%</span>
              <span className="font-sans text-[10px] uppercase tracking-widest text-stone-500">Approval Rate</span>
            </div>
          </div>
          <div className="mt-8 flex space-x-2">
            <div className="h-2 bg-tertiary flex-1"></div>
            <div className="h-2 bg-tertiary flex-1"></div>
            <div className="h-2 bg-tertiary flex-1"></div>
            <div className="h-2 bg-surface-container-high flex-1"></div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const PilotPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1440px] mx-auto px-8 md:px-24 py-16">
    <section className="mb-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
        <div className="md:col-span-8">
          <h1 className="text-6xl md:text-8xl italic font-light leading-tight mb-8">Pilot: Sainte-Marie (2025)</h1>
          <p className="text-2xl md:text-3xl text-stone-600 max-w-2xl leading-relaxed">
            From first input to shared direction in one workshop cycle. A documentary exploration of civic alignment in Montreal's historic district.
          </p>
        </div>
        <div className="md:col-span-4 pb-4">
          <div className="flex flex-col gap-6 font-sans text-xs uppercase tracking-tighter border-l border-outline-variant/30 pl-8">
            <div>
              <span className="text-stone-400 block mb-1">Location</span>
              <span className="font-bold">Sainte-Marie, Montreal, QC</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-1">Participants</span>
              <span className="font-bold">142 Registered</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-1">Duration</span>
              <span className="font-bold">2 month</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-32 relative group">
      <div className="aspect-[21/9] overflow-hidden bg-surface-container-low">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src="https://picsum.photos/seed/montreal/1600/600" 
          alt="Montreal Street"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 font-sans text-[10px] uppercase tracking-widest">
        Fig 1.1 — The Sainte-Marie Corridor (Phase 0)
      </div>
    </section>

    <section className="mb-48 grid grid-cols-1 md:grid-cols-12 gap-16">
      <div className="md:col-span-5 md:sticky top-32 h-fit">
        <h2 className="font-sans text-4xl font-bold tracking-tighter uppercase mb-6 leading-none">The Human <br/>Perspective.</h2>
        <div className="w-12 h-1 bg-primary mb-8"></div>
        <blockquote className="text-3xl italic leading-snug text-primary mb-8">
          "For the first time, I didn't feel like I was filling out a form. I felt like I was contributing to a story that actually had an ending we all agreed on."
        </blockquote>
        <cite className="font-sans text-sm font-bold uppercase tracking-widest">— MARC-ANDRÉ L., RESIDENT</cite>
      </div>
      <div className="md:col-span-7 space-y-16">
        <div className="space-y-8">
          <p className="text-xl leading-relaxed">
            The Sainte-Marie pilot was designed to test the limits of compressed civic consultation. Traditional methods often stretch across months, leading to participant fatigue and data dilution. WeDesign+ implemented a singular, high-intensity workshop cycle that bridged the gap between abstract planning and local reality.
          </p>
          <p className="text-xl leading-relaxed">
            By utilizing the WeDesign+ Studio environment, residents were able to visualize proposals in real-time, adjusting parameters of public space density and greenery directly on-site via tablet-based AR anchors.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-surface-container-low overflow-hidden">
            <img className="w-full h-full object-cover" src="https://picsum.photos/seed/people1/600/600" alt="Workshop" referrerPolicy="no-referrer" />
          </div>
          <div className="aspect-square bg-surface-container-low overflow-hidden">
            <img className="w-full h-full object-cover" src="https://picsum.photos/seed/ar/600/600" alt="AR Interface" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const ResearchPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1440px] mx-auto px-8 md:px-16 pt-24">
    <header className="mb-32">
      <h1 className="italic text-6xl md:text-8xl text-stone-900 leading-tight max-w-4xl md:pl-[10%]">
        Built with communities, grounded in research.
      </h1>
      <div className="mt-12 flex flex-col md:flex-row gap-12 md:pl-[10%] items-baseline">
        <p className="text-2xl text-stone-600 max-w-xl leading-relaxed">
          Our methodology bridges the gap between large-scale data and hyper-local nuance. By structuring disagreement, we find the path to collective progress.
        </p>
      </div>
    </header>

    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32">
      <div className="md:col-span-8 bg-white p-10 flex flex-col justify-between border border-outline-variant/10">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-primary mb-4 block">Community Evaluation</span>
          <h2 className="text-3xl mb-8">Alignment Gains through Iteration</h2>
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-sans text-sm uppercase">Baseline Sentiment</span>
              <span className="font-sans text-lg">40%</span>
            </div>
            <div className="w-full h-8 bg-surface-container-low overflow-hidden">
              <div className="h-full bg-outline-variant w-[40%]"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-sans text-sm uppercase text-tertiary">Post-Consultation Alignment</span>
              <span className="font-sans text-lg text-tertiary">90%</span>
            </div>
            <div className="w-full h-12 bg-tertiary-container overflow-hidden">
              <div className="h-full bg-tertiary w-[90%]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-4 bg-surface-container-low p-10">
        <span className="font-sans text-xs uppercase tracking-widest text-primary mb-4 block">Identity Matrix</span>
        <h2 className="text-3xl mb-12">Participant Diversity</h2>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={cn("aspect-square bg-primary rounded-full", i % 3 === 0 ? "opacity-100" : "opacity-20")}></div>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="font-sans text-xs uppercase">Representation Index</span>
            <span className="font-sans text-sm font-bold">0.9</span>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-40">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
        <h2 className="text-5xl">Academic Foundation</h2>
        <div className="flex gap-6">
          <a href="https://huggingface.co/datasets/CUPUM/mid-space" target="_blank" rel="noopener noreferrer" className="font-sans text-sm uppercase tracking-widest border-b-2 border-tertiary pb-1 flex items-center gap-2 group">
            Access Mid-Space Dataset
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
      <div className="space-y-16">
        {[
          {
            year: "2025",
            venue: "Conference",
            title: "LIVS: A Pluralistic Alignment Dataset for Inclusive Public Spaces",
            desc: "Introducing the Local Intersectional Visual Spaces (LIVS) dataset, a benchmark for multi-criteria alignment developed through a two-year participatory process.",
            url: "https://proceedings.mlr.press/v267/mushkani25a.html"
          },
          {
            year: "2025",
            venue: "Journal",
            title: "WeDesign: Generative AI-Facilitated Community Consultations for Urban Public Space Design",
            desc: "Examining how generative text-to-image methods integrated into the WeDesign platform support equitable consultations and iterative dialogue.",
            url: "https://arxiv.org/abs/2508.19256"
          },
          {
            year: "2025",
            venue: "Conference",
            title: "Co-Producing AI: Toward an Augmented, Participatory Lifecycle",
            desc: "A fundamental re-architecture of the AI production pipeline centering co-production, diversity, and multidisciplinary collaboration.",
            url: "https://arxiv.org/abs/2508.00138"
          }
        ].map((paper, i) => (
          <a key={i} href={paper.url} target="_blank" rel="noopener noreferrer" className="flex flex-col md:grid md:grid-cols-12 gap-6 group cursor-pointer border-t border-outline-variant/20 pt-8">
            <div className="md:col-span-2">
              <span className="font-sans text-xs uppercase text-stone-400">{paper.venue} / {paper.year}</span>
            </div>
            <div className="md:col-span-7">
              <h3 className="text-3xl mb-4 group-hover:text-primary transition-colors">{paper.title}</h3>
              <p className="font-sans text-sm text-stone-600 max-w-2xl leading-relaxed">{paper.desc}</p>
            </div>
            <div className="md:col-span-3 flex md:justify-end items-center gap-4">
              <span className="font-sans text-xs uppercase tracking-tighter bg-surface-container-high px-3 py-1">Open Access</span>
              <ArrowUpRight size={18} className="text-stone-400 group-hover:text-primary" />
            </div>
          </a>
        ))}
      </div>
    </section>
  </motion.div>
);

const StudioPage = () => {
  const [concepts, setConcepts] = useState([
    { name: 'Concept A: Density+', match: 92, desc: 'Focuses on affordability through maximized living units and communal green roofs.' },
    { name: 'Concept B: Flow State', match: 74, desc: 'Prioritizes mobility networks and bike-priority arteries over total square footage.' },
    { name: 'Concept C: The Canopy', match: 68, desc: 'Maximum environmental cooling through bio-retention swales and full shade cover.' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a new urban design concept for a civic consultation based on this user input: "${userInput}". 
        The project brief is: "Transforming the St. Henri quadrant into a resilient, pedestrian-first ecosystem while preserving historical industrial textures."
        Return a JSON object with:
        - name: A short, catchy name (e.g., "Concept D: [Name]")
        - desc: A one-sentence description.
        - match: A random number between 60 and 95 representing alignment.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              desc: { type: Type.STRING },
              match: { type: Type.NUMBER }
            },
            required: ["name", "desc", "match"]
          }
        }
      });
      const newConcept = JSON.parse(response.text);
      setConcepts([newConcept, ...concepts]);
      setUserInput('');
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-0 overflow-hidden min-h-[calc(100vh-80px)]">
      <aside className="w-full md:w-[320px] bg-surface-container-low p-8 border-r border-outline-variant/20 flex flex-col gap-10">
        <section>
          <div className="flex items-center gap-2 mb-6 text-primary">
            <SlidersHorizontal size={16} />
            <h2 className="font-sans text-xs uppercase tracking-widest font-bold">Resident Priorities</h2>
          </div>
          <div className="space-y-8">
            {['Greening', 'Mobility', 'Affordability', 'Inclusion'].map((label, i) => (
              <div key={label} className="group">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-xs uppercase tracking-tighter text-stone-600">{label}</span>
                  <span className="font-sans text-[10px] text-primary">{[85, 42, 94, 71][i]}%</span>
                </div>
                <div className="w-full h-0.5 bg-outline-variant relative">
                  <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-primary rounded-full" style={{ left: `${[85, 42, 94, 71][i]}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-4 pt-10 border-t border-outline-variant/30">
          <h2 className="font-sans text-xs uppercase tracking-widest font-bold mb-4 opacity-60">Project Brief</h2>
          <div className="italic text-lg leading-relaxed text-stone-600">
            "Transforming the St. Henri quadrant into a resilient, pedestrian-first ecosystem while preserving historical industrial textures."
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-surface-container-highest text-[10px] font-sans uppercase tracking-tighter">Phase 02</span>
            <span className="px-2 py-1 bg-surface-container-highest text-[10px] font-sans uppercase tracking-tighter">Civic Trust</span>
          </div>
        </section>
      </aside>

      <section className="flex-1 bg-surface p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary py-1 px-3 border border-primary/20 rounded-full">Active Simulation</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-500">ID: WH-7720</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-8 leading-[1.1] text-stone-900">
              Courtyard-focused <br/><span className="italic text-primary">comparison</span>
            </h1>
            <div className="relative w-full aspect-[21/9] overflow-hidden rounded-lg group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://picsum.photos/seed/courtyard/1200/600" alt="Courtyard" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="font-sans text-[10px] uppercase tracking-widest opacity-80">Reference Site View</span>
                <p className="text-xl">Plateau North Courtyard Sector</p>
              </div>
            </div>
          </header>

          <div className="mb-12 bg-white p-8 border border-outline-variant/20">
            <h2 className="font-sans text-xs uppercase tracking-widest font-bold mb-4">Describe your vision</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g. Add more vertical gardens and community seating..."
                className="flex-1 bg-surface-container-low px-4 py-3 font-sans text-sm outline-none focus:ring-1 ring-primary/30"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-primary text-white px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {concepts.map((concept, i) => (
              <div key={i} className="group bg-white p-5 border border-outline-variant/10 flex flex-col gap-4 hover:shadow-xl transition-all">
                <div className="relative aspect-square overflow-hidden mb-2">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={`https://picsum.photos/seed/concept${i + (concept.name.length)}/400/400`} alt={concept.name} referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 flex flex-col items-end">
                    <span className={cn("text-white font-sans text-[10px] font-bold px-2 py-1 tracking-tighter", i === 0 ? "bg-tertiary" : "bg-primary")}>{concept.match}% MATCH</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase font-bold tracking-widest mb-1">{concept.name}</h3>
                  <p className="font-sans text-[11px] leading-relaxed text-stone-500">{concept.desc}</p>
                </div>
                <button className="mt-auto py-2 border border-outline-variant/40 text-[10px] uppercase tracking-widest font-bold hover:bg-primary-container transition-colors">Select Plate</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="w-full md:w-[380px] bg-surface-container-low p-8 border-l border-outline-variant/20 flex flex-col gap-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-sans text-xs uppercase tracking-widest font-bold">Priority Ranking</h2>
            <ArrowUpDown size={14} className="text-stone-400" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Affordability', rank: '1st' },
              { label: 'Greening', rank: '2nd' },
              { label: 'Inclusion', rank: '3rd' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <span className="font-sans text-2xl font-light text-primary/30 group-hover:text-primary transition-colors">0{i+1}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-xs uppercase tracking-tight">{item.label}</span>
                    <span className="font-sans text-[10px] font-bold">{item.rank} Rank</span>
                  </div>
                  <div className="w-full h-0.5 bg-outline-variant/20 mt-2">
                    <div className={cn("h-full", i === 0 ? "bg-tertiary w-full" : "bg-primary w-[85%]")}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white p-6 border border-primary/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-tertiary" />
            <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-tertiary">Recommended Direction</h2>
          </div>
          <p className="text-lg leading-snug mb-6">
            Based on local sentiment, <span className="text-stone-900 font-bold">{concepts[0]?.name || 'Concept A'}</span> offers the highest civic alignment by balancing density with essential green space.
          </p>
          <div className="bg-tertiary-container/30 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="font-sans text-[10px] uppercase font-bold text-on-tertiary-container">Civic Consensus</span>
              <span className="font-sans text-[10px] font-bold text-on-tertiary-container">92.4% Aligned</span>
            </div>
            <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-[92.4%]"></div>
            </div>
          </div>
          <button className="w-full mt-8 bg-tertiary text-white py-3 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all">
            Commit To Proposal
          </button>
        </section>
      </aside>
    </motion.div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('overview');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage={page} setPage={setPage} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {page === 'overview' && <OverviewPage key="overview" />}
          {page === 'pilot' && <PilotPage key="pilot" />}
          {page === 'research' && <ResearchPage key="research" />}
          {page === 'studio' && <StudioPage key="studio" />}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
