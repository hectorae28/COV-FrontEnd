import { useEffect, useRef, useState } from "react";

// Componente para las partículas flotantes
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 5, // Más rápido
      delay: Math.random() * 4,        // Menos retraso
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-80"
          style={{
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: particle.left,
            top: particle.top,
            animation: `float ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Componente para la animación de blobs gradientes
const GradientBlobs = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const blobs = [];
    const blobCount = 5;
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 100,
        xSpeed: Math.random() * 1 - 0.8, // Más rápido
        ySpeed: Math.random() * 1 - 0.8, // Más rápido
        hue: Math.random() * 30 + 320,
      });
    }

    const animate = () => {
      ctx.fillStyle = "#1D0018";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((blob) => {
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;

        if (blob.x < -blob.radius || blob.x > canvas.width + blob.radius) {
          blob.xSpeed = -blob.xSpeed;
        }
        if (blob.y < -blob.radius || blob.y > canvas.height + blob.radius) {
          blob.ySpeed = -blob.ySpeed;
        }

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, 100%, 40%, 0.8)`);
        gradient.addColorStop(1, `hsla(${blob.hue - 30}, 100%, 20%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = "rgba(20, 20, 20, 0.03)";
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Componente principal que combina las animaciones
export default function BackgroundAnimation() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-[#D7008A] to-[#41023B]" />
      <GradientBlobs />
      <FloatingParticles />
    </>
  );
}