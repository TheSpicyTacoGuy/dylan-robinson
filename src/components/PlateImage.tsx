import { motion, useReducedMotion } from "framer-motion";

type PlateImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  onError?: () => void;
};

/**
 * A screenshot settling into its frame. This was a scroll-scrubbed wipe, which
 * was wrong for one plain reason: the image stayed partly hidden for as long as
 * you happened to stop scrolling. A reveal has to finish on its own, so this
 * one runs once, on a clock, and has landed before the frame reaches the middle
 * of the screen.
 */
export function PlateImage({
  src,
  alt,
  width,
  height,
  onError,
}: PlateImageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="plate"
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 1.015 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onError={onError}
      />
    </motion.span>
  );
}
