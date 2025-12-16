import { Home } from './pages/Home';
import { GamePlayer } from './pages/GamePlayer';

function App() {
  const path = window.location.pathname;
  
  if (path.startsWith('/game/')) {
    return <GamePlayer />;
  }
  
  return <Home />;
}

export default App;
