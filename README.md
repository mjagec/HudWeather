# HudWeather

HudWeather is a simple weather dashboard that consumes the [OpenWeather](https://openweathermap.org/) API. It is built with **HTML**, **Sass/CSS**, and **vanilla JavaScript**, and is designed to be deployed on **Vercel** using serverless API routes.

## Features

- Current weather panel with temperature, feels-like, humidity, pressure, wind, sunrise, and sunset.
- 5-day forecast using the OpenWeather `forecast` endpoint.
- **Auto-location support** using the browser's Geolocation API (over HTTPS).
- **Manual UK city selection** as a fallback / override via a dropdown.
- Graceful error messages when weather or forecast data is unavailable.

## Tech stack

- HTML for structure (`index.html`).
- Sass/CSS for styling (compiled into `style/style.css`).
- Vanilla JavaScript (`current.js`) for DOM updates and API calls.
- Vercel serverless functions under `api/` for secure access to OpenWeather:
  - `api/weather.js` – current conditions.
  - `api/forecast.js` – 5-day / 3-hour forecast.

## How it works

### Frontend

On page load, `current.js` will:

1. Try to get the user's current location via `navigator.geolocation`.
2. If successful, call `/api/weather` and `/api/forecast` with the detected `lat`/`lon`.
3. If geolocation fails or is not supported, it falls back to **Huddersfield** by default.
4. Users can also manually pick a city from the UK cities dropdown, which will re-request weather/forecast for that city's coordinates.

### Backend (Vercel API routes)

The API routes are thin wrappers around OpenWeather:

- `api/weather.js` expects `lat` and `lon` query parameters and proxies to `https://api.openweathermap.org/data/2.5/weather`.
- `api/forecast.js` expects the same and proxies to `https://api.openweathermap.org/data/2.5/forecast`.

Both routes read the API key from the environment variable `OPENWEATHER_API_KEY`.

## Running locally

This repo does not depend on any specific Node framework, but the `api/` directory assumes a Vercel/Next-style serverless environment.

### Prerequisites

- Node.js (for running a local dev server if you want).
- A free OpenWeather account and API key.

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/HudWeather.git
   cd HudWeather
   ```

2. **Configure your API key**

   On Vercel, set an environment variable named `OPENWEATHER_API_KEY` in your project settings.

   For local development with the Vercel CLI, you can run:

   ```bash
   vercel env add OPENWEATHER_API_KEY
   ```

   and follow the prompts, or use a `.env` file depending on your setup.

3. **Run locally (with Vercel CLI)**

   ```bash
   npm install -g vercel
   vercel dev
   ```

   Then open the printed localhost URL in your browser. The `/api/*` routes will proxy to OpenWeather.

> If you don't want to use Vercel locally, you can still open `index.html` directly in a browser, but the `/api/*` calls will not work unless you provide your own backend proxy.

## Deployment

The app is intended to be deployed on **Vercel**:

1. Push this repository to GitHub.
2. Create a new project on Vercel, importing from your GitHub repo.
3. Set the `OPENWEATHER_API_KEY` environment variable in the Vercel dashboard.
4. Deploy. Vercel will serve `index.html` as a static file and treat files under `api/` as serverless functions.

## Notes for reviewers (internships)

- This project demonstrates:
  - Use of a third-party REST API (OpenWeather) with environment-based secrets.
  - Working with browser APIs (`navigator.geolocation`).
  - DOM manipulation, async JavaScript (`fetch`, Promises), and basic error handling.
  - A simple but responsive UI built without any frontend framework.

Feel free to open issues or suggestions in the GitHub repo if you have feedback.
