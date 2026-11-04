import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

type PlateImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  onError?: () => void;
};

/**
 * Reveals a screenshot the way a plate would feed through a press: a hard
 * edge travels across the frame with a hairline in front of it. Same motion
 * grammar as the rules that draw in the work list, so it reads as part of the
 * page rather than an effect bolted on.
 */
export function PlateImage({
  src,
  alt,
  width,
  height,
  onError,
}: PlateImageProps) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start 90%", "start 55%"],
  });

  const clip = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const edgePosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const edgeOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);

  return (
    <span className="plate" ref={frameRef}>
      <motion.span
        className="plate__image"
        style={reduceMotion ? undefined : { clipPath: clip }}
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

      {!reduceMotion && (
        <motion.span
          className="plate__edge"
          style={{ left: edgePosition, opacity: edgeOpacity }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
