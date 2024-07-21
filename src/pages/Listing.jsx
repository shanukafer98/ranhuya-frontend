import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import Modal from "react-modal";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${url}/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if (listing) {
      console.log(listing);
    }
  }, [listing]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
            {listing.videoUrl && (
              <SwiperSlide key={listing.videoUrl}>
                <div className="h-[550px] flex justify-center items-center">
                  <video
                    controls
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      backgroundSize: "cover",
                    }}
                  >
                    <source src={listing.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-4xl font-extrabold font-serif">{listing.title}</p>
            <div className="my-3 text-2xl font-semibold">
              {listing.regularPrice.toLocaleString("lkr-LK", {
                style: "currency",
                currency: "LKR",
              })}{" "}
            </div>
            <p className="flex items-center mt-4 gap-2 text-slate-600 text-lg font-bold">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.district}
            </p>
            <p className="text-slate-800 my-4">
              <span className="font-semibold text-2xl text-black">
                Description
              </span>
              <p className="whitespace-pre-wrap">{listing.description}</p>
            </p>
            <button 
              onClick={() => setModalIsOpen(true)}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-1/2"
            >
              Contact Details
            </button>
          </div>
        </div>
      )}

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        contentLabel="Contact Information"
        className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 overflow-y-auto p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white p-5 rounded-md max-w-md w-full ">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <p><strong>Contact Number 1:</strong> <a href={`tel:${listing?.contactNumber1}`} className="text-blue-500 underline">{listing?.contactNumber1}</a></p>
          <p><strong>Contact Number 2:</strong> <a href={`tel:${listing?.contactNumber2}`} className="text-blue-500 underline">{listing?.contactNumber2}</a></p>
          <p><strong>Address:</strong> <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing?.address)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{listing?.address}</a></p>
          <button 
            onClick={() => setModalIsOpen(false)}
            className="bg-red-500 text-white p-2 rounded-md mt-4"
          >
            Close
          </button>
        </div>
      </Modal>
    </main>
  );
}
