import React, { useState, useEffect } from 'react'
import axios from 'axios'

const HostDashboardReservationHistory = () => {
  const [reservationDetails, setReservationDetails] = useState([])

  useEffect(() => {
    function fetchData() {
      axios
        .get('http://localhost:4000/api/accommodationReserve')
        .then((res) => {
          if (Array.isArray(res.data.reservation)) {
            setReservationDetails(res.data.reservation)
          } else {
            console.error('Received data is not an array:', res.data)
          }
          console.log('your data has been received')
          console.log(res.data.reservation)

          setReservationDetails(res.data.reservation) //using set function to retrieve data and display on website
        })
        .catch((err) => {
          alert(err.message)
        })
    }
    fetchData()
  }, [reservationDetails])

  if (!reservationDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 uppercase">
            Dashboard
          </h1>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-5">
        <button className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-blue-600">
          <a class="nav-link" href="/hostDashboardProfile">
            Profile
          </a>
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-green-600">
          <a class="nav-link" href="/hostDashboardReservationAll">
            All Reservations
          </a>
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-red-600">
          <a class="nav-link" href="/hostDashboardReservationHistory">
            Reservation History
          </a>
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-red-600">
          <a class="nav-link" href="/hostDashboardPlaceUpdate">
            Accommodation Edit
          </a>
        </button>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"></div>

      <div className="flex flex-col px-8 py-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reserver Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Requested Date Range
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reserver Phone No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Languages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No Of Passengers
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reserver Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    {/* <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservationDetails.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.rp_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(reservation.reserve_from)
                            .toISOString()
                            .substring(0, 10)}{' '}
                          -{' '}
                          {new Date(reservation.reserve_to)
                            .toISOString()
                            .substring(0, 10)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {reservation.rp_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {reservation.rp_languages}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {reservation.rp_country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {reservation.rp_noofPassengers}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {reservation.rp_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${
                            reservation.status === 'Accepted'
                              ? 'bg-green-500'
                              : 'bg-orange-500 '
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HostDashboardReservationHistory
