import React, { useEffect } from 'react';

const Snowflakes: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById('snowflakesCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snowflakes: Snowflake[] = [];
    const numSnowflakes = 100;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Snowflake {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 2; // Radius for stars
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random();
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();

        // Star dendrites
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x1 = this.x + this.radius * Math.cos(angle);
          const y1 = this.y + this.radius * Math.sin(angle);
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(x1, y1);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.stroke();
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
      }
    }

    const createSnowflakes = () => {
      for (let i = 0; i < numSnowflakes; i++) {
        snowflakes.push(new Snowflake());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach((snowflake) => {
        snowflake.update();
        snowflake.draw();
      });
      requestAnimationFrame(animate);
    };

    createSnowflakes();
    animate();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return null;
};

export default Snowflakes;
