import type { Transition } from "framer-motion";

/** Snappy spring — buttons, toggles, micro-interactions */
export const springSnap: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

/** Tight spring — sidebar items, controlled panels */
export const springTight: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};

/** Bouncy spring — badges, toasts, emphasis */
export const springBounce: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 15,
};

/** Smooth spring — cards, tilts, large elements */
export const springSmooth: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

/** Standard ease — general fade/slide */
export const easeFast: Transition = { duration: 0.15 };
export const easeNormal: Transition = { duration: 0.2 };
export const easeSlow: Transition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

/** Stagger helper — returns delay for index-based stagger */
export function stagger(index: number, interval = 0.03): Transition {
  return { delay: index * interval, duration: 0.2 };
}
