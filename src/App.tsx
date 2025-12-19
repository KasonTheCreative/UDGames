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

function App() {
  const path = window.location.pathname;
  
  if (path.startsWith('/game/')) {
    return <GamePlayer />;
  }
  
  if (path === '/music') {
    return <Music />;
  }
  
  if (path === '/chat') {
    return <ChatRoom />;
  }
  
  if (path === '/ai') {
    return <AIChat />;
  }
  
  if (path === '/tools') {
    return <Tools />;
  }
  
  if (path === '/apps') {
    return <Apps />;
  }
  
  if (path === '/art') {
    return <Art />;
  }
  
  if (path === '/puzzles') {
    return <Puzzles />;
  }
  
  if (path === '/settings') {
    return <Settings />;
  }
  
  return <Home />;
}

export default App;
