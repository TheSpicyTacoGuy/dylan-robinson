import { CHECKS, GRAIN } from "./grain";

/**
 * A log built as a real cylinder: two end rings joined by bark panels, rotated
 * on two axes and drawn back to front.
 *
 * The order matters. Every face and every bark panel goes into one queue with
 * its depth, the queue is sorted, and then it is painted. That is what makes a
 * solid log: the wall hides the far end, the near end hides the inside of the
 * wall, and no part of the page can show through.
 *
 * Not a library in sight. A few hundred points and a sort, once per frame.
 */

export type Palette = {
  bark: string;
  barkDark: string;
  barkShadow: string;
  barkLight: string;
  face: string;
  faceDark: string;
  ring: string;
  pith: string;
};

type Vertex = { x: number; y: number; z: number };

const TAU = Math.PI * 2;
const SEGMENTS = 56;
/** Object units. The log is a little over three times as long as it is wide. */
const RADIUS = 1;
const LENGTH = 3.3;
/** A long lens, so the near end is slightly larger without bending the bark. */
const CAMERA = 9;

/**
 * Roughness of stringybark, fixed per segment so it does not crawl as the log
 * turns. Layered frequencies give ridges of different widths.
 */
const BARK = Array.from({ length: SEGMENTS + 1 }, (_, index) => {
  const theta = (index / SEGMENTS) * TAU;
  return (
    Math.sin(theta * 7) * 0.028 +
    Math.cos(theta * 13) * 0.016 +
    Math.sin(theta * 3) * 0.012
  );
});

/** A fixed pseudo-random value per integer, so texture never flickers. */
const hash = (seed: number) => {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
};

export const LOG_ROTATION = {
  pitch: -0.34,
  yaw: 0.62,
};

