import { useState, useRef, useEffect } from 'react';
import { X, Lock, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function AdminPanel({ isOpen, onClose, onOpen }: AdminPanelProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 300, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isRainbow, setIsRainbow] = useState(false);
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [isEarthquake, setIsEarthquake] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [isMatrix, setIsMatrix] = useState(false);
  const [isDisco, setIsDisco] = useState(false);
  const [isNeon, setIsNeon] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [isSpeedUp, setIsSpeedUp] = useState(false);
  const [isGhost, setIsGhost] = useState(false);
  const [isWaves, setIsWaves] = useState(false);
  const [is67Mode, setIs67Mode] = useState(false);
  const [isTungSahur, setIsTungSahur] = useState(false);
  const [isLukaDih, setIsLukaDih] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const matrixIntervalRef = useRef<number | null>(null);

  const CORRECT_CODE = '6421';

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false);
      setCode('');
      setError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isResizing) {
        setSize({
          width: Math.max(400, e.clientX - position.x),
          height: Math.max(300, e.clientY - position.y),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, position]);

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === CORRECT_CODE) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleFlipScreen = () => {
    setIsFlipped(true);
    document.body.style.transform = 'rotate(180deg)';
    document.body.style.transition = 'transform 0.5s ease';
    
    setTimeout(() => {
      document.body.style.transform = 'rotate(0deg)';
      setTimeout(() => {
        document.body.style.transition = '';
        setIsFlipped(false);
      }, 500);
    }, 5000);
  };

  const handleFlashingLights = () => {
    setIsFlashing(true);
    
    // Create and play audio
    // Note: Replace this URL with your uploaded audio file
    const audio = new Audio('/audio/flash-sound.mp3'); // You'll need to add this file
    audioRef.current = audio;
    audio.volume = 1.0;
    audio.play().catch(err => console.log('Audio play failed:', err));
    
    // Create flashing overlay
    const overlay = document.createElement('div');
    overlay.className = 'flash-overlay';
    document.body.appendChild(overlay);
    
    // Stop after 15 seconds
    setTimeout(() => {
      overlay.remove();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsFlashing(false);
    }, 15000);
  };

  const handleRainbowMode = () => {
    setIsRainbow(true);
    document.body.style.animation = 'rainbow-background 3s ease infinite';
    setTimeout(() => {
      document.body.style.animation = '';
      setIsRainbow(false);
    }, 10000);
  };

  const handleSlowMotion = () => {
    setIsSlowMotion(true);
    document.body.style.animationDuration = '10s';
    document.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.transition = 'all 2s ease';
    });
    setTimeout(() => {
      document.body.style.animationDuration = '';
      document.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.transition = '';
      });
      setIsSlowMotion(false);
    }, 10000);
  };

  const handleEarthquake = () => {
    setIsEarthquake(true);
    document.body.classList.add('earthquake');
    setTimeout(() => {
      document.body.classList.remove('earthquake');
      setIsEarthquake(false);
    }, 5000);
  };

  const handleInvertColors = () => {
    setIsInverted(true);
    document.body.style.filter = 'invert(1) hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = '';
      setIsInverted(false);
    }, 10000);
  };

  const handleMatrixRain = () => {
    setIsMatrix(true);
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9998';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d')!;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    matrixIntervalRef.current = window.setInterval(draw, 50);
    
    setTimeout(() => {
      if (matrixIntervalRef.current) {
        clearInterval(matrixIntervalRef.current);
        matrixIntervalRef.current = null;
      }
      canvas.remove();
      setIsMatrix(false);
    }, 15000);
  };

  const handleDiscoBall = () => {
    setIsDisco(true);
    const overlay = document.createElement('div');
    overlay.className = 'disco-overlay';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.remove();
      setIsDisco(false);
    }, 10000);
  };

  const handleNeonGlow = () => {
    setIsNeon(true);
    document.body.classList.add('neon-mode');
    setTimeout(() => {
      document.body.classList.remove('neon-mode');
      setIsNeon(false);
    }, 10000);
  };

  const handleBlurVision = () => {
    setIsBlur(true);
    document.body.style.filter = 'blur(10px)';
    setTimeout(() => {
      document.body.style.filter = 'blur(5px)';
      setTimeout(() => {
        document.body.style.filter = 'blur(2px)';
        setTimeout(() => {
          document.body.style.filter = '';
          setIsBlur(false);
        }, 1000);
      }, 1000);
    }, 3000);
  };

  const handleSpeedUp = () => {
    setIsSpeedUp(true);
    document.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.transition = 'all 0.1s ease';
      (el as HTMLElement).style.animationDuration = '0.5s';
    });
    setTimeout(() => {
      document.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.transition = '';
        (el as HTMLElement).style.animationDuration = '';
      });
      setIsSpeedUp(false);
    }, 8000);
  };

  const handleConfetti = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }
  };

  const handleGhostMode = () => {
    setIsGhost(true);
    document.body.style.opacity = '0.3';
    setTimeout(() => {
      document.body.style.opacity = '0.5';
      setTimeout(() => {
        document.body.style.opacity = '0.7';
        setTimeout(() => {
          document.body.style.opacity = '';
          setIsGhost(false);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const handleTrippyWaves = () => {
    setIsWaves(true);
    document.body.classList.add('trippy-waves');
    setTimeout(() => {
      document.body.classList.remove('trippy-waves');
      setIsWaves(false);
    }, 10000);
  };

  const handle67Mode = () => {
    setIs67Mode(true);
    
    // Create container for 67s
    const container = document.createElement('div');
    container.className = 'brainrot-67-container';
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.zIndex = '9997';
    container.style.pointerEvents = 'none';
    
    // Create 30 random 67s
    for (let i = 0; i < 30; i++) {
      const text = document.createElement('div');
      text.textContent = '67';
      text.className = 'brainrot-67';
      text.style.position = 'fixed';
      text.style.fontSize = Math.random() * 100 + 40 + 'px';
      text.style.fontWeight = '900';
      text.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      text.style.left = Math.random() * 100 + 'vw';
      text.style.top = Math.random() * 100 + 'vh';
      text.style.opacity = String(Math.random() * 0.5 + 0.3);
      text.style.animation = `spin-67 ${Math.random() * 3 + 2}s linear infinite, float-67 ${Math.random() * 4 + 3}s ease-in-out infinite`;
      text.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(text);
    }
    
    document.body.appendChild(container);
    
    setTimeout(() => {
      container.remove();
      setIs67Mode(false);
    }, 15000);
  };

  const handleTungSahur = () => {
    setIsTungSahur(true);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '99999';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.animation = 'fadeIn 0.3s ease';
    
    // Create text
    const text = document.createElement('div');
    text.textContent = 'TUNG JUMP SCARE!!!!!';
    text.style.fontSize = '4rem';
    text.style.fontWeight = '900';
    text.style.color = '#ff0000';
    text.style.textShadow = '0 0 20px #ff0000, 0 0 40px #ff0000';
    text.style.marginBottom = '2rem';
    text.style.animation = 'shake-intense 0.1s infinite, pulse-glow 0.5s ease-in-out infinite';
    overlay.appendChild(text);
    
    // Create image
    const img = document.createElement('img');
    img.src = 'https://cdn-ai.onspace.ai/onspace/files/bNdhcm43k5m5QvSSvsXDPX/Tung-Tung-Tung-Sahur-Transparent-HQ.png';
    img.style.maxWidth = '80vw';
    img.style.maxHeight = '60vh';
    img.style.animation = 'shake-intense 0.05s infinite';
    overlay.appendChild(img);
    
    document.body.appendChild(overlay);
    
    // Remove after 5 seconds
    setTimeout(() => {
      overlay.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        overlay.remove();
        setIsTungSahur(false);
      }, 300);
    }, 5000);
  };

  const handleLukaDih = () => {
    setIsLukaDih(true);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '99999';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.animation = 'fadeIn 0.3s ease';
    
    // Create text
    const text = document.createElement('div');
    text.textContent = 'LUKA DIH';
    text.style.fontSize = '8rem';
    text.style.fontWeight = '900';
    text.style.color = '#00ff00';
    text.style.textShadow = '0 0 30px #00ff00, 0 0 60px #00ff00, 0 0 90px #00ff00';
    text.style.marginBottom = '2rem';
    text.style.animation = 'pulse-glow 0.3s ease-in-out infinite';
    text.style.zIndex = '100001';
    text.style.position = 'relative';
    overlay.appendChild(text);
    
    // Create image - fills most of the screen
    const img = document.createElement('img');
    img.src = 'https://cdn-ai.onspace.ai/onspace/files/AFae9mMTSVfh3ke9dp33h8/Untitled_design.png';
    img.style.width = '90vw';
    img.style.height = '90vh';
    img.style.objectFit = 'contain';
    img.style.position = 'absolute';
    img.style.zIndex = '100000';
    overlay.appendChild(img);
    
    document.body.appendChild(overlay);
    
    // Remove after 7 seconds
    setTimeout(() => {
      overlay.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        overlay.remove();
        setIsLukaDih(false);
      }, 300);
    }, 7000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pointer-events-none">
      <div
        ref={panelRef}
        className="absolute bg-card border-2 border-primary rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        {/* Header - Draggable */}
        <div
          className="drag-handle flex items-center justify-between bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/10 px-4 py-3 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground select-none">
              {isUnlocked ? 'Admin Panel - Unlocked' : 'Admin Panel - Locked'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-destructive/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto" style={{ height: `calc(100% - 52px)` }}>
          {!isUnlocked ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                  <Lock className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                  <h2 className="text-2xl font-bold gradient-text mb-2">Enter Access Code</h2>
                  <p className="text-sm text-muted-foreground">
                    This panel is restricted to administrators only
                  </p>
                </div>
                
                <form onSubmit={handleSubmitCode} className="space-y-4">
                  <div>
                    <Input
                      type="password"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter 4-digit code"
                      maxLength={4}
                      className={`text-center text-2xl tracking-widest ${
                        error ? 'border-destructive animate-shake' : ''
                      }`}
                      autoFocus
                    />
                    {error && (
                      <p className="text-xs text-destructive mt-2 text-center">
                        Incorrect code. Access denied.
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Unlock Panel
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-black rainbow-text mb-2">ADMIN PANEL</h1>
                <p className="text-sm text-muted-foreground">
                  System Controls & Management
                </p>
              </div>

              <div className="grid gap-4">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 text-foreground">🎨 Visual Effects</h3>
                  <div className="grid gap-2">
                    <Button
                      onClick={handleFlipScreen}
                      disabled={isFlipped}
                      className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      size="sm"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Flip Screen {isFlipped && '✓'}
                    </Button>
                    
                    <Button
                      onClick={handleFlashingLights}
                      disabled={isFlashing}
                      className="w-full gap-2 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600"
                      size="sm"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Flashing Lights {isFlashing && '✓'}
                    </Button>

                    <Button
                      onClick={handleRainbowMode}
                      disabled={isRainbow}
                      className="w-full gap-2 bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500"
                      size="sm"
                    >
                      🌈 Rainbow Mode {isRainbow && '✓'}
                    </Button>

                    <Button
                      onClick={handleInvertColors}
                      disabled={isInverted}
                      className="w-full gap-2 bg-gradient-to-r from-pink-500 to-indigo-500"
                      size="sm"
                    >
                      🔄 Invert Colors {isInverted && '✓'}
                    </Button>

                    <Button
                      onClick={handleNeonGlow}
                      disabled={isNeon}
                      className="w-full gap-2 bg-gradient-to-r from-cyan-400 to-pink-400"
                      size="sm"
                    >
                      ✨ Neon Glow {isNeon && '✓'}
                    </Button>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 text-foreground">⚡ Motion Effects</h3>
                  <div className="grid gap-2">
                    <Button
                      onClick={handleSlowMotion}
                      disabled={isSlowMotion}
                      className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500"
                      size="sm"
                    >
                      🐌 Slow Motion {isSlowMotion && '✓'}
                    </Button>

                    <Button
                      onClick={handleSpeedUp}
                      disabled={isSpeedUp}
                      className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500"
                      size="sm"
                    >
                      ⚡ Speed Up {isSpeedUp && '✓'}
                    </Button>

                    <Button
                      onClick={handleEarthquake}
                      disabled={isEarthquake}
                      className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500"
                      size="sm"
                    >
                      🌍 Earthquake {isEarthquake && '✓'}
                    </Button>

                    <Button
                      onClick={handleTrippyWaves}
                      disabled={isWaves}
                      className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
                      size="sm"
                    >
                      🌊 Trippy Waves {isWaves && '✓'}
                    </Button>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 text-foreground">🎭 Special Effects</h3>
                  <div className="grid gap-2">
                    <Button
                      onClick={handleMatrixRain}
                      disabled={isMatrix}
                      className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600"
                      size="sm"
                    >
                      💚 Matrix Rain {isMatrix && '✓'}
                    </Button>

                    <Button
                      onClick={handleDiscoBall}
                      disabled={isDisco}
                      className="w-full gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-500"
                      size="sm"
                    >
                      🪩 Disco Ball {isDisco && '✓'}
                    </Button>

                    <Button
                      onClick={handleBlurVision}
                      disabled={isBlur}
                      className="w-full gap-2 bg-gradient-to-r from-slate-500 to-gray-500"
                      size="sm"
                    >
                      👓 Blur Vision {isBlur && '✓'}
                    </Button>

                    <Button
                      onClick={handleConfetti}
                      className="w-full gap-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-500"
                      size="sm"
                    >
                      🎉 Confetti Blast
                    </Button>

                    <Button
                      onClick={handleGhostMode}
                      disabled={isGhost}
                      className="w-full gap-2 bg-gradient-to-r from-gray-600 to-slate-600"
                      size="sm"
                    >
                      👻 Ghost Mode {isGhost && '✓'}
                    </Button>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 text-foreground">🧠 Brainrot</h3>
                  <div className="grid gap-2">
                    <Button
                      onClick={handle67Mode}
                      disabled={is67Mode}
                      className="w-full gap-2 bg-gradient-to-r from-yellow-500 to-purple-500"
                      size="sm"
                    >
                      😎 67 Mode {is67Mode && '✓'}
                    </Button>

                    <Button
                      onClick={handleTungSahur}
                      disabled={isTungSahur}
                      className="w-full gap-2 bg-gradient-to-r from-orange-600 to-red-600"
                      size="sm"
                    >
                      🔔 Tung Tung Sahur {isTungSahur && '✓'}
                    </Button>

                    <Button
                      onClick={handleLukaDih}
                      disabled={isLukaDih}
                      className="w-full gap-2 bg-gradient-to-r from-green-500 to-lime-500"
                      size="sm"
                    >
                      💔 luka... {isLukaDih && '✓'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        {isUnlocked && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize bg-primary/20 hover:bg-primary/40 transition-colors"
            onMouseDown={handleResizeMouseDown}
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            }}
          />
        )}
      </div>
    </div>
  );
}
