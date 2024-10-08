import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";
const url = import.meta.env.VITE_BACKEND_URL;

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    categorie: "",
    district: "",
    sort: "createdAt",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const categorieFromUrl = urlParams.get("categorie") || "";
    const districtFromUrl = urlParams.get("district") || "";
    const sortFromUrl = urlParams.get("sort") || "createdAt";

    setSidebardata({
      searchTerm: searchTermFromUrl,
      categorie: categorieFromUrl,
      district: districtFromUrl,
      sort: sortFromUrl,
    });

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`${url}/listing/get?${searchQuery}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setShowMore(data.length > 8);
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebardata((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("categorie", sidebardata.categorie);
    urlParams.set("district", sidebardata.district);
    urlParams.set(
      "sort",
      sidebardata.sort === "createdAt_desc" ? "createdAt" : "-createdAt"
    );

    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    try {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${url}/api/listing/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setShowMore(data.length >= 9);
      setListings((prevListings) => [...prevListings, ...data]);
    } catch (error) {
      console.error("Error fetching more listings:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen md:w-1/4 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold md:w-1/3 w-full">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full shadow-2xl"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="font-semibold md:w-1/3 w-full">Category:</label>
            <select
              id="categorie"
              value={sidebardata.categorie}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full shadow-2xl"
            >
              <option value="">All Services</option>
              <option value="dj">DJ</option>
              <option value="hotel">Hotel</option>
              <option value="photography">Photography</option>
              <option value="venue">Photo Locations</option>
              <option value="decoration">Flower Decorations</option>
              <option value="poruwa">Poruwa/Seti Back</option>
              <option value="weddingCakes">Wedding Cakes</option>
              <option value="vehicleRental">Wedding Cars</option>
              <option value="ashtaka">Ashtaka</option>
              <option value="dancing">Dancing</option>
              <option value="bera">Bera</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold md:w-1/3 w-full">District:</label>
            <select
              id="district"
              value={sidebardata.district}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full shadow-2xl"
            >
              <option value="">All District</option>
              <option value="Ampara">Ampara</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Badulla">Badulla</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Colombo">Colombo</option>
              <option value="Galle">Galle</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Kegalle">Kegalle</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Mannar">Mannar</option>
              <option value="Matale">Matale</option>
              <option value="Matara">Matara</option>
              <option value="Monaragala">Monaragala</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              <option value="Puttalam">Puttalam</option>
              <option value="Ratnapura">Ratnapura</option>
              <option value="Trincomalee">Trincomalee</option>
              <option value="Vavuniya">Vavuniya</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold md:w-1/3 w-full">Sort:</label>
            <select
              onChange={handleChange}
              value={sidebardata.sort}
              id="sort"
              className="border rounded-lg p-3 w-full shadow-2xl"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-900 p-3 rounded-lg"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1 p-7">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingItem
                key={listing._id}
                listing={listing}
                className="shadow-2xl"
              />
            ))}
            {showMore && (
              <button
                onClick={onShowMoreClick}
                className="bg-blue-500 hover:bg-blue-900 text-white p-3 rounded-lg col-span-full"
              >
                Show More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
