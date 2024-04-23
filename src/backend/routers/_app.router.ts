import { router, publicProcedure } from 'backend/trpc'
import { z } from 'zod'
import { Unit } from '@openmeteo/sdk/unit'
import { authRouter } from './auth.router'
import { userRouter } from './user.router'
import postgresService from 'db/postgres'
import { WeatherApiResponseSchema } from 'schemas/weatherApiResponse'
import { getWeatherData } from 'utils/meteo'
import { cToF, fToC } from 'utils/weather'

type SerializedApiResponse = {
  celsius: string
  fahrenheit: string
}

const celsiusUnit = Unit['celsius']
const fahrenheitUnit = Unit['fahrenheit']

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  getDefaultLocation: publicProcedure.query(async () => {
    return await postgresService.getDefaultLocation()
  }),
  getWeather: publicProcedure
    .input(
      z.object({
        latitude: z.string(),
        longitude: z.string(),
      })
    )
    .query(async ({ input }) => {
      const data = await getWeatherData(input.latitude, input.longitude)

      const parsed = WeatherApiResponseSchema.parse(data)
      const queryTemperatureUnit = Unit[parsed.current.temperature2mUnit]

      const response = {} as SerializedApiResponse

      // convert all temperature values according to temperature unit parameter in API response
      if (queryTemperatureUnit === 'celsius') {
        const fahrenheitData = {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          timezone: parsed.timezone,
          timezoneAbbreviation: parsed.timezoneAbbreviation,
          current: {
            ...parsed.current,
            temperature2m: cToF(parsed.current.temperature2m),
            temperature2mUnit: fahrenheitUnit,
          },
          daily: {
            ...parsed.daily,
            temperature2mMax: parsed.daily.temperature2mMax.map((celsius) =>
              cToF(celsius)
            ),
            temperature2mMaxUnit: fahrenheitUnit,
            temperature2mMin: parsed.daily.temperature2mMin.map((celsius) =>
              cToF(celsius)
            ),
            temperature2mMinUnit: fahrenheitUnit,
          },
        }
        response.celsius = JSON.stringify(parsed)
        response.fahrenheit = JSON.stringify(fahrenheitData)
      } else if (queryTemperatureUnit === 'fahrenheit') {
        const celsiusData = {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          current: {
            ...parsed.current,
            temperature2m: fToC(parsed.current.temperature2m),
            temperature2mUnit: celsiusUnit,
          },
          daily: {
            ...parsed.daily,
            temperature2mMax: parsed.daily.temperature2mMax.map((fahrenheit) =>
              fToC(fahrenheit)
            ),
            temperature2mMaxUnit: celsiusUnit,
            temperature2mMin: parsed.daily.temperature2mMin.map((fahrenheit) =>
              fToC(fahrenheit)
            ),
            temperature2mMinUnit: celsiusUnit,
          },
        }
        response.fahrenheit = JSON.stringify(parsed)
        response.celsius = JSON.stringify(celsiusData)
      }

      return response
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