export function drawLog(
  ctx: CanvasRenderingContext2D,
  options: {
    width: number;
    height: number;
    /** Pitch, tipping the log toward or away from the viewer. */
    rotX: number;
    /** Yaw, spinning it round its own length. Any value is valid. */
    rotY: number;
    palette: Palette;
  },
) {
  const { width, height, rotX, rotY, palette } = options;
  const cx = width / 2;
  // The shadow hangs below the log, so the pair is nudged up to sit centred.
  const cy = height / 2 - Math.min(width, height) * 0.045;
  const scale = Math.min(width, height) * 0.185;

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);

  const project = (x: number, y: number, z: number): Vertex => {
    const xr = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const yr = y * cosX - z1 * sinX;
    const zr = y * sinX + z1 * cosX;
    const lens = CAMERA / (CAMERA - zr);
    return {
      x: cx + xr * scale * lens,
      y: cy + yr * scale * lens,
      z: zr,
    };
  };

  const half = LENGTH / 2;
  const near = project(0, 0, half);
  const far = project(0, 0, -half);
  const nearIsPositive = near.z > far.z;

  const ringAt = (z: number) =>
    Array.from({ length: SEGMENTS + 1 }, (_, index) => {
      const theta = (index / SEGMENTS) * TAU;
      const r = RADIUS + BARK[index % SEGMENTS];
      return project(Math.cos(theta) * r, Math.sin(theta) * r, z);
    });

  const frontRing = ringAt(half);
  const backRing = ringAt(-half);

  type Item =
    | { kind: "face"; z: number; points: Vertex[]; side: "near" | "far" }
    | { kind: "panel"; z: number; points: Vertex[]; shade: number; index: number };

  const queue: Item[] = [
    {
      kind: "face",
      z: frontRing.reduce((sum, v) => sum + v.z, 0) / frontRing.length,
      points: frontRing,
      side: nearIsPositive ? "near" : "far",
    },
    {
      kind: "face",
      z: backRing.reduce((sum, v) => sum + v.z, 0) / backRing.length,
      points: backRing,
      side: nearIsPositive ? "far" : "near",
    },
  ];

  for (let index = 0; index < SEGMENTS; index += 1) {
    const p1 = frontRing[index];
    const p2 = frontRing[index + 1];
    const p3 = backRing[index + 1];
    const p4 = backRing[index];

    // Backface culling in screen space: only panels facing the viewer are drawn,
    // so the inside of the far wall never appears.
    const facing = (p2.x - p1.x) * (p4.y - p1.y) - (p2.y - p1.y) * (p4.x - p1.x);
    if (facing >= 0) continue;

    const normalAngle = (index / SEGMENTS) * TAU + rotY;
    const shade = Math.max(0.1, Math.min(1, Math.sin(normalAngle) * 0.42 + 0.6));

    queue.push({
      kind: "panel",
      z: (p1.z + p2.z + p3.z + p4.z) / 4,
      points: [p1, p2, p3, p4],
      shade,
      index,
    });
  }

  queue.sort((a, b) => a.z - b.z);

  ctx.clearRect(0, 0, width, height);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const trace = (points: Vertex[]) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
  };

  // The shadow, cast on the ground under the log. It is derived from the whole
  // silhouette and sits at its lowest point, so it never drifts off when the log
  // rolls or tips.
  const xs = [...frontRing, ...backRing].map((v) => v.x);
  const ys = [...frontRing, ...backRing].map((v) => v.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const shadowWidth = (maxX - minX) / 2;

  ctx.save();
  ctx.translate((minX + maxX) / 2, maxY);
  ctx.scale(1, 0.2);
  const shadow = ctx.createRadialGradient(
    0,
    0,
    shadowWidth * 0.2,
    0,
    0,
    shadowWidth * 1.02,
  );
  shadow.addColorStop(0, "rgba(0,0,0,0.5)");
  shadow.addColorStop(0.6, "rgba(0,0,0,0.22)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(0, 0, shadowWidth * 1.02, 0, TAU);
  ctx.fill();
  ctx.restore();

  // The silhouette of the two rings is the log's outline. Filling it first in
  // bark means the hairline where two panels meet can never show the page: the
  // wall is opaque before a single lit panel is laid on it.
  const silhouette = [...frontRing, ...backRing];
  silhouette.sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Vertex, a: Vertex, b: Vertex) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Vertex[] = [];
  for (const point of silhouette) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: Vertex[] = [];
  for (let i = silhouette.length - 1; i >= 0; i -= 1) {
    const point = silhouette[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop();
    }
    upper.push(point);
  }
  trace([...lower.slice(0, -1), ...upper.slice(0, -1)]);
  ctx.fillStyle = palette.barkDark;
  ctx.fill();
  // A few pixels of the same bark round off the antialiased edge, so a row that
  // grazes a nearly flat part of the outline still comes out solid.
  ctx.strokeStyle = palette.barkDark;
  ctx.lineWidth = 6;
  ctx.stroke();

  const mix = (from: string, to: string, t: number) => {
    const parse = (hex: string) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
    const [r1, g1, b1] = parse(from);
    const [r2, g2, b2] = parse(to);
    const k = Math.max(0, Math.min(1, t));
    return `rgb(${Math.round(r1 + (r2 - r1) * k)},${Math.round(
      g1 + (g2 - g1) * k,
    )},${Math.round(b1 + (b2 - b1) * k)})`;
  };

  for (const item of queue) {
    trace(item.points);

    if (item.kind === "panel") {
      const [p1, p2, p3, p4] = item.points;
      const along = (from: Vertex, to: Vertex, t: number) => ({
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
        z: 0,
      });

      // Stringybark is fibrous lengthwise, so each panel is cut into thin strips
      // of slightly different tone. The same panel keeps the same strips at
      // every angle, so the texture rides round with the log instead of crawling.
      const STRIPS = 4;
      for (let strip = 0; strip < STRIPS; strip += 1) {
        const from = strip / STRIPS;
        const to = (strip + 1) / STRIPS;
        const jitter = hash(item.index * 13 + strip * 7) - 0.5;
        const tone = item.shade + jitter * 0.26;

        ctx.beginPath();
        const a = along(p1, p2, from);
        const b = along(p1, p2, to);
        const c = along(p4, p3, to);
        const d = along(p4, p3, from);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.closePath();
        ctx.fillStyle = mix(palette.barkDark, palette.barkLight, tone);
        ctx.fill();
        // A hairline of the same colour closes the seam at every strip edge.
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // A darker fibre down the occasional strip, deep enough to catch the eye
      // without drawing a stripe pattern.
      if (hash(item.index * 31.7) > 0.52) {
        const deep = along(p1, p2, 0.5);
        const deepFar = along(p4, p3, 0.5);
        ctx.beginPath();
        ctx.moveTo(deep.x, deep.y);
        ctx.lineTo(deepFar.x, deepFar.y);
        ctx.strokeStyle = palette.barkDark;
        ctx.globalAlpha = 0.22 + hash(item.index * 5.3) * 0.2;
        ctx.lineWidth = Math.max(0.8, scale * 0.008);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      continue;
    }

    // An end. The one facing the viewer gets the pale sawn face and the rings.
    const isNear = item.side === "near";
    ctx.fillStyle = isNear ? palette.face : palette.faceDark;
    ctx.fill();

    if (!isNear) continue;

    const z = nearIsPositive ? half : -half;

    ctx.save();
    trace(item.points);
    ctx.clip();

    ctx.strokeStyle = palette.ring;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = Math.max(0.5, scale * 0.007);
    for (const path of GRAIN) {
      ctx.beginPath();
      for (let i = 0; i < path.length; i += 2) {
        const point = project(path[i] * RADIUS, path[i + 1] * RADIUS, z);
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.strokeStyle = palette.barkDark;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = Math.max(0.6, scale * 0.008);
    for (const check of CHECKS) {
      ctx.beginPath();
      for (let i = 0; i < check.length; i += 2) {
        const point = project(check[i] * RADIUS, check[i + 1] * RADIUS, z);
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }

    ctx.restore();

    const pith = project(0, 0, z);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = palette.pith;
    ctx.beginPath();
    ctx.arc(pith.x, pith.y, Math.max(1.4, scale * 0.03), 0, TAU);
    ctx.fill();

    // The bark collar around the sawn face.
    ctx.globalAlpha = 1;
    ctx.strokeStyle = palette.bark;
    ctx.lineWidth = Math.max(1.4, scale * 0.03);
    trace(item.points);
    ctx.stroke();
  }
}