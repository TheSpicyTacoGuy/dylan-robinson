import { useEffect, useRef, useState } from "react";
import { drawLog, LOG_ROTATION, type Palette } from "../lib/log3d";
import { RingField } from "./RingField";

/** Reads the log's colours from the theme tokens so it never hardcodes a hex. */
const readPalette = (canvas: HTMLCanvasElement): Palette => {
  const styles = getComputedStyle(canvas);
  const token = (name: string) => styles.getPropertyValue(name).trim();

  return {
    bark: token("--log-bark"),
    barkDark: token("--log-bark-dark"),
    barkShadow: token("--log-shadow"),
    barkLight: token("--log-bark-light"),
    face: token("--log-face"),
    faceDark: token("--log-face-dark"),
    ring: token("--log-ring"),
    pith: token("--log-pith"),
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

    // The log makes one bounded roll as its scene leaves. Smoothing keeps the
    // object connected to the scroll without snapping on a fast wheel movement.
    let targetX = LOG_ROTATION.pitch;
    let targetY = LOG_ROTATION.yaw;
    let currentX = targetX;
    let currentY = targetY;
    let visible = false;
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
      if (visible && !frame) frame = requestAnimationFrame(render);
    };

    const onScroll = () => {
      if (reduced.matches || !visible) return;
      const scene = canvas.closest<HTMLElement>(".log-scene") ?? canvas;
      const rect = scene.getBoundingClientRect();
      // Map this scene's passage to one modest turn, then leave the log still.
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, rect.height)),
      );
      targetY = LOG_ROTATION.yaw + progress * 0.55;
      targetX = LOG_ROTATION.pitch + progress * 0.12;
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
        if (visible && !reduced.matches) {
          onScroll();
          schedule();
        }
      },
      { rootMargin: "0px" },
    );
    visibility.observe(canvas);

    if (reduced.matches) {
      // A single composed still: no scroll listener or motion.
      size();
      paint(LOG_ROTATION.pitch, LOG_ROTATION.yaw);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const onResize = () => {
      if (reduced.matches) {
        size();
        paint(LOG_ROTATION.pitch, LOG_ROTATION.yaw);
        return;
      }
      if (!visible) return;
      onScroll();
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
