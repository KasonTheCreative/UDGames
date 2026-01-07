import { useState, useRef, useEffect } from 'react';
import { X, Lock, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 300, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={panelRef}
        className="absolute bg-card border-2 border-primary rounded-2xl shadow-2xl overflow-hidden"
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
                  <h3 className="text-lg font-bold mb-4 text-foreground">Display Controls</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleFlipScreen}
                      disabled={isFlipped}
                      className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      size="lg"
                    >
                      <Maximize2 className="h-5 w-5" />
                      Flip Screen {isFlipped && '(Active)'}
                    </Button>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-2 text-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    More admin controls will be added here...
                  </p>
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
