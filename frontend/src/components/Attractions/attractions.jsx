import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

// const places = [
//   {
//     id: 1,
//     name: 'Gal Oya National Park',
//     description:
//       'A beautiful national park in Sri Lanka that is home to various wildlife and bird species.',
//     address: 'Gal Oya National Park, Ampara, Sri Lanka',
//     images: [
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683449392/afPlaces/g2_l4sl38.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683449390/afPlaces/g1_meld5b.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683449554/afPlaces/g3_ibexum.jpg',
//     ],
//     area: 'Ampara',
//   },
//   {
//     id: 2,
//     name: 'Delft Island',
//     description:
//       'A small island located in the Jaffna district with beautiful scenery and wild horses.',
//     address: 'Delft Island, Jaffna, Sri Lanka',
//     images: [
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683449711/afPlaces/d1_fzuohi.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683449711/afPlaces/d3_nvpwuv.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683449711/afPlaces/d2_elkug0.jpg',
//     ],
//     area: 'Jaffna',
//   },
//   {
//     id: 3,
//     name: 'Pigeon Island',
//     description:
//       'A beautiful island with clear blue waters and white sandy beaches located in Trincomalee.',
//     address: 'Nilaveli, Trincomalee, Sri Lanka',
//     images: [
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683450055/afPlaces/p1_z2xtsw.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683450055/afPlaces/p3_l23ed0.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683450055/afPlaces/p3_l23ed0.jpg',
//     ],
//     area: 'Trincomalee',
//   },
//   {
//     id: 4,
//     name: 'Ritigala',
//     description:
//       'A beautiful forest monastery located in the Anuradhapura district with ruins of ancient buildings and a scenic hiking trail.',
//     address: 'Ritigala, Anuradhapura, Sri Lanka',
//     images: [
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683450224/afPlaces/r1_quumb5.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683450224/afPlaces/r2_k4gqte.jpg',
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683450224/afPlaces/r3_ur12av.jpg',
//     ],
//     area: 'Anuradhapura',
//   },
//   {
//     id: 5,
//     name: 'Sigiriya',
//     description:
//       "Sigiriya is famous for it's palace ruins on top of a massive 200 meter high rock surrounded by the remains of an extensive network of gardens, reservoirs and other structures",
//     images: [
//       'https://res.cloudinary.com/ddcutbnra/image/upload/v1683242604/afPlaces/bc9o44xyv2d8dpxjtztw.jpg',
//     ],
//   },
// ]

const PlaceCard = ({ place }) => {
  // const [hovered, setHovered] = React.useState(false);

  return (
    <div class="max-w-sm bg-white border border-gray-200 rounded-lg transform transition-all hover:-translate-y-2 duration-300 shadow-xl hover:shadow-slate-400">
      {/* <a href=`/{place.id}`> */}
      <Link to={`/attractionView/${place._id}`}>
        <img class="w-full h-[270px] rounded-t-lg" src={place.images[0]} alt={place.name} />
      </Link>
      {/* </a> */}
      <div class="p-5">
        <Link to={`/attractionView/${place._id}`}>
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-600">
            {place.name}
          </h5>
        </Link>
        <p class="mb-3 font-normal text-gray-700 ">{place.description}</p>
      </div>
    </div>
  )
}

const PlacesList = () => {
  const [places, setPlaces] = useState([])

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // const response = await axios.get('https://fine-teal-ostrich-tam.cyclic.app/api/TASites/')
        const response = await axios.get('http://localhost:4000/api/TASites/')
        setPlaces(response.data.touristAttractions)
        console.log(places)
      } catch (err) {
        console.error(err)
      }
    }

    fetchPlaces()
  }, [])
  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Tourist Attractions
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  )
}

export default PlacesList
