import { useRef } from "react";

/* Custom cursor — subtle scale+glow transition follows pointer */
export default function Cursor({ className = "" }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--mx", `${x * 0.5}px`);
    ref.current.style.setProperty("--my", `${y * 0.5}px`);
    const active = e.buttons === 0 ? false : true;
    ref.current.style.setProperty("--active", active ? "1" : "0");
  };

  return (
    <div ref={ref}
      className={`fixed left-0 top-0 z-[999] h-2 w-2 -rotate-45 bg-ink/60 text-transparent rounded-full -translate-x-[calc(var(--mx,0px)-0.5px)] translate-y-[calc(var(--my,0px)-0.5px)] hover:scale-125 hover:bg-green2 ${className}`}
      onMouseMove={onMove} onMouseEnter={(e) => e.currentTarget.style.display = "none"} onMouseLeave={(e) => e.currentTarget.style.display = ""}
    />
  );
}
