import React, { useState, useContext, useEffect } from 'react'
import { useCallback } from 'react'

const search = 'http://localhost:4000/api/restaurants?name='
const area = '&area='
// const search = 'https://cultural-stay.onrender.com/api/restaurants?name='
// const search = 'https://fine-teal-ostrich-tam.cyclic.app/api/restaurants?name='

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchPro, setSearchPro] = useState('')
  const [restaurant, setRestaurant] = useState([])

  const fetchRestaurants = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${search}${searchTerm}${area}${searchPro}`)
      const data = await response.json()
      // const data = response
      const { restaurant } = data
      if (restaurant) {
        const newRestaurant = restaurant.map((item) => {
          const {
            _id,
            image,
            name,
            description,
            city,
            address,
            phone,
            website,
            area,
            food,
            rating,
            rate_count,
          } = item
          return {
            id: _id,
            image,
            name,
            description,
            city,
            address,
            phone,
            website,
            area,
            food,
            rating,
            rate_count,
          }
        })
        setRestaurant(newRestaurant)
      } else {
        setRestaurant([])
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }, [searchTerm, searchPro])
  useEffect(() => {
    fetchRestaurants()
  }, [searchTerm, searchPro, fetchRestaurants])

  return (
    <AppContext.Provider
      value={{
        loading,
        restaurant,
        setSearchTerm,
        setSearchPro,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
