import { Home } from './pages/Home';
import { GamePlayer } from './pages/GamePlayer';
import { Music } from './pages/Music';
import { ChatRoom } from './pages/ChatRoom';
import { AIChat } from './pages/AIChat';
import { Tools } from './pages/Tools';
import { Videos } from './pages/Videos';
import { Apps } from './pages/Apps';

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
  
  if (path === '/videos') {
    return <Videos />;
  }
  
  if (path === '/apps') {
    return <Apps />;
  }
  
  return <Home />;
}

export default App;
