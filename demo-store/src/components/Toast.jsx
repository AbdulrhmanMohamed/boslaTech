import { AnimatePresence, motion } from "motion/react";
import { useShop } from "../store";

export default function Toast() {
  const { toast } = useShop();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          className="fixed bottom-6 inset-x-0 mx-auto w-fit z-[110] bg-ink text-cream text-sm font-extrabold px-5 py-3 rounded-full shadow-xl pointer-events-none"
        >
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
