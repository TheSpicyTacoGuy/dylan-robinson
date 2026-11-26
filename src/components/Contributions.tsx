import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { GITHUB_URL } from "../content";

type Day = {
  date: string;
  count: number;
  level: number;
};

type Calendar = {
  total: number;
  from: string | null;
  to: string | null;
  weeks: Day[][];
};

const numberOf = new Intl.NumberFormat("en-AU");
const monthAndYear = new Intl.DateTimeFormat("en-AU", {
  month: "short",
  year: "numeric",
});
const longDate = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

const commits = (count: number) =>
  count === 1 ? "1 contribution" : `${numberOf.format(count)} contributions`;

/**
 * The GitHub calendar, fetched from the site's own endpoint. It is an extra on
 * the title page, so a slow or failed request simply leaves the band out.
 */
export function Contributions() {
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [hovered, setHovered] = useState<Day | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/contributions", { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<Calendar>) : null))
      .then((data) => {
        if (data) setCalendar(data);
      })
      .catch(() => {
        // Aborted, offline or unconfigured: the page keeps its other bands.
      });

    return () => controller.abort();
  }, []);

  if (!calendar || calendar.weeks.length === 0) return null;

  const { total, from, to, weeks } = calendar;
  const first = weeks[0][0];

  // The calendar starts mid-week, so the first column is padded at the top to
  // keep every dot on its weekday row.
  const lead = first ? toDate(first.date).getDay() : 0;

  const summary =
    from && to
      ? `${commits(total)} to GitHub between ${longDate.format(toDate(from))} and ${longDate.format(toDate(to))}.`
      : `${commits(total)} to GitHub in the last twelve months.`;

  const range =
    from && to
      ? `${monthAndYear.format(toDate(from))} to ${monthAndYear.format(toDate(to))}`
      : "last twelve months";

  return (
    <div className="hero__activity">
      <div className="hero__activity-head">
        <p>
          {hovered ? (
            longDate.format(toDate(hovered.date))
          ) : (
            <>
              Contributions to{" "}
              <a
                className="hero__activity-link"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              , {range}
            </>
          )}
        </p>
        <p className="hero__activity-total">
          {hovered ? commits(hovered.count) : `${numberOf.format(total)} total`}
        </p>
      </div>

      <div
        className="hero__plot"
        role="img"
        aria-label={summary}
        onPointerLeave={() => setHovered(null)}
      >
        {weeks.map((week, column) => (
          <div
            className="hero__week"
            key={week[0]?.date ?? column}
            style={{ "--col": column } as CSSProperties}
          >
            {column === 0 &&
              Array.from({ length: lead }, (_, blank) => <span key={`blank-${blank}`} />)}

            {week.map((day) => (
              <span
                key={day.date}
                className={`hero__day hero__day--${day.level}`}
                onPointerEnter={() => setHovered(day)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
