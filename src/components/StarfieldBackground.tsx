import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  baseOpacity: number;
  vx: number;
  vy: number;
  twinklePeriod: number;
  twinkleOffset: number;
}

const COLORS = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#a855f7", "#d4a853"];
const PARTICLE_COUNT = 300;

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() < 0.45 ? 1 : Math.random() * 2.5 + 1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    baseOpacity: 0.25 + Math.random() * 0.45,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    twinklePeriod: 2000 + Math.random() * 4000,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.current = mq.matches;
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReduced.current = e.matches;
    };
    mq.addEventListener("change", handleChange);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    particlesRef.current = createParticles(w, h);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      particlesRef.current = createParticles(w, h);
    };
    window.addEventListener("resize", resize);

    const drawNebula = (
      cx: number,
      cy: number,
      radius: number,
      color: string,
      alpha: number
    ) => {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "transparent");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = gradient;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalAlpha = 1;
    };

    const nebulaPositions = [
      { x: w * 0.2, y: h * 0.3, r: 300, vx: 0.03, vy: -0.02 },
      { x: w * 0.75, y: h * 0.6, r: 250, vx: -0.02, vy: 0.03 },
      { x: w * 0.5, y: h * 0.8, r: 350, vx: 0.02, vy: -0.01 },
    ];
    const nebulaColors = [
      "rgba(107, 63, 160,",
      "rgba(168, 85, 247,",
      "rgba(212, 168, 83,",
    ];
    const nebulaEnds = [")", ")", ")"];

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ctx.clearRect(0, 0, w, h);

      // Draw nebulae
      for (let i = 0; i < nebulaPositions.length; i++) {
        const n = nebulaPositions[i];
        if (!prefersReduced.current) {
          n.x += n.vx * (dt / 16);
          n.y += n.vy * (dt / 16);
          if (n.x < -n.r) n.x = w + n.r;
          if (n.x > w + n.r) n.x = -n.r;
          if (n.y < -n.r) n.y = h + n.r;
          if (n.y > h + n.r) n.y = -n.r;
        }
        drawNebula(n.x, n.y, n.r, nebulaColors[i] + "0.04" + nebulaEnds[i], 0.04);
      }

      // Draw particles
      for (const p of particlesRef.current) {
        if (!prefersReduced.current) {
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        const twinkle =
          Math.sin((now / p.twinklePeriod) * Math.PI * 2 + p.twinkleOffset) *
          0.5 +
          0.5;
        const alpha = p.baseOpacity * (0.55 + twinkle * 0.45);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      mq.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
