import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { GamePlayer } from './pages/GamePlayer';
import { Music } from './pages/Music';
import { ChatRoom } from './pages/ChatRoom';
import { AIChat } from './pages/AIChat';
import { Tools } from './pages/Tools';
import { Apps } from './pages/Apps';
import { Art } from './pages/Art';
import { Puzzles } from './pages/Puzzles';
import { Settings } from './pages/Settings';
import { initializeTheme } from './lib/themes';

function App() {
  const [isSigma67, setIsSigma67] = useState(false);

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
      </>
    );
  }
  
  if (path === '/chat') {
    return (
      <>
        <ChatRoom />
        {sigma67Decoration}
      </>
    );
  }
  
  if (path === '/ai') {
    return (
      <>
        <AIChat />
        {sigma67Decoration}
      </>
    );
  }
  
  if (path === '/tools') {
    return (
      <>
        <Tools />
        {sigma67Decoration}
      </>
    );
  }
  
  if (path === '/apps') {
    return (
      <>
        <Apps />
        {sigma67Decoration}
      </>
    );
  }
  
  if (path === '/art') {
    return (
      <>
        <Art />
        {sigma67Decoration}
      </>
    );
  }
  
  if (path === '/puzzles') {
    return (
      <>
        <Puzzles />
        {sigma67Decoration}
      </>
    );
  }
  
  if (path === '/settings') {
    return (
      <>
        <Settings />
        {sigma67Decoration}
      </>
    );
  }
  
  return (
    <>
      <Home />
      {sigma67Decoration}
    </>
  );
}

export default App;
