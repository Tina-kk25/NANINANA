import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Award, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Lock, 
  Terminal, 
  Compass, 
  Volume2, 
  VolumeX, 
  FileText, 
  Star, 
  RefreshCw,
  Clock,
  UserCheck,
  Plus
} from 'lucide-react';

interface Mission {
  id: string;
  code: string;
  title: string;
  category: string;
  difficulty: string;
  xp: number;
  time: string;
  desc: string;
  intel: string;
  tag: string;
  icon: string;
}

interface CompletedMission {
  id: string;
  code: string;
  title: string;
  completedAt: string;
  xpEarned: number;
  debrief: string;
  rating: number;
  photoUrl: string | null;
}

const MISSIONS_POOL: Mission[] = [
  {
    id: 'm-001',
    code: 'MISSION 001',
    title: 'Hydration Intel Briefing',
    category: 'Habit',
    difficulty: 'Easy',
    xp: 50,
    time: '2 mins',
    desc: 'Drink a glass of water slowly while holding eye contact with an imaginary high-tech briefing screen. Pause for dramatic effect after every sip.',
    intel: 'Proper hydration increases cognitive processing by 15%. Stay sharp, Agent.',
    tag: 'Health & Vitality',
    icon: 'droplet'
  },
  {
    id: 'm-002',
    code: 'MISSION 002',
    title: 'Shadow Surveillance Protocol',
    category: 'Observation',
    difficulty: 'Medium',
    xp: 120,
    time: '10 mins',
    desc: 'Identify and photograph 3 geometrically intriguing shadows in your current location without looking suspicious to bystanders.',
    intel: 'The ambient light reveals hidden patterns in mundane architecture.',
    tag: 'Mindfulness',
    icon: 'eye'
  },
  {
    id: 'm-003',
    code: 'MISSION 003',
    title: 'Café Infiltration Task',
    category: 'Micro-Adventure',
    difficulty: 'Hard',
    xp: 200,
    time: '30 mins',
    desc: 'Enter an unfamiliar coffee shop or venue. Order a beverage or item you have never tried before. Record its flavor profile in field notes.',
    intel: 'Routine leads to predictability. A real agent thrives in novel environments.',
    tag: 'Exploration',
    icon: 'coffee'
  },
  {
    id: 'm-004',
    code: 'MISSION 004',
    title: 'Covert Gratitude Transmission',
    category: 'Gratitude',
    difficulty: 'Easy',
    xp: 80,
    time: '5 mins',
    desc: 'Send a discrete, heartfelt compliment to an ally (friend/colleague) out of the blue, disguised as a secret appreciation dispatch.',
    intel: 'Boosting ally morale strengthens the entire global network.',
    tag: 'Social Intelligence',
    icon: 'heart'
  },
  {
    id: 'm-005',
    code: 'MISSION 005',
    title: 'Posture Reset Maneuver',
    category: 'Habit',
    difficulty: 'Easy',
    xp: 60,
    time: '1 min',
    desc: 'Align your spine like an elite bodyguard on high alert. Take 3 deep tactical breaths before continuing your task.',
    intel: 'Posture dictates presence. Command the room at all times.',
    tag: 'Physical Ready State',
    icon: 'shield'
  },
  {
    id: 'm-006',
    code: 'MISSION 006',
    title: 'Analog Detonation Clearance',
    category: 'Observation',
    difficulty: 'Medium',
    xp: 150,
    time: '15 mins',
    desc: 'Leave all electronic communication devices in your secure locker (or pocket on silent) and take a 15-minute perimeter walk.',
    intel: 'Digital silence enhances acoustic awareness by 40%.',
    tag: 'Digital Detox',
    icon: 'zap'
  }
];

const INITIAL_ARCHIVE: CompletedMission[] = [
  {
    id: 'm-000',
    code: 'MISSION 000',
    title: 'Agent Orientation & Initiation',
    completedAt: '2025-05-10',
    xpEarned: 100,
    debrief: 'Successfully accepted secret agent badge. Environment scanned and secured.',
    rating: 5,
    photoUrl: null
  }
];

