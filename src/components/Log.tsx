import { useEffect, useRef, useState } from "react";
import { drawLog, LOG_ROTATION, type Palette } from "../lib/log3d";
import { RingField } from "./RingField";

/** Reads the log's colours from the theme tokens so it never hardcodes a hex. */
const readPalette = (canvas: HTMLCanvasElement): Palette => {
  const styles = getComputedStyle(canvas);
  const token = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;

  return {
    bark: token("--log-bark", "#4a2e1b"),
    barkDark: token("--log-bark-dark", "#2b1a0f"),
    barkShadow: token("--log-shadow", "#3b2413"),
    barkLight: token("--log-bark-light", "#8f6842"),
    face: token("--log-face", "#d9bd94"),
    faceDark: token("--log-face-dark", "#b0946f"),
    ring: token("--log-ring", "#8d6a44"),
    pith: token("--log-pith", "#432a17"),
  };
};

type LogProps = {
  className?: string;
};

export function Log({ className }: LogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) {
      setFailed(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let palette = readPalette(canvas);

    // The log only turns a few degrees as the hero scrolls away. Smoothing
    // keeps that small response from snapping on a fast wheel movement.
    let targetX = LOG_ROTATION.pitch;
    let targetY = LOG_ROTATION.yaw;
    let currentX = targetX;
    let currentY = targetY;
    let visible = true;
    let frame = 0;
    let width = 0;
    let height = 0;

    const paint = (rotX: number, rotY: number) => {
      drawLog(context, { width, height, rotX, rotY, palette });
    };

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;

      // Cap at 2x: a 3x phone would quadruple the pixels for no visible gain.
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      const nextWidth = Math.round(width * ratio);
      const nextHeight = Math.round(height * ratio);
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      return true;
    };

    const render = () => {
      frame = 0;
      if (!visible) return;
      if (!size()) return;

      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      paint(currentX, currentY);

      const settled =
        Math.abs(targetX - currentX) < 0.0008 &&
        Math.abs(targetY - currentY) < 0.0008;

      if (!settled) {
        frame = requestAnimationFrame(render);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onScroll = () => {
      if (reduced.matches) return;
      const rect = canvas.getBoundingClientRect();
      // Progress across the first viewport gives the illustration one small
      // change of angle, then it rests for the rest of the page.
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, window.innerHeight * 0.9)),
      );
      targetY = LOG_ROTATION.yaw + progress * 0.12;
      targetX = LOG_ROTATION.pitch + progress * 0.04;
      schedule();
    };

    // A theme change swaps the tokens the canvas reads.
    const observer = new MutationObserver(() => {
      palette = readPalette(canvas);
      schedule();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const visibility = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) schedule();
      },
      { rootMargin: "120px" },
    );
    visibility.observe(canvas);

    if (reduced.matches) {
      // A single composed still: no scroll listener or motion.
      size();
      paint(LOG_ROTATION.pitch, LOG_ROTATION.yaw);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      // Paint once now rather than waiting for a frame. requestAnimationFrame
      // is paused in a background tab, so a hero that only painted on a frame
      // could arrive blank.
      if (size()) paint(currentX, currentY);
      schedule();
    }

    const onResize = () => {
      if (reduced.matches) {
        size();
        paint(LOG_ROTATION.pitch, LOG_ROTATION.yaw);
        return;
      }
      onScroll();
      schedule();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (failed) {
    // No canvas: fall back to the flat SVG rings, which draw the same data.
    return (
      <div className="log log--fallback">
        <RingField />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className ? `log ${className}` : "log"}
      aria-hidden="true"
    />
  );
}
