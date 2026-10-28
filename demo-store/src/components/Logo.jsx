export default function Logo({ size = 110, className = "", fontFamily = "Tajawal, system-ui, sans-serif" }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 110 80" role="img" aria-label="الأصلي ASL — الشعار" className={className}>
      <defs>
        <linearGradient id="asl-seal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e5b4f" />
          <stop offset="1" stopColor="#163e36" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="100" height="70" rx="20" fill="url(#asl-seal)" />
      <rect x="7" y="7" width="96" height="66" rx="16" fill="none" stroke="#c9a24b" strokeWidth="2" opacity="0.85" />
      <text x="55" y="42" textAnchor="middle" fontSize="26" fontWeight="900" fill="#f7f3ec" fontFamily={fontFamily}>الأصلي</text>
      <rect x="35" y="48" width="40" height="1.5" rx="1" fill="#c9a24b" opacity="0.7" />
      <text x="55" y="66" textAnchor="middle" fontSize="14" fontWeight="800" letterSpacing="4" fill="#c9a24b" fontFamily={fontFamily}>ASL</text>
    </svg>
  );
}
