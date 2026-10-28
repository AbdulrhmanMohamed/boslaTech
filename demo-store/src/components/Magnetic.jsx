import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/* Magnetic hover button — pulls toward the cursor, snaps back on leave */
export default function Magnetic({ children, className = "", strength = 0.35, as = "button", glow = false, ...rest }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  const Tag = motion[as] || motion.button;
  return (
    <Tag ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset}
      className={`cursor-pointer ${className} ${glow ? 'hover-glow' : ''}`} {...rest}>
      {children}
      {glow && <span className="absolute inset-0 -z-10" aria-hidden />}
    </Tag>
  );
}
