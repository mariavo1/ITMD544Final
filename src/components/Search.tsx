import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { AsyncPaginate } from 'react-select-async-paginate'
import { GEO_API_URL, geoApiOptions } from 'utils/cities'
import { useLocalData } from 'hooks/useLocalData'
import classes from 'styles/sass/Search.module.scss'

const Search = () => {
  const [search, setSearch] = useState(null)
  const { dispatch } = useLocalData()
  const router = useRouter()

  const handleOnChange = async (searchData: any) => {
    dispatch({ type: 'UPDATE_SEARCH_RESULT', payload: searchData })

    const [latitude, longitude] = searchData.value.split(' ')
    const route = `/forecast?location=${encodeURIComponent(
      searchData.label
    )}&latitude=${latitude}&longitude=${longitude}`

    router.push(route)
  }

  const loadOptions = async (inputValue: string) => {
    return fetch(
      `${GEO_API_URL}/cities?types=CITY&minPopulation=500000&&sort=-population&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        return {
          options: json.data.map((city: any) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            }
          }),
        }
      })
  }

  return (
    <AsyncPaginate
      id="long-value-select"
      instanceId="long-value-select"
      className={classes.select}
      placeholder="Search a city..."
      debounceTimeout={1000}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  )
}

export default Search
