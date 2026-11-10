import type { Role } from "../content";

export const FIRST_YEAR = 2014;

export type RingArc = {
  roleId: string;
  year: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  thickness: number;
};

export type Ring = {
  year: number;
  radius: number;
  thickness: number;
  arcs: RingArc[];
  open: boolean;
};

export type RingModel = {
  rings: Ring[];
  innerRadius: number;
  outerRadius: number;
  currentYear: number;
  currentMonth: number;
};

const MONTHS = 12;

export function buildRings(
  roles: Role[],
  size = 1000,
  now = new Date(),
): RingModel {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const first = Math.min(FIRST_YEAR, ...roles.map((role) => role.start));
  const last = Math.max(
    currentYear,
    ...roles.map((role) => role.end ?? currentYear),
  );
  const count = last - first + 1;
  const innerRadius = size * 0.26;
  const outerRadius = size * 0.47;
  const step = (outerRadius - innerRadius) / count;
  const rings: Ring[] = [];

  for (let index = 0; index < count; index += 1) {
    const year = first + index;
    const radius = innerRadius + step * (index + 0.5);
    // Nearly the whole band, so the rings read as one continuous section with
    // hairline divisions rather than a stack of separate hoops.
    const thickness = step * 0.94;

    const active = roles
      .filter(
        (role) => year >= role.start && year <= (role.end ?? currentYear),
      )
      .sort((a, b) => a.start - b.start || a.id.localeCompare(b.id));

    const tracks = active.length;

    const arcs = active.map((role, track) => {
      // The data records years, not months. A role that starts or ends mid
      // year is drawn as the full year, and the caption says so. The current
      // year is the one honest exception: it is drawn to this month.
      const isCurrent = role.end === null && year === currentYear;
      const endMonth = isCurrent ? currentMonth : MONTHS;
      const startAngle = -90;
      const endAngle = -90 + (endMonth / MONTHS) * 360;
      const trackRadius =
        tracks === 1
          ? radius
          : radius + (track - (tracks - 1) / 2) * (thickness / tracks);

      return {
        roleId: role.id,
        year,
        radius: trackRadius,
        startAngle,
        endAngle,
        thickness: Math.max(2, thickness / tracks - 1),
      };
    });

    rings.push({
      year,
      radius,
      thickness,
      arcs,
      open: year === currentYear,
    });
  }

  return {
    rings,
    innerRadius,
    outerRadius,
    currentYear,
    currentMonth,
  };
}

export function polar(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

export function arcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const sweep = endAngle - startAngle;
  const start = polar(cx, cy, radius, startAngle);

  if (sweep >= 359.999) {
    const middle = polar(cx, cy, radius, startAngle + 180);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${middle.x} ${middle.y} A ${radius} ${radius} 0 1 1 ${start.x} ${start.y}`;
  }

  const end = polar(cx, cy, radius, endAngle);
  const largeArc = sweep > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
