/**
 * GitHub contribution calendar for the home page.
 *
 * A Vercel Node function, the only server-side code on the site. The GraphQL
 * contributions collection needs a token, so the browser asks this endpoint and
 * this endpoint asks GitHub. The token stays in the deployment environment.
 */

const ENDPOINT = "https://api.github.com/graphql";

const LOGIN = process.env.GITHUB_LOGIN || "TheSpicyTacoGuy";

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`;

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error("contributions: GITHUB_TOKEN is not set");
    response.status(503).json({ error: "GitHub is not configured" });
    return;
  }

  let github;

  try {
    github = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "dylan-robinson-portfolio",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
    });
  } catch (error) {
    console.error("contributions: request failed", error);
    response.status(502).json({ error: "GitHub request failed" });
    return;
  }

  if (!github.ok) {
    console.error(`contributions: GitHub responded ${github.status}`);
    response.status(502).json({ error: "GitHub request failed" });
    return;
  }

  const body = await github.json();
  const calendar = body?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    console.error("contributions: no calendar in the response", body?.errors);
    response.status(502).json({ error: "GitHub returned no calendar" });
    return;
  }

  const weeks = calendar.weeks.map((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVELS[day.contributionLevel] ?? 0,
    })),
  );

  const days = weeks.flat();

  // An hour at the CDN, a day of grace behind it. The graph is a year of
  // history, so an hour of staleness costs nothing and keeps the token well
  // inside its rate limit.
  response.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  response.status(200).json({
    login: LOGIN,
    total: calendar.totalContributions,
    from: days[0]?.date ?? null,
    to: days[days.length - 1]?.date ?? null,
    weeks,
  });
}