const AGENT_DIALOGUES = {
  idle: [
    "Psst... Agent! The world is full of hidden codes waiting to be cracked.",
    "Stay sharp. The ordinary is just extraordinary wearing a disguise.",
    "What's our move today? HQ is waiting for your field report.",
    "NANINANA on duty! Tap me if you need tactical inspiration."
  ],
  missionAccepted: [
    "Affirmative! Mission accepted. Execute with stealth and finesse!",
    "Target locked! Do not leave any evidence... except cute notes.",
    "Operation activated! May the stealth be with you, Agent."
  ],
  missionCompleted: [
    "Outstanding work, Agent! Intel logged and encrypted successfully!",
    "XP secured! That was smooth covert execution.",
    "HQ is thoroughly impressed. Badge progress updated!"
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'briefing' | 'generator' | 'dossier'>('briefing');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [agentMood, setAgentMood] = useState<'idle' | 'excited' | 'operational' | 'proud'>('idle');
  const [speechBubble, setSpeechBubble] = useState("Greetings Agent! I'm NANINANA 007. Ready for your daily assignment?");
  
  const [activeMissions, setActiveMissions] = useState<Mission[]>([MISSIONS_POOL[0], MISSIONS_POOL[1]]);
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>(INITIAL_ARCHIVE);
  const [selectedMissionForLog, setSelectedMissionForLog] = useState<Mission | null>(null);
  
  const [xp, setXp] = useState(350);
  const [streak] = useState(4);
  const [agentRank, setAgentRank] = useState('Novice Observer');

  const [debriefText, setDebriefText] = useState('');
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (xp >= 1000) setAgentRank('Master Spy');
    else if (xp >= 600) setAgentRank('Senior Operative');
    else if (xp >= 300) setAgentRank('Field Agent');
    else setAgentRank('Novice Observer');
  }, [xp]);

  const triggerFeedback = (type: 'click' | 'complete' = 'click') => {
    if (soundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        } else if (type === 'complete') {
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        }
      } catch (e) {
        // Fallback for restricted audio environments
      }
    }
  };

  const handleAgentClick = () => {
    triggerFeedback('click');
    const quotes = AGENT_DIALOGUES.idle;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeechBubble(randomQuote);
    setAgentMood('excited');
    setTimeout(() => setAgentMood('idle'), 2000);
  };

  const acceptMissionFromPool = (mission: Mission) => {
    triggerFeedback('click');
    if (!activeMissions.find(m => m.id === mission.id)) {
      setActiveMissions([...activeMissions, mission]);
      setSpeechBubble(AGENT_DIALOGUES.missionAccepted[Math.floor(Math.random() * AGENT_DIALOGUES.missionAccepted.length)]);
      setAgentMood('operational');
    }
  };

  const startDebrief = (mission: Mission) => {
    triggerFeedback('click');
    setSelectedMissionForLog(mission);
    setDebriefText('');
    setPhotoPreview(null);
  };

  const submitMissionDebrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMissionForLog) return;

    triggerFeedback('complete');

    const newLog: CompletedMission = {
      id: selectedMissionForLog.id,
      code: selectedMissionForLog.code,
      title: selectedMissionForLog.title,
      completedAt: new Date().toISOString().split('T')[0],
      xpEarned: selectedMissionForLog.xp,
      debrief: debriefText || 'Mission executed swiftly with zero compromise.',
      rating: difficultyRating,
      photoUrl: photoPreview
    };

    setCompletedMissions([newLog, ...completedMissions]);
    setXp(prev => prev + selectedMissionForLog.xp);
    setActiveMissions(activeMissions.filter(m => m.id !== selectedMissionForLog.id));
    
    setSpeechBubble(AGENT_DIALOGUES.missionCompleted[Math.floor(Math.random() * AGENT_DIALOGUES.missionCompleted.length)]);
    setAgentMood('proud');
    setSelectedMissionForLog(null);
  };

  const generateRandomMission = () => {
    triggerFeedback('click');
    const available = MISSIONS_POOL.filter(p => !activeMissions.some(a => a.id === p.id));
    if (available.length > 0) {
      const picked = available[Math.floor(Math.random() * available.length)];
      setActiveMissions([picked, ...activeMissions]);
      setSpeechBubble(`New covert intel decrypted: ${picked.title}!`);
      setAgentMood('operational');
    } else {
      setSpeechBubble("You've already accepted all available missions for today, Agent!");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-black tracking-tighter text-sm shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              007
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-slate-100">NANINANA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">HQ</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">何気ない毎日に、ちょっとした発見を。</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition"
              title="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Sparkles size={14} className="text-amber-400 animate-spin-slow" />
              <span className="text-xs font-mono font-bold">{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto w-full flex-1 px-4 py-4 space-y-4">
        
        {/* MASCOT DISPLAY */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-2xl p-4 border border-cyan-500/20 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4">
            <button 
              onClick={handleAgentClick}
              className="relative group focus:outline-none flex-shrink-0"
              title="Click to interact with Agent NANINANA"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shadow-lg transform transition duration-300 group-hover:scale-105 active:scale-95 ${agentMood === 'excited' ? 'animate-bounce' : ''}`}>
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <path d="M 20,85 L 50,55 L 80,85 L 90,100 L 10,100 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    <path d="M 50,55 L 50,100" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />
                    <circle cx="50" cy="40" r="24" fill="#f8fafc" />
                    <path d="M 18,32 Q 50,12 82,32 L 88,34 Q 50,26 12,34 Z" fill="#0f172a" />
                    <path d="M 28,31 Q 50,18 72,31 L 70,22 Q 50,14 30,22 Z" fill="#1e293b" />
                    <path d="M 30,28 Q 50,22 70,28" stroke="#06b6d4" strokeWidth="3" fill="none" />
                    <rect x="28" y="36" width="18" height="12" rx="3" fill="#0284c7" />
                    <rect x="54" y="36" width="18" height="12" rx="3" fill="#0284c7" />
                    <line x1="46" y1="40" x2="54" y2="40" stroke="#0284c7" strokeWidth="3" />
                    <path d="M 30,38 L 40,46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                    <path d="M 56,38 L 66,46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                    <path d="M 45,55 Q 52,60 56,54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <circle cx="30" cy="50" r="3" fill="#f43f5e" opacity="0.4" />
                    <circle cx="70" cy="50" r="3" fill="#f43f5e" opacity="0.4" />
                  </svg>

                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-950 animate-ping" />
                </div>
              </div>
            </button>

            <div className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 shadow-inner relative">
              <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-slate-800/80 border-b-8 border-b-transparent" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1">
                  <Terminal size={12} /> AGENT INTEL
                </span>
                <span className="text-[10px] text-slate-400 font-mono">STATUS: {agentMood.toUpperCase()}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{speechBubble}"
              </p>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase mb-0.5">
              <Award size={12} className="text-amber-400" /> Rank
            </div>
            <p className="text-xs font-bold text-slate-200 truncate">{agentRank}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase mb-0.5">
              <Flame size={12} className="text-rose-500" /> Streak
            </div>
            <p className="text-xs font-bold text-rose-400">{streak} Days Active</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase mb-0.5">
              <CheckCircle2 size={12} className="text-emerald-400" /> Cleared
            </div>
            <p className="text-xs font-bold text-emerald-400">{completedMissions.length} Classified</p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
          {[
            { id: 'briefing', label: 'Active Deck', icon: Shield },
            { id: 'generator', label: 'Intel Terminal', icon: Compass },
            { id: 'dossier', label: 'Dossier Log', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { triggerFeedback('click'); setActiveTab(tab.id as 'briefing' | 'generator' | 'dossier'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACTIVE MISSIONS */}
        {activeTab === 'briefing' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock size={12} className="text-cyan-400" /> Current Top-Secret Missions ({activeMissions.length})
              </h2>
            </div>

            {activeMissions.length === 0 ? (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-300">All Operations Clear!</h3>
                  <p className="text-xs text-slate-500 mt-1">Visit the Intel Terminal to generate instant new covert assignments.</p>
                </div>
                <button
                  onClick={() => { triggerFeedback('click'); setActiveTab('generator'); }}
                  className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-bold hover:bg-cyan-500/20 transition"
                >
                  Access Intel Terminal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeMissions.map((mission) => (
                  <div 
                    key={mission.id}
                    className="group bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition-all duration-300 shadow-lg relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-semibold">
                        {mission.code} • {mission.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {mission.time}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                          +{mission.xp} XP
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {mission.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {mission.desc}
                    </p>

                    <div className="mt-3 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                      <Sparkles size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-cyan-400 font-semibold block text-[9px] uppercase">Agent Field Tip</span>
                        {mission.intel}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => startDebrief(mission)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition"
                      >
                        <Camera size={14} /> Log Field Evidence & Debrief
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: INTEL TERMINAL */}
        {activeTab === 'generator' && (
          <section className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-2">
                <Compass size={24} />
              </div>
              <h2 className="text-sm font-bold text-slate-100">Intel Dispatch Terminal</h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Decrypt unexpected assignments from HQ to turn your routine into an active operation.
              </p>
              
              <button
                onClick={generateRandomMission}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto hover:brightness-110 active:scale-95 transition shadow-lg shadow-indigo-500/20"
              >
                <RefreshCw size={14} className="animate-spin-slow" /> Decrypt New Mission
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 px-1">Available Missions Vault</h3>
              <div className="space-y-2">
                {MISSIONS_POOL.map((item) => {
                  const isAccepted = activeMissions.some(a => a.id === item.id);
                  const isDone = completedMissions.some(c => c.id === item.id);

                  return (
                    <div 
                      key={item.id}
                      className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-cyan-400">{item.code}</span>
                          <span className="text-xs font-bold text-slate-200">{item.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{item.tag} • +{item.xp} XP</span>
                      </div>

                      {isDone ? (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                          CLEARED
                        </span>
                      ) : isAccepted ? (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/40">
                          IN PROGRESS
                        </span>
                      ) : (
                        <button
                          onClick={() => acceptMissionFromPool(item)}
                          className="px-3 py-1 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                        >
                          <Plus size={12} /> Accept
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: DOSSIER */}
        {activeTab === 'dossier' && (
          <section className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <UserCheck size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-100">Agent Field File</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ACTIVE</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Rank: <span className="text-cyan-300 font-semibold">{agentRank}</span></p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">TOTAL DEBRIEFS: {completedMissions.length}</p>
              </div>
            </div>

            <h3 className="text-xs font-mono uppercase text-slate-400 px-1">Classified Field Records</h3>

            {completedMissions.length === 0 ? (
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500">
                No completed missions recorded yet. Accept an assignment and log your debrief!
              </div>
            ) : (
              <div className="space-y-3">
                {completedMissions.map((log, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400">{log.code}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.completedAt}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">{log.title}</h4>
                    <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                      "{log.debrief}"
                    </p>

                    {log.photoUrl && (
                      <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-700 max-h-40">
                        <img src={log.photoUrl} alt="Mission Evidence" className="w-full object-cover" />
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-slate-950/80 px-1.5 py-0.5 rounded text-cyan-400 border border-cyan-500/30">EVIDENCE PHOTO</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={i < log.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">+{log.xpEarned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>

      {/* DEBRIEF MODAL */}
      {selectedMissionForLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400">{selectedMissionForLog.code}</span>
                <h3 className="text-sm font-bold text-slate-100">Top-Secret Field Debrief</h3>
              </div>
              <button 
                onClick={() => setSelectedMissionForLog(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                [CANCEL]
              </button>
            </div>

            <form onSubmit={submitMissionDebrief} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Photographic Evidence (Optional)</label>
                <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-3 text-center bg-slate-950/50 hover:border-cyan-500/50 transition">
                  {photoPreview ? (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                      <button 
                        type="button" 
                        onClick={() => setPhotoPreview(null)}
                        className="mt-2 text-[10px] font-mono text-rose-400 hover:underline"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center gap-1">
                      <Camera size={20} className="text-cyan-400" />
                      <span className="text-xs text-slate-300">Snap or Attach Field Photo</span>
                      <span className="text-[10px] text-slate-500">Tap to browse files</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Agent Field Notes & Intel</label>
                <textarea
                  required
                  rows={3}
                  value={debriefText}
                  onChange={(e) => setDebriefText(e.target.value)}
                  placeholder="Record your observations, feeling, or discoveries here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Operation Stealth Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setDifficultyRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star 
                        size={18} 
                        className={star <= difficultyRating ? "text-amber-400 fill-amber-400" : "text-slate-700"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
              >
                Transmit Debrief to HQ (+{selectedMissionForLog.xp} XP)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-2 text-center text-[10px] font-mono text-slate-600 border-t border-slate-900">
        NANINANA AGENT HQ • TOP SECRET • 何気ない毎日に、ちょっとした発見を。
      </footer>

    </div>
  );
}