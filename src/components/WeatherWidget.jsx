import React from 'react';

export default function WeatherWidget({ weather }) {
  if (!weather) {
    return (
      <div className="weather-widget">
        <div className="weather-item">
          <div className="weather-icon">🌡️</div>
          <div className="weather-value">—</div>
          <div className="weather-label">Air Temp</div>
        </div>
        <div className="weather-item">
          <div className="weather-icon">🛤️</div>
          <div className="weather-value">—</div>
          <div className="weather-label">Track Temp</div>
        </div>
        <div className="weather-item">
          <div className="weather-icon">💧</div>
          <div className="weather-value">—</div>
          <div className="weather-label">Humidity</div>
        </div>
        <div className="weather-item">
          <div className="weather-icon">💨</div>
          <div className="weather-value">—</div>
          <div className="weather-label">Wind</div>
        </div>
        <div className="weather-item">
          <div className="weather-icon">🌧️</div>
          <div className="weather-value">—</div>
          <div className="weather-label">Rainfall</div>
        </div>
        <div className="weather-item">
          <div className="weather-icon">🧭</div>
          <div className="weather-value">—</div>
          <div className="weather-label">Pressure</div>
        </div>
      </div>
    );
  }

  const isRaining = weather.rainfall > 0;
  const weatherIcon = isRaining ? '🌧️' : '☀️';

  return (
    <div className="weather-widget">
      <div className="weather-item">
        <div className="weather-icon">🌡️</div>
        <div className="weather-value">{weather.air_temperature != null ? `${weather.air_temperature}°C` : '—'}</div>
        <div className="weather-label">Air Temp</div>
      </div>
      <div className="weather-item">
        <div className="weather-icon">🛤️</div>
        <div className="weather-value">{weather.track_temperature != null ? `${weather.track_temperature}°C` : '—'}</div>
        <div className="weather-label">Track Temp</div>
      </div>
      <div className="weather-item">
        <div className="weather-icon">💧</div>
        <div className="weather-value">{weather.humidity != null ? `${weather.humidity}%` : '—'}</div>
        <div className="weather-label">Humidity</div>
      </div>
      <div className="weather-item">
        <div className="weather-icon">💨</div>
        <div className="weather-value">
          {weather.wind_speed != null ? `${weather.wind_speed} m/s` : '—'}
        </div>
        <div className="weather-label">Wind {weather.wind_direction != null ? `${weather.wind_direction}°` : ''}</div>
      </div>
      <div className="weather-item">
        <div className="weather-icon">{weatherIcon}</div>
        <div className="weather-value" style={{ color: isRaining ? 'var(--status-blue)' : 'var(--status-green)' }}>
          {isRaining ? 'Yes' : 'No'}
        </div>
        <div className="weather-label">Rainfall</div>
      </div>
      <div className="weather-item">
        <div className="weather-icon">🧭</div>
        <div className="weather-value">{weather.pressure != null ? `${weather.pressure}` : '—'}</div>
        <div className="weather-label">Pressure (mbar)</div>
      </div>
    </div>
  );
}
