'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type WeatherItem = {
  label: string
  latitude: number
  longitude: number
  temperature?: number
}

const locations: WeatherItem[] = [
  { label: 'Perth', latitude: -31.9523, longitude: 115.8613 },
  { label: 'Auckland', latitude: -36.8509, longitude: 174.7645 },
]

export function HeaderWeather() {
  const [weather, setWeather] = useState(locations)

  useEffect(() => {
    let cancelled = false

    async function loadWeather() {
      const results = await Promise.all(
        locations.map(async (location) => {
          try {
            const params = new URLSearchParams({
              latitude: String(location.latitude),
              longitude: String(location.longitude),
              current: 'temperature_2m',
              temperature_unit: 'celsius',
            })
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
            )
            if (!response.ok) return location
            const data = await response.json()
            const temperature = Number(data?.current?.temperature_2m)
            return Number.isFinite(temperature)
              ? { ...location, temperature: Math.round(temperature) }
              : location
          } catch {
            return location
          }
        }),
      )

      if (!cancelled) setWeather(results)
    }

    loadWeather()
    const timer = window.setInterval(loadWeather, 30 * 60 * 1000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  const visible = weather.filter(
    (location) => typeof location.temperature === 'number',
  )

  if (!visible.length) return null

  return (
    <Link
      href="/weather"
      className="hidden items-center gap-2 whitespace-nowrap font-semibold text-slate-200 transition hover:text-white md:flex"
      title="Downunder Weather"
    >
      {visible.map((location, index) => (
        <span key={location.label} className="flex items-center gap-2">
          {index > 0 && <span className="text-slate-600">•</span>}
          <span>{location.label} {location.temperature}°C</span>
        </span>
      ))}
    </Link>
  )
}
