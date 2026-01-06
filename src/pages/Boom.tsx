import { useState } from 'react';
import { Header } from '../components/layout/Header';

export function Boom() {
  const [isExploding, setIsExploding] = useState(false);

  const handleBombClick = () => {
    setIsExploding(true);
    
    // Close tab after explosion animation (3 seconds)
    setTimeout(() => {
      window.close();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        {/* Bomb Image */}
        {!isExploding && (
          <div className="animate-shake cursor-pointer">
            <img
              src="https://cdn-ai.onspace.ai/onspace/files/YMuj3ABPExXWvdAsnnFy/Screenshot_2026-01-05_200256.png"
              alt="Bomb"
              onClick={handleBombClick}
              className="w-64 h-64 object-contain select-none"
            />
          </div>
        )}

        {/* Explosion Image */}
        {isExploding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-explosion-spin">
            <img
              src="https://cdn-ai.onspace.ai/onspace/files/f9t2XXfXBZmfYhGxDKwkSq/Screenshot_2026-01-05_200237.png"
              alt="Explosion"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </main>
    </div>
  );
}
