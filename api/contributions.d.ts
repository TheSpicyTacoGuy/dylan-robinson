/**
 * The shape `api/contributions.js` is written against: a slice of the Vercel
 * node helper, which the dev server bridge in vite.config.ts mirrors.
 */
export type ApiRequest = {
  method?: string;
};

export type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
};

declare function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void>;

export default handler;
