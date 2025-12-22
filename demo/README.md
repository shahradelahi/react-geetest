# GeeTest React Demo (Hono + Vite)

This is a demo project for `react-geetest-v4` using Hono for server-side validation and React for the frontend.

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open your browser at `http://localhost:5173`.

## Structure

- `src/server.ts`: Hono backend handling captcha validation.
- `src/client.tsx`: React frontend using the `GeeTest` component.
- `vite.config.ts`: Vite configuration with Hono dev server integration.
