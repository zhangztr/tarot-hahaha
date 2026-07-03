export default function CardBack() {
  return (
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-mystic-mid via-mystic-dark to-mystic-deep border-2 border-mystic-purple/40 flex items-center justify-center overflow-hidden">
      <div className="relative w-4/5 h-4/5">
        {/* Outer decorative border */}
        <div className="absolute inset-0 rounded-lg border border-mystic-gold/30" />
        {/* Inner border */}
        <div className="absolute inset-2 rounded-lg border border-mystic-gold/20" />
        {/* Star pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 opacity-50">
            <polygon
              points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
              fill="none"
              stroke="#d4a853"
              strokeWidth="0.8"
            />
          </svg>
        </div>
        {/* Small stars */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-mystic-gold/50 rounded-full"
            style={{
              top: `${8 + (i * 15) % 80}%`,
              left: `${12 + (i * 20) % 80}%`,
            }}
          />
        ))}
        {/* Center moon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-mystic-gold/40 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-mystic-gold/10" />
        </div>
      </div>
    </div>
  );
}
