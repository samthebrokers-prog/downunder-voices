import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Weather | Downunder Voices',
  description:
    'Current weather and seven-day forecasts for major cities across Australia and New Zealand.',
}

export const revalidate = 1800

type City = {
  name: string
  country: 'Australia' | 'New Zealand'
  latitude: number
  longitude: number
  timezone: string
}

type WeatherData = {
  current?: {
    temperature_2m?: number
    apparent_temperature?: number
    weather_code?: number
    wind_speed_10m?: number
  }
  daily?: {
    time?: string[]
    weather_code?: number[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    precipitation_probability_max?: number[]
  }
}

const cities: City[] = [
  { name: 'Perth', country: 'Australia', latitude: -31.9523, longitude: 115.8613, timezone: 'Australia/Perth' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne' },
  { name: 'Brisbane', country: 'Australia', latitude: -27.4698, longitude: 153.0251, timezone: 'Australia/Brisbane' },
  { name: 'Adelaide', country: 'Australia', latitude: -34.9285, longitude: 138.6007, timezone: 'Australia/Adelaide' },
  { name: 'Canberra', country: 'Australia', latitude: -35.2809, longitude: 149.1300, timezone: 'Australia/Sydney' },
  { name: 'Hobart', country: 'Australia', latitude: -42.8821, longitude: 147.3272, timezone: 'Australia/Hobart' },
  { name: 'Darwin', country: 'Australia', latitude: -12.4634, longitude: 130.8456, timezone: 'Australia/Darwin' },
  { name: 'Auckland', country: 'New Zealand', latitude: -36.8509, longitude: 174.7645, timezone: 'Pacific/Auckland' },
  { name: 'Wellington', country: 'New Zealand', latitude: -41.2866, longitude: 174.7756, timezone: 'Pacific/Auckland' },
  { name: 'Christchurch', country: 'New Zealand', latitude: -43.5321, longitude: 172.6362, timezone: 'Pacific/Auckland' },
  { name: 'Queenstown', country: 'New Zealand', latitude: -45.0312, longitude: 168.6626, timezone: 'Pacific/Auckland' },
]

function weatherLabel(code?: number) {
  if (code === 0) return 'Clear'
  if (code === 1) return 'Mostly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Cloudy'
  if (code === 45 || code === 48) return 'Fog'
  if (code && code >= 51 && code <= 57) return 'Drizzle'
  if (code && code >= 61 && code <= 67) return 'Rain'
  if (code && code >= 71 && code <= 77) return 'Snow'
  if (code && code >= 80 && code <= 82) return 'Showers'
  if (code && code >= 95) return 'Thunderstorms'
  return 'Weather update'
}

function weatherIcon(code?: number) {
  if (code === 0) return '☀️'
  if (code === 1 || code === 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code && code >= 51 && code <= 67) return '🌧️'
  if (code && code >= 71 && code <= 77) return '🌨️'
  if (code && code >= 80 && code <= 82) return '🌦️'
  if (code && code >= 95) return '⛈️'
  return '🌡️'
}

async function getWeather(city: City) {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: city.timezone,
    forecast_days: '7',
  })

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      { next: { revalidate: 1800 } },
    )

    if (!response.ok) return null
    return (await response.json()) as WeatherData
  } catch {
    return null
  }
}

function dayLabel(date?: string, index?: number) {
  if (!date) return ''
  if (index === 0) return 'Today'
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-AU', {
    weekday: 'short',
  })
}

export default async function WeatherPage() {
  const results = await Promise.all(
    cities.map(async (city) => ({ city, data: await getWeather(city) })),
  )

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b-4 border-red-700 pb-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
          Downunder Weather
        </p>
        <h1 className="mt-2 font-serif text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Australia &amp; New Zealand Weather
        </h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">
          Current conditions and seven-day outlooks for major cities. Forecast data refreshes regularly throughout the day.
        </p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map(({ city, data }) => {
          const current = data?.current
          const daily = data?.daily

          return (
            <article key={city.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-4 bg-slate-950 p-5 text-white">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{city.country}</p>
                  <h2 className="mt-1 font-serif text-2xl font-black">{city.name}</h2>
                  <p className="mt-1 text-sm text-slate-300">{weatherLabel(current?.weather_code)}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl" aria-hidden="true">{weatherIcon(current?.weather_code)}</div>
                  <div className="mt-1 text-3xl font-black">
                    {current?.temperature_2m !== undefined ? `${Math.round(current.temperature_2m)}°` : '—'}
                  </div>
                </div>
              </div>

              {data ? (
                <div className="p-5">
                  <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs font-bold uppercase text-slate-500">Feels like</div>
                      <div className="mt-1 text-lg font-black text-slate-900">
                        {current?.apparent_temperature !== undefined ? `${Math.round(current.apparent_temperature)}°C` : '—'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs font-bold uppercase text-slate-500">Wind</div>
                      <div className="mt-1 text-lg font-black text-slate-900">
                        {current?.wind_speed_10m !== undefined ? `${Math.round(current.wind_speed_10m)} km/h` : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {(daily?.time ?? []).slice(0, 7).map((date, index) => (
                      <div key={date} className="text-center text-xs">
                        <div className="font-bold text-slate-600">{dayLabel(date, index)}</div>
                        <div className="my-2 text-xl" aria-hidden="true">{weatherIcon(daily?.weather_code?.[index])}</div>
                        <div className="font-black text-slate-900">{Math.round(daily?.temperature_2m_max?.[index] ?? 0)}°</div>
                        <div className="text-slate-500">{Math.round(daily?.temperature_2m_min?.[index] ?? 0)}°</div>
                        <div className="mt-1 text-[10px] font-semibold text-sky-700">
                          {daily?.precipitation_probability_max?.[index] ?? 0}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="p-5 text-sm text-slate-600">Forecast temporarily unavailable.</p>
              )}
            </article>
          )
        })}
      </section>

      <section className="mt-10 rounded-xl border border-amber-300 bg-amber-50 p-6">
        <h2 className="font-serif text-2xl font-black text-slate-950">Severe weather &amp; official warnings</h2>
        <p className="mt-2 text-sm text-slate-700">
          For emergency warnings and official forecasts, always check the national weather authority for your location.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="https://www.bom.gov.au/" target="_blank" rel="noreferrer" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
            Bureau of Meteorology — Australia
          </a>
          <a href="https://www.metservice.com/" target="_blank" rel="noreferrer" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
            MetService — New Zealand
          </a>
        </div>
      </section>

      <p className="mt-6 text-xs text-slate-500">
        Forecast data: Open-Meteo. Weather information is provided as a general guide and should not replace official emergency warnings.
      </p>
    </main>
  )
}
