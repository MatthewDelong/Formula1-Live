<div align="center">
  <h1>🏎️ F1 Live Timings Dashboard</h1>
  <p>A high-performance, real-time Formula 1 dashboard built with React 19. Provides live timings, dynamic 2D track maps, live car telemetry, race control messages, and strategic insights directly from the official F1 timing data.</p>
</div>

> **⚠️ Important Note regarding Live Data:** The primary OpenF1 proxy authentication is restricted to the Cloudflare Worker deployed for the live site. However, if you clone and run this app locally, it will automatically fall back to the public `api.openf1.org` endpoint so you can still use the dashboard seamlessly!

## ✨ Features

- **⏱️ Live Timing Board**: Real-time leaderboard with driver intervals, gaps, tire age, and best sector times painted in classic F1 purple/green/yellow.
- **🗺️ Dynamic 2D Track Radar (Live Only)**: Mathematically constructs the circuit outline in real-time and renders live, moving car dots on the track based on raw X/Y telemetry coordinates.
- **🏎️ Live Telemetry (Live Only)**: View live RPM, Speed, Gear, Throttle, Brake, and ERS/DRS deployment graphs for any driver on the grid.
- **📻 Team Radio**: Listen to unfiltered, live team radio transmissions in a dedicated popup player (bypassing strict browser CORS blocking).
- **📡 Race Control**: Live track/air temperature updates, wind speeds, and official race control messages (flags, safety cars, lap deletions).
- **📊 Gaps & Intervals**: Visual representation of gaps to the race leader and best lap comparisons using Recharts.
- **🔄 Strategy Insights**: Comprehensive overview of tire strategies, stint lengths, and complete pit stop history.
- **📱 Progressive Web App (PWA)**: Fully installable as a native app on mobile and desktop devices.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Data Visualization**: Recharts
- **Data Source**: [OpenF1 API](https://openf1.org/)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (or yarn/pnpm)

### Installation

1. Navigate into the project directory:
   ```bash
   cd Formula1-Live
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
This will start the Vite dev server, typically available at `http://localhost:5173`.

### Building for Production

To create a production build:
```bash
npm run build
```
You can then preview the built application using:
```bash
npm run preview
```

## License

This project is open-source and available under the MIT License.
