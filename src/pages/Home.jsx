import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import {ring} from '../assets';




export default function Home() {

 
  const [djListings, setDjListings] = useState([]);
  const [hotelListings, setHotelListings] = useState([]);
  const [photographyListings, setPhotographyListings] = useState([]);
  const [venueListings, setVenueListings] = useState([]);
  const[decorationListings, setDecorationListings] = useState([]);
  const [poruwaListings, setPoruwaListings] = useState([]);
  const [weddingCakeListings, setWeddingCakeListings] = useState([]);
  const [vehicleRentalListings, setVehicleRentalListings] = useState([]);
  const [ashatakaListings, setAshatakaListings] = useState([]);
  const [dancingListings, setDancingListings] = useState([]);
  const [beraListings, setBeraListings] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;



  

  SwiperCore.use([Navigation]);


  useEffect(() => {
    const fetchDjListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=dj&limit=4`);
        const data = await res.json();
        setDjListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchHotelListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=hotel&limit=4`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setHotelListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPhotographyListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=photography&limit=4`);
        const data = await res.json();
        setPhotographyListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDecorationListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=decoration&limit=4`);
        const data = await res.json();
        setDecorationListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAshatakaListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=ashataka&limit=4`);
        const data = await res.json();
        setAshatakaListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVehicleRentalListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=vehicleRental&limit=4`);
        const data = await res.json();
        setVehicleRentalListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchWeddingCakeListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=weddingCake&limit=4`);
        const data = await res.json();
        setWeddingCakeListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVenueListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=venue&limit=4`);
        const data = await res.json();
        setVenueListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPoruwaListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=poruwa&limit=4`);
        const data = await res.json();
        setPoruwaListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDancingListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=dancing&limit=4`);
        const data = await res.json();
        setDancingListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBeraListings = async () => {
      try {
        const res = await fetch(`${url}/api/listing/get?categorie=bera&limit=4`);
        const data = await res.json();
        setBeraListings(data);
      } catch (error) {
        console.log(error);
      }
    };


    fetchVenueListings();
    fetchWeddingCakeListings();
    fetchVehicleRentalListings();
    fetchAshatakaListings();
    fetchDecorationListings();
    fetchPhotographyListings();
    fetchHotelListings();
    fetchDjListings();
    fetchBeraListings();
    fetchDancingListings();
    fetchPoruwaListings();

  }, []);

  return (
    <div>
      {/* Top Section */}
      <div
  // className='relative overflow-hidden max-w-7xl mx-auto shadow-2xl'
  // style={{
  //   backgroundImage: `url(${ring})`,
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  //   height: '700px',
    
  
    
  // }}
>
<div className='relative flex flex-col lg:flex-row gap-6 p-28 px-3 max-w-7xl mx-auto z-10 '>
    <div className='flex flex-col gap-10 lg:w-2/3  pt-12'>
      <h1 className='text-slate-700 font-bold sm:text-2xl lg:text-5xl'>
        Find the Perfect <span className='text-slate-500'>Wedding Services</span>
        <br />
        All in One place
      </h1>
      <div className='text-gray-600 text-lg sm:text-1xl'>
        Mangalam is the best place to find all the wedding services you need for your special day.
      </div>
      <Link
        to={'/search'}
        className='text-xs sm:text-sm btn bg-blue-700 hover:bg-slate-900 text-white px-4 py-2 rounded-lg hover:opacity-95 w-fit'
      >
        Let's get started...
      </Link>
    </div>
    <div className='flex justify-center lg:w-1/3'>
      <img src={ring} alt='ring' className='w-[1000px] h-[400px]' />
    </div>
  </div>
</div>




      {/* Listing results for featured, catering, and DJ */}
      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10'>
        
        {djListings && djListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>DJ Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=dj'}>Show more dj services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {djListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
       
        {hotelListings && hotelListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Hotel Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=hotel'}>Show more hotel services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {hotelListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {photographyListings && photographyListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Photography Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=photography'}>Show more photography services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {photographyListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {decorationListings && decorationListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Decoration Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=decoration'}>Show more decoration services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {decorationListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {ashatakaListings && ashatakaListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Ashataka Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=ashataka'}>Show more ashataka services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {ashatakaListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {vehicleRentalListings && vehicleRentalListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Vehicle Rental Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=vehicleRental'}>Show more vehicle rental services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {vehicleRentalListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {weddingCakeListings && weddingCakeListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Wedding Cake Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=weddingCake'}>Show more wedding cake services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {weddingCakeListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {venueListings && venueListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Venue Listing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=venue'}>Show more venue services</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {venueListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
          {poruwaListings && poruwaListings.length > 0 && (
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Poruwa Listing</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=poruwa'}>Show more poruwa services</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {poruwaListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
            {dancingListings && dancingListings.length > 0 && (
              <div>
                <div className='my-3'>
                  <h2 className='text-2xl font-semibold text-slate-600'>Dancing Listing</h2>
                  <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=dancing'}>Show more dancing services</Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {dancingListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}
                </div>
              </div>
            )}
              {beraListings && beraListings.length > 0 && (
                <div>
                  <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Bera Listing</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?categorie=bera'}>Show more bera services</Link>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {beraListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )
          }
        

      
      </div>
    </div>
  );
}
