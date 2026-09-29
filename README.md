<p align="center">
  <a href="https://github.com/mizan989/Skylio-Weather_App">
    <img src="./public/favicon.svg" alt="Skylio Logo" width="100" height="100">
  </a>
</p>

<div align="center">

# Skylio

### The minimalist precision atmospheric intelligence platform & celestial forecast engine. Real-time meteorological telemetry, dynamic solar horizon gradients, particle atmospheric canvas, and fluid kinetic physics.

<br/>

<a href="#-quick-start"><img src="https://img.shields.io/badge/Docs-Quickstart-0284C7?style=for-the-badge&logo=gitbook&logoColor=white" alt="Docs"></a>
<a href="https://github.com/mizan989/Skylio-Weather_App"><img src="https://img.shields.io/badge/Website-Skylio-f0f0f0?style=for-the-badge&logoColor=000000" alt="Website"></a>
<a href="https://github.com/mizan989/Skylio-Weather_App/discussions"><img src="https://img.shields.io/badge/Community-Discussions-0284C7?style=for-the-badge&logo=github&logoColor=white" alt="Discussions"></a>

<a href="#-ways-to-run-skylio"><img src="https://img.shields.io/badge/Skylio%20App-React%2019%20%2B%20Vite-0284C7?style=for-the-badge&logoColor=white" alt="Skylio App"></a>
<a href="https://github.com/mizan989/Skylio-Weather_App"><img src="https://img.shields.io/badge/GitHub-Repository-0EA5E9?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository"></a>

<a href="https://github.com/mizan989/Skylio-Weather_App/stargazers"><img src="https://img.shields.io/github/stars/mizan989/Skylio-Weather_App?style=flat-square" alt="GitHub Stars"></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-0284c7?style=flat-square" alt="License"></a>
<a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react" alt="React"></a>
<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript"></a>
<a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
<a href="https://open-meteo.com"><img src="https://img.shields.io/badge/API-Open--Meteo-orange?style=flat-square" alt="Open-Meteo"></a>
<a href="https://framer.com/motion"><img src="https://img.shields.io/badge/Motion-Framer_Motion-black?style=flat-square&logo=framer" alt="Framer Motion"></a>

</div>

