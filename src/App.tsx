import { Home } from './pages/Home';
import { GamePlayer } from './pages/GamePlayer';
import { Music } from './pages/Music';
import { ChatRoom } from './pages/ChatRoom';

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
  
  return <Home />;
}

export default App;
