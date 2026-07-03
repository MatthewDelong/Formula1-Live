# F1 Live Timings Dashboard

A real-time Formula 1 dashboard providing live timings, telemetry, race control messages, and strategic insights. Powered by the OpenF1 API.

## Features

- **Live Timing**: Real-time leaderboard with intervals, gaps, and best sectors.
- **Weather & Race Control**: Live track/air temperature updates and official race control messages (flags, safety cars, etc.).
- **Gaps & Intervals**: Visual representation of gaps to the leader and best lap comparisons.
- **Interactive Charts**: Track lap time progression and position changes over the course of the session using Recharts.
- **Strategy Insights**: Comprehensive overview of tire strategies, stint lengths, and pit stop history.
- **Smart Session Selection**: Automatically highlights active live sessions or recently completed sessions.

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