> [!TIP]
> **Minimalist Precision Forecast Ready!** Experience real-time meteorological calculations, dynamic diurnal horizon gradients, interactive 24-hour hourly trend analytics, and atmospheric telemetry bento grids — [Get started locally in under 60 seconds](#-quick-start).

---

## Skylio Overview

Skylio is an open-source, minimalist precision weather web application and celestial telemetry engine. Engineered to replace cluttered, ad-heavy meteorological dashboards with typographic elegance and scientific clarity, Skylio presents weather as a quiet, atmospheric discipline: real-time meteorological metrics, 24-hour barometric trends, and a signature dynamic **horizon line**—a hairline gradient that shifts chromatic hues in real time according to local solar elevation and WMO weather condition families.

Operating on a direct, client-to-API zero-key architecture powered by **Open-Meteo**, Skylio queries high-resolution global numerical weather prediction models (including ECMWF, GFS, and DWD ICON). All coordinates, search history, pinned locations, and temperature preferences are handled directly in volatile browser memory and persisted privately in client `localStorage`—guaranteeing complete user privacy with zero tracking, zero telemetry logging, and zero third-party cookies.

**Key Capabilities:**

- **Zero-Key Open Meteorological Architecture** — Direct, unencumbered client queries to high-resolution ECMWF and GFS numerical models via Open-Meteo REST endpoints
- **Dynamic Diurnal Horizon Engine** — Signature hairline gradient dynamically computing ambient solar elevations and chromatic shifts between daylight gold-blues, twilight purples, and deep nocturnal indigos
- **Reactive 2D Particle Canvas** — Hardware-accelerated canvas particle simulation rendering adaptive atmospheric phenomena (rain streaks, snow drift, cloud fog, and celestial meteors)
- **Precision Meteorological Telemetry** — Microclimate metrics comprising hourly barometric curves, precipitation probability, relative humidity, UV index, dew point, and wind vectors
- **24-Hour & 7-Day Synoptic Matrices** — Interactive hourly scrubber graphs paired with 7-day temperature spreads, daytime/nighttime variations, and conditions
- **Privacy-First Zero-Tracking Design** — No user registration, no telemetry tracking, and zero advertising cookies; coordinates and bookmarks stay strictly in browser `localStorage`
- **Curated Apple & Linear-Inspired UX** — Space Grotesk display typography, Inter body, IBM Plex Mono telemetry readouts, fluid spring physics, and Lenis momentum scrolling

<br>

<div align="center">
  <pre>
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                     SKYLIO                                      │
│      Location Query ➔ Reverse Geocode ➔ Open-Meteo ➔ Celestial Physics UI      │
├───────────────────────────────┬─────────────────────────────────────────────────┤
│  🌍 Atmospheric Data Engine   │  ✨ Dynamic Diurnal Horizon                     │
│   • Open-Meteo REST telemetry │    [Chromatic Elevation State]                  │
│   • ECMWF & GFS model blends  │       ├── Diurnal Solar Cycle (Dawn/Dusk/Night) │
│   • WMO Weather Code parsing  │       ├── Condition-Reactive Gradient Hues      │
├───────────────────────────────┼─────────────────────────────────────────────────┤
│  📊 Microclimate Telemetry    │  ⚡ Fluid Kinetic Presentation                  │
│   • 24h Hourly Trend Curves   │    • Framer Motion Spring Transitions           │
│   • 7-Day Synoptic Matrix     │    • Lenis Smooth Inertial Scrolling            │
│   • UV, Dew Point, Wind, Baro │    • Canvas Particle Atmospheric Canvas         │
└───────────────────────────────┴─────────────────────────────────────────────────┘
  </pre>
</div>

---

## UI Preview

<p align="center">
  <img src="./assets/screenshot.png" alt="Skylio Weather Interface Preview" width="100%" />
</p>

---

## Meteorological Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Observer / User
    participant Browser as Client Browser (Skylio App)
    participant Geo as Geolocation / Reverse Geocoder
    participant Meteo as Open-Meteo REST API
    participant Horizon as Celestial & Horizon Engine
    participant Canvas as Particle Canvas Renderer

    User->>Browser: Search Location or Click GPS Locate
    Browser->>Geo: Resolve City Name or Reverse Geocode Coordinates
    Geo-->>Browser: Return Normalized Coordinates (Lat / Lon)
    Browser->>Meteo: Fetch Forecast (Current, Hourly 24h, Daily 7-Day, Solar)
    Meteo-->>Browser: Return Meteorological Telemetry JSON
    Browser->>Horizon: Compute Solar Position & Map Condition Family
    Horizon-->>Browser: Update CSS Variables (--horizon-gradient, --sky-bg)
    Browser->>Canvas: Initialize Ambient Weather Particles (Rain / Snow / Meteors)
    Browser-->>User: Render Interactive Bento Dashboard & Synoptic Matrices
```

---

## Use Cases

- **Hyperlocal Daily Decision-Making** — Instant real-time temperature, "feels-like" thermal comfort index, and precipitation warnings
- **Hourly Activity & Travel Planning** — Interactive 24-hour temperature and precipitation curves to pinpoint optimal weather windows
- **Weekly Synoptic Planning** — 7-day multi-day outlook showing daytime highs, overnight lows, and weather progression
- **Extreme Weather & UV Protection** — Real-time UV Index rating (0–11+) and peak sun protection advisory
- **Celestial & Diurnal Monitoring** — Sunrise and sunset timestamps, daylight duration, and day/night celestial transitions
- **Offline & Private Bookmarking** — Fast switching between favorite global cities stored securely in local browser storage

---

## 🚀 Quick Start

**Prerequisites:**
- Node.js 18.x or higher
- Modern web browser with Canvas 2D and CSS custom properties support

### Installation & First Run

```bash
# 1. Clone the repository
git clone https://github.com/mizan989/Skylio-Weather_App.git
cd Skylio-Weather_App

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser to start exploring Skylio.

> [!NOTE]
> **Zero API Keys Required!** Skylio communicates directly with Open-Meteo's open-access meteorological API. You do not need to register developer accounts, sign up for API tokens, or configure billing keys to run the application locally or in production.

---

## Ways to Run Skylio

- **Local Modern Dev Server** — Instant startup and ultra-fast hot module replacement (HMR) powered by Vite 8. [Quick Start](#-quick-start)
- **Production Self-Hosted Bundle** — Compile the client into optimized static assets (`npm run build`) and serve via Nginx, Caddy, Vercel, or GitHub Pages.
- **Preview Staging Instance** — Test production-bundled output locally using `npm run preview`.

---

## ☁️ Atmospheric Workspaces & Views

Skylio delivers dedicated interfaces tailored for atmospheric analysis:

- **Overview Matrix (`Overview` Tab)** — Complete meteorological command center featuring hero temperature, wind bearing, 24h trend graph, telemetry bento, and 7-day forecast.
- **24h Hourly Graph (`24h Hourly` Tab)** — High-precision temperature curves, hourly precipitation probabilities, dew point, and time-scrubbing.
- **7-Day Synoptic Matrix (`7-Day Matrix` Tab)** — 7-day temperature extremes, daily weather condition badges, precipitation percentages, and solar summaries.
- **Atmospheric Bento (`Atmosphere` Tab)** — Granular telemetry cards: UV Index, Relative Humidity, Wind Velocity & Gusts, Atmospheric Pressure, Visibility, and Sunrise/Sunset times.
- **Interactive Search & Pinned Bar** — Debounced geocoding search with instant autocomplete, browser GPS geolocation detection, and persistent bookmarks bar.
- **Governance & Legal Suite (`#privacy` & `#terms`)** — Built-in privacy charter and terms of service modal accessible via hash links or footer navigation.

---

## ✨ Features

### Dynamic Diurnal Horizon Engine

Skylio dynamically shifts its atmospheric color palette and horizon hairline according to the current solar position and weather conditions:

```text
Local Solar Angle & WMO Code
         │
         ▼
[1. Condition Mapping]    ── Resolves Clear, Cloudy, Rain, Snow, or Storm
         │
         ▼
[2. Diurnal Calculation]  ── Interrogates is_day (Day vs. Twilight vs. Night)
         │
         ▼
[3. Chromatic Shift]      ── Injects --horizon-gradient and --sky-bg CSS vars
         │
         ▼
[4. Particle Simulation]  ── Activates Rain, Snow, Cloud Fog, or Meteors Canvas
```

### Hardware-Accelerated Kinetic Physics
- **Fluid Spring Physics** — Built with Framer Motion for natural, responsive interactive transitions across view tabs and search modals.
- **Lenis Smooth Inertial Scrolling** — Momentum-based wheel scrolling providing an ultra-fluid reading experience across telemetry matrices.
- **Reactive Particle Canvas** — 60 FPS HTML5 Canvas engine dynamically spawning precipitation streaks, snow drift, or shooting stars.

### Modern Frontend Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Styling & Design System** | Tailwind CSS v4, CSS Custom Properties (`--horizon-gradient`, `--sky-bg`) |
| **Animation & Kinetics** | Framer Motion, Lenis Smooth Inertial Wheel Scroll |
| **Iconography & Graphics** | Lucide React, Inline Meteorological SVGs |
| **Meteorological APIs** | Open-Meteo Weather Forecast API, Open-Meteo Geocoding API |
| **Typography System** | Space Grotesk (Display), Inter (Body UI), IBM Plex Mono (Telemetry / Metrics) |
| **State & Local Persistence** | React Hooks, Browser `localStorage` |
| **Linting & Code Quality** | Oxlint, TypeScript strict mode |

---

## ⚙️ Configuration

### Unit Switching & Preferences

Skylio automatically persists temperature and measurement preferences in browser `localStorage`:

- **Metric System:** Temperature in Celsius (°C), Wind Velocity in km/h, Precipitation in millimeters (mm)
- **Imperial System:** Temperature in Fahrenheit (°F), Wind Velocity in mph, Precipitation in inches (in)

### LocalStorage Storage Keys

| Key | Description | Default Fallback |
|---|---|---|
| `skylio-current-location` | Currently selected city coordinates and metadata | Kolkata, West Bengal, India |
| `skylio-bookmarks` | JSON array of saved favorite global cities | Preset global capitals |

### Default Meteorological Coordinates

If geolocation access is disabled or unavailable, Skylio gracefully falls back to:
```typescript
const DEFAULT_LOCATION: WeatherLocation = {
  name: 'Kolkata',
  admin1: 'West Bengal',
  country: 'India',
  latitude: 22.5726,
  longitude: 88.3639,
};
```

---

## Privacy & Data Governance Charter

Skylio was built from the ground up to respect user privacy:

- **Zero Tracking Scripts** — No Google Analytics, no Facebook Pixels, and zero user-tracking scripts.
- **No Mandatory Accounts** — Use all features, pin locations, and toggle units without creating an account or providing email addresses.
- **Client-Side Storage Only** — Pinned locations and coordinates remain strictly stored on your own device via `localStorage`.
- **Encrypted Transmission** — All queries to Open-Meteo are transmitted via secure HTTPS (TLS 1.3).

---

## Architecture & Code Structure

```text
skylio/
├── assets/
│   └── screenshot.png          # High-resolution application preview screenshot
├── public/
│   ├── favicon.svg             # Vector weather brand logo & favicon
│   └── icons.svg               # SVG sprite definitions
├── src/
│   ├── assets/                 # Brand assets & graphic vectors
│   ├── components/
│   │   ├── inspira/            # Meteors, AnimatedTabs, kinetic components
│   │   ├── legal/              # LegalModal, PrivacyPolicy, TermsConditions
│   │   ├── DailyList.tsx       # 7-day synoptic forecast matrix
│   │   ├── Footer.tsx          # Multi-column glassmorphic footer & social dock
│   │   ├── HeroWeatherCard.tsx # Primary atmospheric summary & bookmark pin
│   │   ├── HourlyChart.tsx     # 24-hour interactive meteorological trend graph
│   │   ├── SavedLocations.tsx  # Pinned city bookmarks bar
│   │   ├── SearchBar.tsx       # Debounced geocoding search & GPS locator
│   │   ├── TelemetryBentoGrid.tsx # Sensor telemetry bento instrumentation
│   │   ├── Toggles.tsx         # Celsius / Fahrenheit unit switchers
│   │   └── WeatherBackground.tsx # Reactive 2D canvas weather particle engine
│   ├── hooks/
│   │   ├── useGeolocation.ts   # Browser navigator.geolocation hook & reverse geocoding
│   │   └── useWeather.ts       # Open-Meteo API data synchronization hook
│   ├── lib/
│   │   ├── api.ts              # Open-Meteo REST endpoints & payload transformers
│   │   ├── horizon.ts          # Condition-to-gradient & diurnal solar color mapping
│   │   ├── utils.ts            # Class merging utility (clsx + tailwind-merge)
│   │   └── weatherCodes.ts     # WMO weather code mapping to conditions & icons
│   ├── types/
│   │   └── weather.ts          # TypeScript interfaces for meteorological telemetry
│   ├── App.tsx                 # Root application orchestration & view switcher
│   ├── index.css               # Design tokens, typography & CSS variables
│   └── main.tsx                # React 19 root bootstrap & Lenis smooth scroll
├── index.html                  # HTML5 entry with Google Fonts & viewport metadata
├── package.json                # Project dependencies and script declarations
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite 8 build & bundler configuration
```

---

## ☁️ Cloud Deployment

Deploy Skylio to your preferred static hosting platform with zero server dependencies:

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Static Web Servers (Nginx / Caddy / Docker)
Build the production bundle and serve the `dist/` directory:
```bash
npm run build
```

---

## Verification & Quality Bar

```bash
# Typecheck TypeScript codebase and generate production bundle
npm run build

# Run Oxlint linter on source code
npx oxlint src
```

---

## Contributing

We welcome contributions to Skylio! Whether you're optimizing Canvas particle physics, improving accessibility, or refining meteorological telemetry readouts:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/solar-elevation-polar-graph`)
3. Commit your changes (`git commit -m 'Add polar solar elevation chart'`)
4. Push to the branch (`git push origin feature/solar-elevation-polar-graph`)
5. Open a [Pull Request](https://github.com/mizan989/Skylio-Weather_App/pulls)

---

## Support the Project

**Enjoying Skylio?** Give us a ⭐ on [GitHub](https://github.com/mizan989/Skylio-Weather_App) to help spread open-source atmospheric intelligence!

---

## Acknowledgements

Skylio is built with gratitude towards the open-source meteorological and developer ecosystem:

- [Open-Meteo](https://open-meteo.com/) — Free, open-access meteorological weather forecast & geocoding APIs
- [React](https://react.dev/) & [Vite](https://vitejs.dev/) — Lightning-fast frontend tooling and runtime
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first aesthetic styling engine
- [Framer Motion](https://www.framer.com/motion/) — Fluid spring animations and interactive layout transitions
- [Lenis](https://lenis.darkroom.engineering/) — Smooth momentum-based inertial scrolling
- [Lucide Icons](https://lucide.dev/) — Clean, consistent UI iconography
- [Google Fonts](https://fonts.google.com/) — Space Grotesk, Inter, and IBM Plex Mono typography

<div align="center">

> [!NOTE]
> **Meteorological Data Advisory:** Skylio delivers atmospheric telemetry for informational and personal convenience. While backed by world-class numerical weather prediction models (ECMWF, GFS, ICON), it is not certified for aviation flight planning, maritime navigation, or life-safety emergency defense. Always consult official national meteorological agencies (NOAA, Met Office, DWD, IMD) for certified severe weather warnings and directives.

</div>
