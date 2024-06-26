import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Unit } from '@openmeteo/sdk/unit'
import { Table } from 'react-bootstrap'
import { getShortDisplayDay, degToCompass } from 'utils/weather'
import { useLocalData } from 'hooks/useLocalData'
import displayUnits from 'assets/displayUnits.json'
import classes from 'styles/sass/DailyForecastTable.module.scss'

// set up dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

interface DailyForecastTableRow {
  dayShort: string
  date: string
  tempHigh: string
  tempLow: string
  precipitation: string
  windSpeed: string
  windDirection: string
  weatherCode: number
}

const getDailyForecastTableRows = (
  dailyData: any,
  timezone: string,
  temperatureUnit: string
) => {
  const displayPrecipitationUnit =
    displayUnits[
      Unit[dailyData.precipitationSumUnit] as keyof typeof displayUnits
    ]
  const displayWindSpeedUnit =
    displayUnits[
      Unit[dailyData.windSpeed10mMaxUnit] as keyof typeof displayUnits
    ]
  const result: DailyForecastTableRow[] = []

  for (let i = 0; i < dailyData.time.length; i++) {
    result.push({
      dayShort: getShortDisplayDay(dailyData.time[i], timezone),
      date: dayjs.tz(dailyData.time[i], timezone).format('MM/DD/YYYY'),
      tempHigh: `${Math.round(
        dailyData.temperature2mMax[i]
      )}\u00B0${temperatureUnit.toUpperCase()}`,
      tempLow: `${Math.round(
        dailyData.temperature2mMin[i]
      )}\u00B0${temperatureUnit.toUpperCase()}`,
      precipitation: `${Math.trunc(
        dailyData.precipitationSum[i]
      )} ${displayPrecipitationUnit}`,
      windSpeed: `${Math.round(
        dailyData.windSpeed10mMax[i]
      )} ${displayWindSpeedUnit}`,
      windDirection: degToCompass(dailyData.windDirection10mDominant[i]),
      weatherCode: dailyData.weatherCode[i],
    })
  }
  return result
}

interface DailyForecastTableProps {
  data: {
    celsius: string
    fahrenheit: string
  }
}

const DailyForecastTable = ({ data }: DailyForecastTableProps) => {
  const {
    state: { temperatureUnit },
  } = useLocalData()

  const json =
    temperatureUnit === 'c'
      ? JSON.parse(data.celsius)
      : JSON.parse(data.fahrenheit)

  const rowData = getDailyForecastTableRows(
    json.daily,
    json.timezone,
    temperatureUnit
  )

  return (
    <Table striped bordered variant="light">
      <thead>
        <tr>
          <th></th>
          <th title="Date">Date</th>
          <th title="High Temperature">High</th>
          <th title="Low Temperature">Low</th>
          <th title="Daily Precipitation">Precipitation</th>
          <th title="Max Wind Speed">Wind Speed</th>
          <th title="Wind Direction">Wind Direction</th>
        </tr>
      </thead>
      <tbody>
        {rowData.map((row) => (
          <tr key={`daily-row-data-${row.date}`}>
            <td>{row.dayShort}</td>
            <td>{row.date}</td>
            <td>{row.tempHigh}</td>
            <td>{row.tempLow}</td>
            <td>{row.precipitation}</td>
            <td>{row.windSpeed}</td>
            <td>{row.windDirection}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default DailyForecastTable
