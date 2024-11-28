import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SnowEffect {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<DendriteFlake[]>([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const flakes: DendriteFlake[] = [];
      for (let i = 0; i < 20; i++) {
        flakes.push({
          id: i,
          x: Math.random() * 100, // Random x position (0-100%)
          delay: Math.random() * 5, // Random delay (0-5s)
          duration: 7 + Math.random() * 7, // Random duration (7-14s)
          size: 20 + Math.random() * 15, // Random size (20-35px)
          opacity: 0.3 + Math.random() * 0.7, // Random opacity (0.3-1)
        });
      }
      setSnowflakes(flakes);
    };

    generateSnowflakes();
  }, []);

  const renderDendriteSnowflake = (size: number) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="translate(12 12)">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <line x1="0" y1="0" x2="0" y2="-10" />
              <line x1="0" y1="-5" x2="2" y2="-6" />
              <line x1="0" y1="-5" x2="-2" y2="-6" />
              <line x1="0" y1="-8" x2="1" y2="-9" />
              <line x1="0" y1="-8" x2="-1" y2="-9" />
            </g>
          ))}
        </g>
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute"
          style={{
            left: `${flake.x}%`,
            opacity: flake.opacity,
          }}
          initial={{ y: -20 }}
          animate={{
            y: '100vh',
            x: ['-20px', '20px', '-20px'],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
            x: {
              duration: flake.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatType: 'reverse',
            },
          }}
        >
          {renderDendriteSnowflake(flake.size)}
        </motion.div>
      ))}
    </div>
  );
}




export default SnowEffect;
