import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import JoditEditor from 'jodit-react';


export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
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

  console.log(formData)
}, [formData]);

  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploading(true);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeMedia(files[i]));
      }
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


  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
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
      if (formData.imageUrls.length < 1) return setError("You must upload at least one image");
      if (!formData.contactNumber1 && !formData.contactNumber2) return setError("You must provide at least one contact number");
      setLoading(true);
      setError(false);
      
      console.log("Submitting form data:", formData);


 

      const res = await fetch(`${url}/listing/create`, {
        method: "POST",
        credentials:"include",
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
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-10 shadow-2xl p-10">
        <div className="flex flex-col gap-4 flex-1">
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
         
         <JoditEditor
            value={formData.description}
            onChange={handleDescriptionChange}
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
                type="text"
                id="regularPrice"
               
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
              type="text"
              placeholder="Contact Number 1"
              className="border p-3 rounded-lg"
              id="contactNumber1"
              required
              onChange={handleChange}
              value={formData.contactNumber1}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="contactNumber2" className="font-semibold">
              Contact Number 2:
            </label>
            <input
              type="text"
              placeholder="Contact Number 2"
              className="border p-3 rounded-lg"
              id="contactNumber2"
              onChange={handleChange}
              value={formData.contactNumber2}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <label htmlFor="files" className="font-semibold">
              Images (6 max):
            </label>
            <input
              type="file"
              accept=".jpg,.png,.jpeg"
              id="files"
              multiple
              className="p-3 border border-gray-300 rounded-lg"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              className="p-3 bg-blue-500 hover:bg-blue-800 text-white rounded-lg uppercase hover:opacity-95 mt-4"
              onClick={handleImageSubmit}
            >
              Upload Image
            </button>
          </div>
          {formData.imageUrls.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Uploaded Image:</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="uploaded"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <label htmlFor="video" className="font-semibold">
              Video (100 MB max):
            </label>
            <input
              type="file"
              accept="video/*"
              id="video"
              className="p-3 border border-gray-300 rounded-lg"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            <button
              type="button"
              className="p-3 bg-blue-500 hover:bg-blue-800 text-white rounded-lg uppercase hover:opacity-95 mt-4"
              onClick={handleVideoSubmit}
            >
              Upload Video
            </button>
          </div>
          {formData.videoUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Uploaded Video:</h3>
              <div className="relative">
                <video
                  src={formData.videoUrl}
                  controls
                  className="w-full rounded-lg mt-2"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  onClick={handleRemoveVideo}
                >
                  X
                </button>
              </div>
            </div>
          )}
       
      
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
 
      </div>
      </form>
      <div className="flex justify-center">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || imageUploading || videoUploading}
          className="bg-green-500 hover:bg-green-800  text-white px-6 py-3 rounded mt-4"
        >
          {loading ? "Creating..." : "Create listing"}
        </button>
      </div>
    
    </main>
  );
}
