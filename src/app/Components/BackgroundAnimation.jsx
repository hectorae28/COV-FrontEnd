import { useEffect, useRef, useState } from "react";

// Component for floating particles with original colors
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Reduced number of particles for cleaner look
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      width: Math.random() * 0.8 + 0.5,
      height: Math.random() * 0.8 + 0.5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 5,
      // Original colors
      color: Math.random() > 0.5 ? "#D7008A" : "#41023B",
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-50" 
          style={{
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color,
            animation: `floatModern ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Modern gradient blobs with original colors
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
    
    // Fewer blobs that are more distinct
    const blobs = [];
    const blobCount = 3; // Reduced count for cleaner look
    
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 350 + 200,
        xSpeed: (Math.random() * 0.3 - 0.15),
        ySpeed: (Math.random() * 0.3 - 0.15),
        // Original colors
        color: Math.random() > 0.5 ? "#D7008A" : "#41023B",
      });
    }
    
    const animate = () => {
      // Light background as in original
      ctx.fillStyle = "#F9F9F9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set blend mode for more distinct blobs
      ctx.globalCompositeOperation = "multiply";
      
      blobs.forEach((blob) => {
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;
        
        // Bounce off edges
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
        
        // Subtle gradients with original colors
        gradient.addColorStop(0, `${blob.color}33`); // 20% opacity
        gradient.addColorStop(0.6, `${blob.color}1A`); // 10% opacity
        gradient.addColorStop(1, `${blob.color}00`); // 0% opacity
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Reset composite operation
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

// Main component that combines the animations
export default function BackgroundAnimation() {
  return (
    <>
      <style jsx global>{`
        @keyframes floatModern {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.5;
          }
          75% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(20vw);
            opacity: 0;
          }
        }
      `}</style>
      <div className="absolute inset-0 bg-[#F9F9F9]" /> {/* Light background as in original */}
      <GradientBlobs />
      <FloatingParticles />
    </>
  );
}
