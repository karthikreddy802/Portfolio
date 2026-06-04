import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code, Briefcase, FileCode, Award, Cpu, 
  Mail, Phone, ExternalLink, Download, MessageSquare, X,
  Send, Sparkles, CheckCircle2, ChevronRight, Layers, Database, Cloud, Play, DatabaseZap
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Github = ({ size = 20, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 20, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Particle Network Canvas Component
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    const maxParticles = 60;
    const mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 245, 255, 0.25)';
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const drawLines = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Draw line to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[a].x - mouse.x;
          const dy = particles[a].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.25;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

export default function App() {
  const [typedTitle, setTypedTitle] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'input', text: 'help' },
    { type: 'output', text: 'Welcome to Venkata\'s AI Portfolio Terminal. Available commands:\n  [about]    - Learn about Venkata\n  [skills]   - List technical skills\n  [projects] - View portfolio projects\n  [contact]  - Show contact info\n  [clear]    - Clear terminal' }
  ]);
  const [isCopied, setIsCopied] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const terminalEndRef = useRef(null);

  // Live API Console States
  const [apiEndpoint, setApiEndpoint] = useState('/api/v1/projects');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    status: 200,
    statusText: "OK",
    data: [
      { id: 1, name: "Student Task & Portfolio Repository", stack: "Django, React, MySQL, Docker, Ollama, Vercel, Render, Railway" },
      { id: 2, name: "Placement Management System", stack: "React, Django REST, AWS EC2" },
      { id: 3, name: "Online Examination Platform", stack: "Django, Python, SQLite" }
    ]
  });

  // Chat Widget States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: "Hello! I am Venkata's AI assistant. Ask me anything about his qualifications, experience, or projects." }
  ]);

  // Auto Scroll Terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Typing effect for Hero subtitle
  useEffect(() => {
    const titles = ["Python Full Stack Developer", "AI Intern", "Django Expert", "React Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer;

    const handleType = () => {
      const currentWord = titles[wordIndex];
      if (isDeleting) {
        setTypedTitle(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypedTitle(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 30 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % titles.length;
        speed = 500;
      }

      timer = setTimeout(handleType, speed);
    };

    handleType();
    return () => clearTimeout(timer);
  }, []);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let output = '';
    switch (cmd) {
      case 'help':
        output = 'Available commands: about, skills, projects, contact, clear';
        break;
      case 'about':
        output = 'Venkata Naga Karthik Reddy\nPython Full Stack Developer + AI Intern\nCompleted SSSIT Full Stack Program & Synycs AI Internship.';
        break;
      case 'skills':
        output = 'Frontend: React, Tailwind, HTML5, CSS3, JS\nBackend: Django, Django REST Framework, REST APIs, Python\nDatabases: MySQL, SQLite, Oracle\nCloud: AWS EC2, Docker, GitHub, Jenkins\nAI Tools: ChatGPT, Cursor, Ollama, Gemma 2B';
        break;
      case 'projects':
        output = '1. Student Task & Portfolio Repository (React + Django + MySQL + Ollama AI)\n2. Placement Management System (React + DRF + AWS EC2)\n3. Online Examination Platform (Django + SQLite)';
        break;
      case 'contact':
        output = 'Email: karthikreddybodapati@gmail.com\nPhone: +91 7207120349\nGitHub: github.com/karthikreddy802\nLinkedIn: linkedin.com/in/venkata-naga-karthik-reddy-bodapati-051220234';
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      default:
        output = `Command not recognized: "${cmd}". Type "help" for a list of available commands.`;
    }

    setTerminalHistory(prev => [...prev, { type: 'input', text: terminalInput }, { type: 'output', text: output }]);
    setTerminalInput('');
  };

  const executeQuickCommand = (cmd) => {
    setTerminalInput(cmd);
    setTimeout(() => {
      const outputElem = document.getElementById('terminal-form');
      if (outputElem) {
        outputElem.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 50);
  };

  const triggerMockApi = (endpoint) => {
    setApiEndpoint(endpoint);
    setApiLoading(true);
    setTimeout(() => {
      setApiLoading(false);
      if (endpoint === '/api/v1/projects') {
        setApiResponse({
          status: 200,
          statusText: "OK",
          data: [
            { id: 1, name: "Student Task & Portfolio Repository", roles: "Ollama Local AI, RBAC, Vercel, Render, Railway" },
            { id: 2, name: "Placement Management System", roles: "Secure Auth, Recruiter Dashboard panels" },
            { id: 3, name: "Online Examination Platform", roles: "Automatic Grading modules, Session timers" }
          ]
        });
      } else if (endpoint === '/api/v1/internship') {
        setApiResponse({
          status: 200,
          statusText: "OK",
          data: {
            company: "Synycs Enterprises Pvt. Ltd.",
            role: "AI Software Developer Intern",
            duration: "6 Months",
            technologies: ["ChatGPT", "Cursor AI", "Anti Gravity AI", "Genspark"]
          }
        });
      } else if (endpoint === '/api/v1/certifications') {
        setApiResponse({
          status: 200,
          statusText: "OK",
          data: ["SSSIT Python Full Stack", "Synycs AI Internship", "NPTEL Data Analytics", "HackerRank C/Python"]
        });
      }
    }, 800);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('karthikreddybodapati@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus('Please fill all fields.');
      return;
    }
    
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00f5ff', '#10b981', '#a855f7']
      });
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  const askBotQuestion = (question, answer) => {
    setChatHistory(prev => [...prev, { type: 'user', text: question }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'bot', text: answer }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex relative overflow-hidden selection:bg-accent-cyan selection:text-dark-bg">
      {/* Visual Canvas Particle Engine */}
      <ParticleBackground />

      {/* Side Navigation for Desktop */}
      <aside className="w-24 fixed top-0 bottom-0 left-0 border-r border-dark-border bg-dark-bg/85 backdrop-blur-md hidden md:flex flex-col justify-between items-center py-8 z-50 vertical-line-decor">
        <div className="text-xl font-bold tracking-widest text-accent-cyan border border-accent-cyan/30 rounded-lg p-2.5 bg-dark-lighter">
          VK
        </div>
        <div className="flex flex-col gap-6 text-slate-400">
          <a href="https://github.com/karthikreddy802" target="_blank" rel="noreferrer" className="hover:text-accent-cyan transition-colors">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/venkata-naga-karthik-reddy-bodapati-051220234" target="_blank" rel="noreferrer" className="hover:text-accent-cyan transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="mailto:karthikreddybodapati@gmail.com" className="hover:text-accent-cyan transition-colors">
            <Mail size={20} />
          </a>
        </div>
        <div className="text-xs text-slate-500 rotate-90 translate-y-[-20px] whitespace-nowrap font-mono tracking-widest">
          karthikreddybodapati@gmail.com
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 md:pl-24 relative z-10">
        
        {/* Sticky Header Nav */}
        <header className="sticky top-0 z-40 bg-dark-bg/75 backdrop-blur-lg border-b border-dark-border px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot"></div>
            <span className="text-xs font-mono text-emerald-400 tracking-wider">AVAILABLE FOR ROLES</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-accent-cyan transition-colors">About</a>
            <a href="#skills" className="hover:text-accent-cyan transition-colors">Skills</a>
            <a href="#experience" className="hover:text-accent-cyan transition-colors">Experience</a>
            <a href="#projects" className="hover:text-accent-cyan transition-colors">Projects</a>
            <a href="#contact" className="px-3.5 py-1.5 rounded-md border border-accent-cyan/30 text-accent-cyan bg-accent-cyan/5 hover:bg-accent-cyan/15 hover:border-accent-cyan transition-all text-xs font-mono">
              Get In Touch
            </a>
          </nav>
        </header>

        {/* Outer boundaries container */}
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-32">

          {/* Hero Section */}
          <section className="pt-8 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="font-mono text-accent-cyan flex items-center gap-2">
                <Sparkles size={16} />
                <span>Hi, my name is</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                Venkata Naga Karthik Reddy
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-300">
                <span className="text-slate-400">I am a </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald underline decoration-accent-cyan/40">
                  {typedTitle || "Python Full Stack Developer"}
                </span>
                <span className="animate-pulse text-accent-cyan">|</span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                I build scalable web applications using Django, React.js, REST APIs, AWS EC2, and AI-powered solutions. Passionate about solving real-world problems through full-stack development and cloud technologies.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#projects" className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-dark-bg font-semibold hover:opacity-90 shadow-lg hover:shadow-cyan-500/10 hover:translate-y-[-2px] transition-all flex items-center gap-2">
                  <Code size={18} />
                  <span>View Projects</span>
                </a>
                <button onClick={() => executeQuickCommand('contact')} className="px-6 py-3 rounded-lg border border-dark-border bg-dark-lighter hover:bg-dark-border text-slate-200 transition-all hover:translate-y-[-2px] flex items-center gap-2">
                  <Download size={18} />
                  <span>Download Resume</span>
                </button>
              </div>
            </div>

            {/* Unique Interactive Terminal - Right Hero */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-dark-lighter/90 backdrop-blur-md border border-dark-border rounded-xl overflow-hidden shadow-2xl glow-card-cyan transition-all">
                {/* Terminal Header */}
                <div className="bg-dark-bg px-4 py-3 flex justify-between items-center border-b border-dark-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                    <Terminal size={12} />
                    <span>karthik@ai-intern-shell</span>
                  </div>
                </div>
                {/* Terminal Screen */}
                <div className="p-4 h-64 overflow-y-auto font-mono text-xs text-emerald-400/90 space-y-2.5">
                  {terminalHistory.map((item, idx) => (
                    <div key={idx} className="whitespace-pre-line">
                      {item.type === 'input' ? (
                        <p className="text-slate-300">
                          <span className="text-accent-cyan">karthik$</span> {item.text}
                        </p>
                      ) : (
                        <p className="text-slate-400 bg-slate-950/40 p-2 rounded border border-dark-border/40">{item.text}</p>
                      )}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
                {/* Terminal Command Input */}
                <form id="terminal-form" onSubmit={handleTerminalSubmit} className="bg-dark-bg/85 border-t border-dark-border flex items-center px-3.5 py-2.5">
                  <span className="font-mono text-xs text-accent-cyan mr-2">karthik$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Try typing 'skills' or 'projects'..."
                    className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-slate-200"
                  />
                  <button type="submit" className="text-slate-500 hover:text-accent-cyan p-1 transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </form>
                {/* Clickable Quick Command Chips */}
                <div className="px-4 py-2 bg-dark-bg/40 border-t border-dark-border/60 flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="text-slate-500 flex items-center">Quick commands:</span>
                  {['about', 'skills', 'projects', 'contact'].map(cmd => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => executeQuickCommand(cmd)}
                      className="px-2 py-0.5 rounded border border-dark-border hover:border-accent-cyan hover:text-accent-cyan bg-dark-lighter text-slate-400 transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Creative Feature: Interactive REST API Live Console */}
          <section className="scroll-mt-24 space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-accent-cyan font-mono text-xs tracking-widest uppercase">INTERACTIVE // Live REST Playground</div>
              <h2 className="text-3xl font-bold text-white">Full-Stack Backend API Inspector</h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Recruiters can test Venkata's live simulated API endpoint handler to check schema responses directly.
              </p>
            </div>

            <div className="max-w-4xl mx-auto rounded-xl border border-dark-border bg-dark-lighter/95 overflow-hidden shadow-2xl">
              {/* Toolbar */}
              <div className="bg-dark-bg px-4 py-3 flex items-center gap-3 border-b border-dark-border">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
                </div>
                <div className="h-4 w-px bg-dark-border"></div>
                <div className="flex-1 flex gap-2 items-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-accent-emerald text-xs font-mono font-bold">GET</span>
                  <div className="flex-1 px-3 py-1 bg-dark-bg text-slate-400 font-mono text-xs rounded border border-dark-border">
                    {apiEndpoint}
                  </div>
                </div>
              </div>

              {/* Console Body */}
              <div className="grid grid-cols-1 md:grid-cols-4 min-h-[220px]">
                {/* Endpoint selection */}
                <div className="p-4 border-r border-dark-border bg-dark-bg/25 flex flex-col gap-2 font-mono text-xs">
                  <span className="text-slate-500 mb-2 uppercase tracking-widest text-[10px]">Route Bindings</span>
                  {[
                    '/api/v1/projects',
                    '/api/v1/internship',
                    '/api/v1/certifications'
                  ].map(ep => (
                    <button
                      key={ep}
                      onClick={() => triggerMockApi(ep)}
                      className={`px-3 py-2 rounded text-left border transition-all ${
                        apiEndpoint === ep 
                          ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan' 
                          : 'border-transparent hover:bg-dark-border text-slate-400'
                      }`}
                    >
                      {ep.replace('/api/v1/', '')}
                    </button>
                  ))}
                </div>

                {/* API JSON Output Panel */}
                <div className="md:col-span-3 p-4 bg-slate-950/80 font-mono text-xs flex flex-col justify-between">
                  <div className="text-slate-500 flex justify-between border-b border-dark-border pb-1.5 mb-2">
                    <span>RESPONSE SCHEMA</span>
                    <span>HTTP {apiResponse.status} {apiResponse.statusText}</span>
                  </div>

                  {apiLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-accent-cyan gap-2 py-8">
                      <DatabaseZap className="animate-bounce" size={24} />
                      <span className="text-xs">Invoking python backend view handler...</span>
                    </div>
                  ) : (
                    <pre className="text-accent-cyan flex-1 overflow-x-auto p-2 bg-dark-bg/30 rounded border border-dark-border/40">
                      {JSON.stringify(apiResponse.data, null, 2)}
                    </pre>
                  )}

                  <div className="text-[10px] text-slate-500 mt-2 text-right">
                    Rendered in Django REST Framework serializer context
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Me Section */}
          <section id="about" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <div className="text-accent-cyan font-mono text-xs tracking-widest uppercase">01 // Profile</div>
              <h2 className="text-3xl font-bold text-white">About Me</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-transparent"></div>
            </div>
            
            <div className="lg:col-span-8 space-y-6 text-slate-400">
              <p className="leading-relaxed">
                I am a Python Full Stack Developer with hands-on experience in Django, React.js, MySQL, REST APIs, Docker, and AWS EC2. I completed a 6-month Python Full Stack Development program at SSSIT and an AI Internship at Synycs Enterprises Pvt. Ltd.
              </p>
              <p className="leading-relaxed">
                I enjoy building secure, scalable, and user-friendly applications while exploring AI-powered solutions using ChatGPT, Cursor AI, Ollama, and other modern tools.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-xl bg-dark-lighter border border-dark-border">
                  <div className="font-mono text-accent-cyan text-sm mb-1 font-semibold">Python Full Stack Core</div>
                  <div className="text-xs text-slate-500">6-Month Program &bull; SSSIT</div>
                </div>
                <div className="p-4 rounded-xl bg-dark-lighter border border-dark-border">
                  <div className="font-mono text-accent-emerald text-sm mb-1 font-semibold">AI Software Internship</div>
                  <div className="text-xs text-slate-500">Synycs Enterprises Pvt. Ltd.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Grid */}
          <section id="skills" className="scroll-mt-24 space-y-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-accent-cyan font-mono text-xs tracking-widest uppercase">02 // Capabilities</div>
              <h2 className="text-3xl font-bold text-white">Technical Arsenal</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-accent-emerald"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-6">
              {/* Frontend Card */}
              <div className="p-5 rounded-xl bg-dark-lighter/80 backdrop-blur border border-dark-border hover:border-cyan-500/40 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-cyan-500/10 rounded-lg w-fit text-accent-cyan mb-4">
                    <Layers size={20} />
                  </div>
                  <h3 className="font-semibold text-white mb-3">Frontend</h3>
                  <ul className="space-y-2 text-sm text-slate-400 font-mono">
                    <li>&bull; React.js</li>
                    <li>&bull; HTML5 & CSS3</li>
                    <li>&bull; JavaScript</li>
                    <li>&bull; Tailwind CSS</li>
                  </ul>
                </div>
              </div>

              {/* Backend Card */}
              <div className="p-5 rounded-xl bg-dark-lighter/80 backdrop-blur border border-dark-border hover:border-emerald-500/40 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg w-fit text-accent-emerald mb-4">
                    <Code size={20} />
                  </div>
                  <h3 className="font-semibold text-white mb-3">Backend</h3>
                  <ul className="space-y-2 text-sm text-slate-400 font-mono">
                    <li>&bull; Python</li>
                    <li>&bull; Django</li>
                    <li>&bull; Django REST</li>
                    <li>&bull; REST APIs</li>
                  </ul>
                </div>
              </div>

              {/* Databases Card */}
              <div className="p-5 rounded-xl bg-dark-lighter/80 backdrop-blur border border-dark-border hover:border-purple-500/40 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-purple-500/10 rounded-lg w-fit text-accent-purple mb-4">
                    <Database size={20} />
                  </div>
                  <h3 className="font-semibold text-white mb-3">Databases</h3>
                  <ul className="space-y-2 text-sm text-slate-400 font-mono">
                    <li>&bull; MySQL</li>
                    <li>&bull; SQLite</li>
                    <li>&bull; Oracle</li>
                  </ul>
                </div>
              </div>

              {/* DevOps & Cloud */}
              <div className="p-5 rounded-xl bg-dark-lighter/80 backdrop-blur border border-dark-border hover:border-blue-500/40 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-blue-500/10 rounded-lg w-fit text-blue-400 mb-4">
                    <Cloud size={20} />
                  </div>
                  <h3 className="font-semibold text-white mb-3">Cloud / DevOps</h3>
                  <ul className="space-y-2 text-sm text-slate-400 font-mono">
                    <li>&bull; AWS EC2</li>
                    <li>&bull; Docker</li>
                    <li>&bull; Jenkins</li>
                    <li>&bull; GitHub</li>
                  </ul>
                </div>
              </div>

              {/* AI Tools */}
              <div className="p-5 rounded-xl bg-dark-lighter/80 backdrop-blur border border-dark-border hover:border-yellow-500/40 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-yellow-500/10 rounded-lg w-fit text-yellow-400 mb-4">
                    <Cpu size={20} />
                  </div>
                  <h3 className="font-semibold text-white mb-3">AI Engine</h3>
                  <ul className="space-y-2 text-sm text-slate-400 font-mono">
                    <li>&bull; ChatGPT & Cursor</li>
                    <li>&bull; Anti Gravity AI</li>
                    <li>&bull; Genspark</li>
                    <li>&bull; Ollama</li>
                    <li>&bull; Gemma 2B</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Work Experience */}
          <section id="experience" className="scroll-mt-24 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-4">
                <div className="text-accent-cyan font-mono text-xs tracking-widest uppercase">03 // Timeline</div>
                <h2 className="text-3xl font-bold text-white">Experience</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-transparent"></div>
              </div>

              <div className="lg:col-span-8 relative border-l-2 border-dark-border pl-8 ml-4 space-y-12">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 bg-dark-bg border-2 border-accent-cyan w-4 h-4 rounded-full"></div>
                  
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">AI Intern</h3>
                      <p className="text-sm font-semibold text-accent-cyan font-mono">Synycs Enterprises Pvt. Ltd.</p>
                    </div>
                    <span className="px-3 py-1 bg-dark-lighter border border-dark-border text-xs rounded-full text-slate-400 font-mono">
                      May 2026
                    </span>
                  </div>
                  
                  <ul className="space-y-2 text-slate-400 text-sm list-disc list-inside">
                    <li>Worked on AI-assisted software development.</li>
                    <li>Utilized ChatGPT, Cursor AI, Anti Gravity AI, and Genspark.</li>
                    <li>Assisted in development, testing, and technical documentation.</li>
                    <li>Recognized for dedication and excellent performance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="scroll-mt-24 space-y-12">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-accent-cyan font-mono text-xs tracking-widest uppercase">04 // Portfolio</div>
              <h2 className="text-3xl font-bold text-white">Featured Project Works</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-accent-emerald"></div>
            </div>

            {/* Feature Spotlight Project */}
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-dark-lighter/90 to-dark-bg/90 border border-cyan-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2.5 py-1 bg-cyan-500/10 text-accent-cyan border border-cyan-500/20 rounded">
                      Featured Project
                    </span>
                    <span className="text-xs font-mono text-slate-500">Academic Hub &bull; AI Portfolio</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent-cyan transition-colors">
                    Student Task & Portfolio Repository
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed">
                    A comprehensive academic platform bridging student submissions with LLM-powered portfolio synthesis. Evaluates submissions and generates structured markdown resumes utilizing Local Ollama AI pipelines.
                  </p>
                  
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Full-stack academic management platform.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>JWT Authentication & RBAC.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>AI Portfolio Generation using Ollama.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Docker deployment & AWS EC2 container hosting.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Multi-environment deployment: Vercel (UI), Render & Railway (API / Database).</span>
                    </li>
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {['React', 'Django REST Framework', 'MySQL', 'Docker', 'Ollama', 'Vercel', 'Render', 'Railway'].map(t => (
                      <span key={t} className="text-xs font-mono px-2 py-0.5 bg-dark-lighter border border-dark-border text-slate-400 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Architecture Visual Grid Map */}
                <div className="lg:col-span-5">
                  <div className="border border-dark-border bg-slate-950/40 p-5 rounded-xl space-y-4">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center border-b border-dark-border pb-2">
                      System Topology
                    </div>
                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="p-2 border border-cyan-500/20 bg-cyan-500/5 text-accent-cyan rounded text-center">
                        React.js Frontend UI (JWT Auth &bull; Vercel)
                      </div>
                      <div className="text-center text-slate-600">↓ REST APIs</div>
                      <div className="p-2 border border-emerald-500/20 bg-emerald-500/5 text-accent-emerald rounded text-center">
                        Django REST Controller (Render/Railway/EC2)
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-2 border border-purple-500/20 bg-purple-500/5 text-accent-purple rounded">
                          MySQL Database
                        </div>
                        <div className="p-2 border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 rounded">
                          Ollama AI Pipeline
                        </div>
                      </div>
                      <div className="p-1.5 border border-dark-border bg-dark-lighter text-slate-400 rounded text-center text-[10px]">
                        Vercel UI &bull; Render/Railway APIs &bull; Docker &bull; AWS EC2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project 2 */}
              <div className="p-6 rounded-xl bg-dark-lighter/90 border border-dark-border hover:border-slate-700 hover:translate-y-[-2px] transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-dark-border text-slate-400 rounded">
                      Full Stack
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Placement Management System</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Student-job matching platform connecting graduates with employer vacancies, equipped with analytical dashboard controls.
                  </p>
                  <ul className="space-y-2 text-slate-300 text-xs">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Student-job matching platform.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Dashboard Analytics boards.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Secure Authentication + REST APIs.</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-6">
                  {['React', 'Django REST Framework', 'AWS EC2'].map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-dark-bg border border-dark-border text-slate-400 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project 3 */}
              <div className="p-6 rounded-xl bg-dark-lighter/90 border border-dark-border hover:border-slate-700 hover:translate-y-[-2px] transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-dark-border text-slate-400 rounded">
                      Backend Core
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Online Examination Platform</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    High concurrency testing app delivering automated graded assessments with role-based dashboard reports.
                  </p>
                  <ul className="space-y-2 text-slate-300 text-xs">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Secure Online Exams & Timed Assessments.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Automated Evaluation engines.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                      <span>Role-Based Access Control.</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-6">
                  {['Django', 'Python', 'SQLite'].map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-dark-bg border border-dark-border text-slate-400 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Certifications & Achievements in a Double Column Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Certifications */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-accent-cyan" />
                <h3 className="text-xl font-bold text-white">Certifications</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Python Full Stack Development', issuer: 'SSSIT' },
                  { name: 'AI Internship Certificate', issuer: 'Synycs Enterprises' },
                  { name: 'NPTEL Data Analytics Using Python', issuer: 'IIT/NPTEL' },
                  { name: 'Industry 4.0 / Industrial IoT', issuer: 'NPTEL' },
                  { name: 'HackerRank Python Certification', issuer: 'HackerRank' },
                  { name: 'HackerRank C Certification', issuer: 'HackerRank' },
                ].map((cert, i) => (
                  <div key={i} className="p-3 bg-dark-lighter border border-dark-border/60 hover:border-accent-cyan/20 rounded-lg flex justify-between items-center transition-colors">
                    <span className="text-sm font-semibold text-slate-200">{cert.name}</span>
                    <span className="text-xs font-mono text-slate-500">{cert.issuer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-accent-emerald" />
                <h3 className="text-xl font-bold text-white">Achievements</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { title: 'IEEE Research Paper Publication', desc: 'Co-authored and published scientific research within IEEE proceedings.' },
                  { title: 'Multiple Full Stack Team Lead', desc: 'Managed multi-developer teams coordinating feature deployments and code quality.' },
                  { title: 'Academic Event Coordinator', desc: 'Organized and managed departmental technical symposia and coding hackathons.' },
                ].map((ach, i) => (
                  <div key={i} className="p-4 bg-dark-lighter border border-dark-border/60 hover:border-accent-emerald/20 rounded-lg transition-colors space-y-1">
                    <h4 className="text-sm font-semibold text-slate-200">{ach.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{ach.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="scroll-mt-24 border-t border-dark-border pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6">
                <div className="text-accent-cyan font-mono text-xs tracking-widest uppercase">05 // Contact</div>
                <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Looking to hire a Full Stack Developer with AI expertise? Drop me a message, send an email, or connect with me via social channels. I reply quickly!
                </p>

                <div className="space-y-4 pt-4 text-sm font-mono">
                  <div className="flex items-center gap-3 p-3 bg-dark-lighter border border-dark-border rounded-lg hover:border-accent-cyan transition-all cursor-pointer" onClick={handleCopyEmail}>
                    <Mail size={16} className="text-accent-cyan" />
                    <span className="text-slate-300">{isCopied ? 'Email Copied!' : 'karthikreddybodapati@gmail.com'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-dark-lighter border border-dark-border rounded-lg">
                    <Phone size={16} className="text-accent-cyan" />
                    <span className="text-slate-300">+91 7207120349</span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <a href="https://github.com/karthikreddy802" target="_blank" rel="noreferrer" className="p-3 bg-dark-lighter border border-dark-border rounded-lg hover:border-accent-cyan text-slate-400 hover:text-accent-cyan transition-all flex-1 text-center font-semibold text-xs flex justify-center items-center gap-1.5">
                      <Github size={14} />
                      GitHub
                    </a>
                    <a href="https://linkedin.com/in/venkata-naga-karthik-reddy-bodapati-051220234" target="_blank" rel="noreferrer" className="p-3 bg-dark-lighter border border-dark-border rounded-lg hover:border-accent-cyan text-slate-400 hover:text-accent-cyan transition-all flex-1 text-center font-semibold text-xs flex justify-center items-center gap-1.5">
                      <Linkedin size={14} />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleFormSubmit} className="space-y-4 bg-dark-lighter p-6 border border-dark-border rounded-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-500">Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-bg border border-dark-border focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan rounded-md outline-none text-slate-100 text-sm transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-500">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-bg border border-dark-border focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan rounded-md outline-none text-slate-100 text-sm transition-all"
                        placeholder="you@domain.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-500">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-bg border border-dark-border focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan rounded-md outline-none text-slate-100 text-sm transition-all resize-none"
                      placeholder="Discuss custom software, integration options, or general recruitment inquiries..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full py-2.5 rounded-md font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-dark-bg hover:translate-y-[-1px] transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {formStatus === 'sending' ? (
                      <span>Sending Transmission...</span>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {formStatus === 'success' && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-accent-emerald text-xs rounded text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={14} />
                      <span>Message transmitted successfully! Confetti triggered.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>

          {/* Footer details */}
          <footer className="text-center font-mono text-xs text-slate-600 border-t border-dark-border/40 pt-8 pb-4">
            <p>&copy; {new Date().getFullYear()} &bull; Venkata Naga Karthik Reddy</p>
            <p className="mt-1 text-[10px]">Built using React.js, Vite & Tailwind CSS v4.0</p>
          </footer>

        </main>
      </div>

      {/* Floating AI Assistant Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="w-80 h-96 bg-dark-lighter border border-dark-border rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden glow-card-emerald">
            {/* Header */}
            <div className="bg-dark-bg px-4 py-3 border-b border-dark-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald pulse-dot"></div>
                <span className="text-xs font-mono font-semibold text-slate-200">Karthik's AI Copilot</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-accent-cyan/15 border border-accent-cyan/30 text-slate-200' 
                      : 'bg-dark-bg/60 border border-dark-border text-slate-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Canned Questions Grid */}
            <div className="p-3 bg-dark-bg/40 border-t border-dark-border flex flex-col gap-1.5 text-[10px] font-mono">
              <span className="text-slate-500 mb-0.5">Click a quick question:</span>
              <button 
                onClick={() => askBotQuestion(
                  "Where did Karthik intern?",
                  "Karthik completed a 6-month AI software developer internship at Synycs Enterprises Pvt. Ltd. (May 2026) focusing on AI-assisted development tools."
                )}
                className="px-2.5 py-1 text-left rounded bg-dark-lighter border border-dark-border hover:border-accent-emerald hover:text-accent-emerald text-slate-400 transition-colors"
              >
                Where did he intern?
              </button>
              <button 
                onClick={() => askBotQuestion(
                  "What is SSSIT?",
                  "SSSIT is where Karthik completed an intensive, hands-on 6-month Python Full Stack Development program, mastering Django, React.js, REST APIs, and databases."
                )}
                className="px-2.5 py-1 text-left rounded bg-dark-lighter border border-dark-border hover:border-accent-emerald hover:text-accent-emerald text-slate-400 transition-colors"
              >
                What is SSSIT?
              </button>
              <button 
                onClick={() => askBotQuestion(
                  "What is his featured project?",
                  "His featured project is the 'Student Task & Portfolio Repository' (Django REST, React, MySQL, Docker) which integrates local Ollama AI pipelines to generate student portfolios."
                )}
                className="px-2.5 py-1 text-left rounded bg-dark-lighter border border-dark-border hover:border-accent-emerald hover:text-accent-emerald text-slate-400 transition-colors"
              >
                What is his featured project?
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setChatOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-dark-bg font-bold shadow-2xl hover:scale-105 hover:rotate-3 transition-all"
            title="Talk to AI Assistant"
          >
            <MessageSquare size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
