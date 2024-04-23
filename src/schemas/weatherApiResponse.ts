import { z } from 'zod'
import { WeatherApiCurrentDataSchema } from 'schemas/weatherApiCurrentData'
import { WeatherApiDailyDataSchema } from 'schemas/weatherApiDailyData'

export const WeatherApiResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  timezoneAbbreviation: z.string(),
  current: WeatherApiCurrentDataSchema,
  daily: WeatherApiDailyDataSchema,
})

export type WeatherApiResponse = z.infer<typeof WeatherApiResponseSchema>
