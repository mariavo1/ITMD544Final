import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// set up dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

type ChartData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    hidden?: boolean
  }[]
}

