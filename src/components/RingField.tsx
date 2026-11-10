import { useMemo } from "react";
import { roles } from "../content";
import { arcPath, buildRings } from "../lib/rings";

const SIZE = 1000;

/**
 * The decorative field behind the hero. Same year data as the timeline, drawn
 * once at low contrast so the motif is the site's own record, not a pattern.
 */
export function RingField() {
  const model = useMemo(() => buildRings(roles, SIZE), []);
  const centre = SIZE / 2;

  return (
    <svg
      className="ring-field__svg"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
    >
      {model.rings.map((ring) => (
        <g key={ring.year}>
          <circle
            cx={centre}
            cy={centre}
            r={ring.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
            opacity={0.32}
          />
          {ring.arcs.map((arc) => (
            <path
              key={`${ring.year}-${arc.roleId}`}
              d={arcPath(
                centre,
                centre,
                arc.radius,
                arc.startAngle,
                arc.endAngle,
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth={arc.thickness}
              opacity={arc.roleId === "ctrl" ? 0.9 : 0.5}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
