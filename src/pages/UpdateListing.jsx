import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
const url = import.meta.env.VITE_BACKEND_URL;

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [video, setVideo] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    videoUrl: "",
    title: "",
    description: "",
    address: "",
    regularPrice: 50,
    categorie: "",
    district: "",
    contactNumber1: "",
    contactNumber2: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`${url}/api/listing/get/${listingId}`);
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploading(true);

      const promises = files.map(file => storeMedia(file));
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploading(false);
        })
        .catch((err) => {
          setImageUploading(false);
          toast.error("Image upload failed (2 mb max per image)");
        });
    } else {
      setImageUploading(false);
      toast("Please select an image to upload!", {
        icon: "💡",
      });
    }
  };

  const handleVideoSubmit = (e) => {
    if (video) {
      if (video.size > 100 * 1024 * 1024) {
        toast.error("Video size should be under 100 MB");
        return;
      }
      setVideoUploading(true);

      storeMedia(video)
        .then((url) => {
          setFormData({
            ...formData,
            videoUrl: url,
          });
          setVideoUploading(false);
        })
        .catch((err) => {
          setVideoUploading(false);
          toast.error("Video upload failed (100 mb max per video)");
        });
    } else {
      toast("Please select a video to upload!", {
        icon: "💡",
      });
    }
  };

  const storeMedia = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      toast.promise(
        new Promise((resolvePromise, rejectPromise) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              rejectPromise(error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolvePromise(downloadURL);
                resolve(downloadURL);
              });
            }
          );
        }),
        {
          loading: "Uploading...",
          success: "Upload successful!",
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleRemoveVideo = () => {
    setFormData({
      ...formData,
      videoUrl: "",
    });
    setVideo(null);
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;

    if (type === "number" || type === "text" || type === "textarea") {
      setFormData({
        ...formData,
        [id]: value,
      });
    }

    if (id === "categorie") {
      setFormData({
        ...formData,
        categorie: value,
      });
    }

    if (id === "district") {
      setFormData({
        ...formData,
        district: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        toast.error("You must upload at least one image");
        return setError("You must upload at least one image");
      }
      if (!formData.contactNumber1 && !formData.contactNumber2) {
        toast.error("You must provide at least one contact number");
        return setError("You must provide at least one contact number");
      }
      setLoading(true);
      setError(false);
      const res = await fetch(`${url}/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message);
        toast.error(data.message);
      } else {
        toast.success("Listing updated successfully");
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error("Update failed");
    }
  };





  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-10 shadow-2xl p-10">
        <div className="flex flex-col gap-4 flex-1 ">
          <input
            type="text"
            placeholder="Title"
            className="border p-3 rounded-lg"
            id="title"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.title}
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="categorie" className="font-semibold">
              Categorie:
            </label>
            <select
              id="categorie"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.categorie}
            >
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
          <div className="flex flex-col gap-4">
            <label htmlFor="district" className="font-semibold">
              District:
            </label>
            <select
              id="district"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.district}
            >
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
          <div className="flex flex-col gap-4">
            <label htmlFor="contactNumber1" className="font-semibold">
              Contact Number 1:
            </label>
            <input
              type="String"
              placeholder="Contact Number 1"
              className="border p-3 rounded-lg"
              id="contactNumber1"
              onChange={handleChange}
              value={formData.contactNumber1}
            />
            <label htmlFor="contactNumber2" className="font-semibold">
              Contact Number 2:
            </label>
            <input
              type="String"
              placeholder="Contact Number 2"
              className="border p-3 rounded-lg"
              id="contactNumber2"
              onChange={handleChange}
              value={formData.contactNumber2}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-gray-50 border border-gray-200 p-3 rounded">
            <h2 className="text-2xl font-semibold mb-4">Images</h2>
            <div className="flex flex-wrap gap-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt={`image-${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="mt-3"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={imageUploading}
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
            >
              {imageUploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-3 rounded">
            <h2 className="text-2xl font-semibold mb-4">Video</h2>
            {formData.videoUrl ? (
              <div className="relative">
                <video controls className="w-full rounded">
                  <source src={formData.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={handleRemoveVideo}
                >
                  &times;
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                  className="mt-3"
                />
                <button
                  type="button"
                  onClick={handleVideoSubmit}
                  disabled={videoUploading}
                  className="bg-blue-500 hover:bg-blue-800 text-white px-3 py-1 rounded mt-2"
                >
                  {videoUploading ? "Uploading..." : "Upload Video"}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mt-4">{error}</div>
      )}
      <div className="flex justify-center">
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-500 hover:bg-green-800  text-white px-6 py-3 rounded mt-4"
      >
        {loading ? "Updating..." : "Update Listing"}
      </button>
      </div>
      
    </main>
  );
}
