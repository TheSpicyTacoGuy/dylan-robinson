import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { roles } from "../content";
import { arcPath, buildRings, polar } from "../lib/rings";

const SIZE = 1000;
const CENTRE = SIZE / 2;
const MONTHS = 12;
const DEGREES_PER_MONTH = 360 / MONTHS;
const DEFAULT_ID = roles.find((role) => role.end === null)?.id ?? roles[0].id;

export function RingTimeline() {
  const model = useMemo(() => buildRings(roles, SIZE), []);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [drawn, setDrawn] = useState(false);

  const activeId = pinnedId ?? hoverId ?? DEFAULT_ID;
  const active = roles.find((role) => role.id === activeId) ?? roles[0];
  const step = (model.outerRadius - model.innerRadius) / model.rings.length;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // A pinned role can be cleared from anywhere, not only while the legend has
  // focus. Escape in the lightbox calls preventDefault, so that one wins.
  useEffect(() => {
    if (!pinnedId) return;

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setPinnedId(null);
      setHoverId(null);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pinnedId]);

  /**
   * Hit testing by geometry rather than by element. The arcs have gaps between
   * them, and hovering a gap used to clear the selection, which made the
   * diagram flicker and feel unresponsive. Radius picks the ring and the
   * track, angle picks the month, so the whole annulus is a target.
   */
  const pick = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return null;

    const rect = stage.getBoundingClientRect();
    if (rect.width === 0) return null;

    const scale = SIZE / rect.width;
    const x = (clientX - rect.left) * scale;
    const y = (clientY - rect.top) * scale;
    const dx = x - CENTRE;
    const dy = y - CENTRE;
    const radius = Math.hypot(dx, dy);

    if (radius < model.innerRadius - step || radius > model.outerRadius + step) {
      return null;
    }

    const ring = model.rings.reduce((best, item) =>
      Math.abs(item.radius - radius) < Math.abs(best.radius - radius)
        ? item
        : best,
    );

    if (Math.abs(ring.radius - radius) > step * 0.9) return null;

    const degrees = (Math.atan2(dy, dx) * 180) / Math.PI;
    const fromTop = ((degrees + 90) % 360 + 360) % 360;
    const month = Math.floor(fromTop / DEGREES_PER_MONTH);

    const arc = ring.arcs
      .filter(
        (item) =>
          month < Math.round((item.endAngle - item.startAngle) / DEGREES_PER_MONTH),
      )
      .reduce<(typeof ring.arcs)[number] | null>(
        (best, item) =>
          !best ||
          Math.abs(item.radius - radius) < Math.abs(best.radius - radius)
            ? item
            : best,
        null,
      );

    return arc?.roleId ?? null;
  };

  const toggle = (id: string | null) => {
    if (!id) {
      setPinnedId(null);
      return;
    }
    setPinnedId((current) => (current === id ? null : id));
  };

  const moveFocus = (direction: number) => {
    const buttons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-role]") ??
        [],
    );
    if (buttons.length === 0) return;
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      buttons[(current + direction + buttons.length) % buttons.length];
    next.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(1);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(-1);
      return;
    }
    if (event.key === "Escape") {
      setPinnedId(null);
      setHoverId(null);
    }
  };

  const nowAngle = -90 + (model.currentMonth / MONTHS) * 360;
  const nowStart = polar(CENTRE, CENTRE, model.outerRadius + 4, nowAngle);
  const nowEnd = polar(CENTRE, CENTRE, model.outerRadius + 16, nowAngle);
  const nowLabel = polar(CENTRE, CENTRE, model.outerRadius + 34, nowAngle);

  return (
    <div className="rings">
      <div
        ref={stageRef}
        className={[
          "rings__stage",
          drawn ? "is-drawn" : "",
          hoverId ? "is-hit" : "",
          pinnedId ? "is-pinned" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          setHoverId(pick(event.clientX, event.clientY));
        }}
        onPointerLeave={() => setHoverId(null)}
        onClick={(event) => toggle(pick(event.clientX, event.clientY))}
      >
        <svg
          className="rings__svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          focusable="false"
        >
          {model.rings.map((ring, ringIndex) => (
            <g key={ring.year}>
              <circle
                className="rings__base"
                cx={CENTRE}
                cy={CENTRE}
                r={ring.radius}
                strokeWidth={1}
              />
              {ring.arcs.map((arc) => (
                <path
                  key={`${ring.year}-${arc.roleId}`}
                  className={
                    arc.roleId === activeId
                      ? "rings__arc is-active"
                      : "rings__arc"
                  }
                  d={arcPath(
                    CENTRE,
                    CENTRE,
                    arc.radius,
                    arc.startAngle,
                    arc.endAngle,
                  )}
                  pathLength={1}
                  strokeWidth={
                    arc.roleId === activeId
                      ? arc.thickness * 1.2
                      : arc.thickness
                  }
                  style={
                    {
                      "--draw-delay": `${ringIndex * 45}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </g>
          ))}

          {Array.from({ length: MONTHS }, (_, index) => {
            const angle = -90 + (index / MONTHS) * 360;
            const inner = polar(CENTRE, CENTRE, model.outerRadius + 3, angle);
            const outer = polar(CENTRE, CENTRE, model.outerRadius + 9, angle);
            return (
              <line
                key={`tick-${index}`}
                className="rings__tick"
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                strokeWidth={1}
              />
            );
          })}

          <g className="rings__now">
            <line
              x1={nowStart.x}
              y1={nowStart.y}
              x2={nowEnd.x}
              y2={nowEnd.y}
              strokeWidth={1.5}
            />
            <circle cx={nowEnd.x} cy={nowEnd.y} r={4} />
            <text x={nowLabel.x} y={nowLabel.y} textAnchor="middle">
              now
            </text>
          </g>

          <text
            className="rings__month"
            x={CENTRE}
            y={CENTRE - model.outerRadius - 24}
            textAnchor="middle"
          >
            Jan
          </text>
          <text
            className="rings__month"
            x={CENTRE}
            y={CENTRE + model.outerRadius + 36}
            textAnchor="middle"
          >
            Jul
          </text>
        </svg>

        <div className="rings__readout" aria-hidden="true">
          <p className="rings__readout-when">{active.when}</p>
          <p className="rings__readout-name">{active.company}</p>
          <p className="rings__readout-role">{active.title}</p>
        </div>
      </div>

      <ul
        className="rings__legend"
        ref={listRef}
        onKeyDown={onKeyDown}
        aria-label="Roles, each one lights its rings"
      >
        {roles.map((role) => (
          <li
            key={role.id}
            className={
              role.id === activeId ? "legend__item is-active" : "legend__item"
            }
          >
            <span className="legend__node" aria-hidden="true" />
            <button
              type="button"
              className="legend__button"
              data-role={role.id}
              aria-pressed={pinnedId === role.id}
              onFocus={() => setHoverId(role.id)}
              onMouseEnter={() => setHoverId(role.id)}
              onMouseLeave={() => setHoverId(null)}
              onBlur={() => setHoverId(null)}
              onClick={() => toggle(role.id)}
            >
              <span className="legend__when">{role.when}</span>
              <span className="legend__company">{role.company}</span>
              <span className="legend__role">
                {role.title}, {role.place}
              </span>
              {role.note && <span className="legend__note">{role.note}</span>}
            </button>
          </li>
        ))}
      </ul>

      <p className="rings__caption">
        Each ring is a year, from {model.rings[0]?.year} to{" "}
        {model.currentYear}, and the accent outside marks this year so far.
        Months run clockwise from January at the top. Years only, so a role that
        starts or ends mid year is drawn as the full year. Point at a ring, or
        pick a role, to light it.
      </p>
    </div>
  );
}
