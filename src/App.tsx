import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { GamePlayer } from './pages/GamePlayer';
import { Music } from './pages/Music';
import { ChatRoom } from './pages/ChatRoom';
import { AIChat } from './pages/AIChat';
import { Tools } from './pages/Tools';
import { Settings } from './pages/Settings';
import { FollowMe } from './pages/FollowMe';
import { AdminPanel } from './components/features/AdminPanel';

import { initializeTheme } from './lib/themes';

function App() {
  const [isSigma67, setIsSigma67] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Global keyboard shortcut for admin panel (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminPanelOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
    
    // Check if sigma67 theme is active
    const checkTheme = () => {
      const currentTheme = sessionStorage.getItem('colorTheme');
      setIsSigma67(currentTheme === 'sigma67');
    };
    
    checkTheme();
    
    // Listen for storage changes (when theme changes)
    const interval = setInterval(checkTheme, 500);
    return () => clearInterval(interval);
  }, []);

  const path = window.location.pathname;
  
  if (path.startsWith('/game/')) {
    return (
      <>
        <GamePlayer />
        {isSigma67 && (
          <>
            <div className="sixty-seven">67</div>
            <div className="sixty-seven">67</div>
            <div className="sixty-seven">67</div>
            <div className="sixty-seven">67</div>
            <div className="sixty-seven">67</div>
            <div className="sixty-seven">67</div>
          </>
        )}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)}
          onOpen={() => setIsAdminPanelOpen(true)}
        />
      </>
    );
  }
  
  const sigma67Decoration = isSigma67 ? (
    <>
      <div className="sixty-seven">67</div>
      <div className="sixty-seven">67</div>
      <div className="sixty-seven">67</div>
      <div className="sixty-seven">67</div>
      <div className="sixty-seven">67</div>
      <div className="sixty-seven">67</div>
    </>
  ) : null;

  if (path === '/music') {
    return (
      <>
        <Music />
        {sigma67Decoration}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)}
          onOpen={() => setIsAdminPanelOpen(true)}
        />
      </>
    );
  }
  
  if (path === '/chat') {
    return (
      <>
        <ChatRoom />
        {sigma67Decoration}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)}
          onOpen={() => setIsAdminPanelOpen(true)}
        />
      </>
    );
  }
  
  if (path === '/ai') {
    return (
      <>
        <AIChat />
        {sigma67Decoration}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)}
          onOpen={() => setIsAdminPanelOpen(true)}
        />
      </>
    );
  }
  
  if (path === '/tools') {
    return (
      <>
        <Tools />
        {sigma67Decoration}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)}
          onOpen={() => setIsAdminPanelOpen(true)}
        />
      </>
    );
  }
  
  if (path === '/settings') {
    return (
      <>
        <Settings onOpenAdminPanel={() => setIsAdminPanelOpen(true)} />
        {sigma67Decoration}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)}
          onOpen={() => setIsAdminPanelOpen(true)}
        />
      </>
    );
  }
  
  if (path === '/follow') {
    return (
      <>
        <FollowMe />
        {sigma67Decoration}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)}
          onOpen={() => setIsAdminPanelOpen(true)}
        />
      </>
    );
  }
  
  return (
    <>
      <Home />
      {sigma67Decoration}
      <AdminPanel 
        isOpen={isAdminPanelOpen} 
        onClose={() => setIsAdminPanelOpen(false)}
        onOpen={() => setIsAdminPanelOpen(true)}
      />
    </>
  );
}

export default App;
