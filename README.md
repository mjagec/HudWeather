# 🌤️ HudWeather – A Clean & Snappy Weather Dashboard
<img width="737" height="443" alt="image" src="https://github.com/user-attachments/assets/8d2c2b24-2340-432c-9c20-0e6f2f527f98" />




**Live Demo** → [Vercel Deployment](https://hud-weather.vercel.app/)

HudWeather is a lightweight, framework-free weather dashboard that looks sharp and loads instantly ⚡. Built with pure HTML, Sass/CSS, and vanilla JavaScript – perfect for showing off clean code in internship applications!

## ✨ Features

- 🌡️ **Current weather panel** – temperature, feels-like, humidity, pressure, wind speed/direction, sunrise & sunset times  
- 📅 **5-day / 3-hour forecast** – beautiful daily cards with icons  
- 📍 **Auto-location** via browser Geolocation API (HTTPS only)  
- 🇬🇧 **Manual UK city picker** – instant override with a sleek dropdown  
- 🚫 **Graceful fallbacks & error messages** – no ugly broken pages  
- 🔒 **Secure API key handling** – never exposed to the browser  

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Markup      | HTML5                               |
| Styling     | Sass → compiled to `/style/style.css` |
| Logic       | Vanilla JavaScript (`current.js`)   |
| Backend     | Vercel Serverless Functions (`/api`) |
| Weather     | OpenWeatherMap API                  |
| Deployment  | Vercel (zero-config)                |

## 🚀 How It Works

### Frontend Flow
```js
page load
  → try navigator.geolocation 🌍
      → success → fetch /api/weather & /api/forecast
      → fail    → default to drop down city.
  → user picks city from dropdown → refetch instantly
```

### Backend – Super-thin Vercel Functions
- `/api/weather.js`  → proxies `lat/lon` → OpenWeather `current` endpoint  
- `/api/forecast.js` → proxies `lat/lon` → OpenWeather `forecast` endpoint  

Your API key lives safely in `OPENWEATHER_API_KEY` environment variable – never touches the client! 🛡️

## 🛠️ Local Development

### Prerequisites
- Node.js
- Free [OpenWeatherMap API key](https://openweathermap.org/api)

### Quick Start
```bash
git clone https://github.com/your-username/HudWeather.git
cd HudWeather

# Add your API key locally (Vercel CLI)
vercel env add OPENWEATHER_API_KEY

# Or create a .env file (if using vercel dev)
echo "OPENWEATHER_API_KEY=your_key_here" > .env.local

# Run locally
vercel dev
```

Open the URL it prints (usually http://localhost:3000) and enjoy! 🚀

*Want to open `index.html` directly?* You can, but you’ll need your own proxy because the API key would be exposed.

## ☁️ Deploy to Vercel (One-Click)

1. Push to GitHub  
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo  
3. Add `OPENWEATHER_API_KEY` in Project Settings → Environment Variables  
4. Deploy! Vercel auto-detects static files + `/api` functions  

## 🎨 For Internships

- Clean, readable vanilla JS (no framework bloat)  
- Proper handling of async operations & errors  
- Secure API key management with serverless functions  
- Real-world use of browser Geolocation API  
- Responsive, mobile-friendly design with zero dependencies  
- Production-ready deployment workflow  

## ❤️ Feedback & Contributions

Found a bug or have a cool idea? Open an issue.  

Star ⭐ the repo if you like it – helps a ton with internship apps!

---
