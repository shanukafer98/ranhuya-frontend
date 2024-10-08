import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { app, storage } from "../firebase";  // import storage from firebase.js
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
 
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [userListings, setUserListings] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName); // using storage here
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        toast.success("Image uploaded successfully!");
      },
      (error) => {
        toast.error("Error uploading image (image must be less than 2 MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${url}/user/update/${currentUser._id}`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("User updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${url}/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials:"include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User account deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${url}/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Signed out successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`${url}/user/listings/${currentUser._id}`, {
        method: 'GET',
        credentials: 'include', // Include credentials (cookies) in the request
        headers: {
          'Content-Type': 'application/json', // Ensure headers are set correctly
        },
      });
      
      // Check if the response status is OK (200-299)
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Error fetching listings");
        return;
      }
      const data = await res.json();
      if (data.success === false) {
        toast.error("There are no listings to show");
        return;
      }
      setUserListings(data);
    } catch (error) {
      toast.error("Error showing listings");
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${url}/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials:"include",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

// import { useSelector } from 'react-redux';
// import { useRef, useState, useEffect } from 'react';
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import { app } from '../firebase';
// import {
//   updateUserStart,
//   updateUserSuccess,
//   updateUserFailure,
//   deleteUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   signOutUserStart,
// } from '../redux/user/userSlice';
// import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// export default function Profile() {
//   const fileRef = useRef(null);
//   const { currentUser, loading, error } = useSelector((state) => state.user);
//   const [file, setFile] = useState(undefined);
//   const [filePerc, setFilePerc] = useState(0);

//   const [formData, setFormData] = useState({});


//   const [userListings, setUserListings] = useState([]);
//   const dispatch = useDispatch();

//   // firebase storage
//   // allow read;
//   // allow write: if
//   // request.resource.size < 2 * 1024 * 1024 &&
//   // request.resource.contentType.matches('image/.*')

//   useEffect(() => {
//     if (file) {
//       handleFileUpload(file);
//     }
//   }, [file]);

//   const handleFileUpload = (file) => {
//     const storage = getStorage(app);
//     const fileName = new Date().getTime() + file.name;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setFilePerc(Math.round(progress));
//       },
//       (error) => {
//         setFileUploadError(true);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
//           setFormData({ ...formData, avatar: downloadURL })
//         );
//       }
//     );
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(updateUserStart());
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(updateUserFailure(data.message));
//         return;
//       }

//       dispatch(updateUserSuccess(data));
//       setUpdateSuccess(true);
//     } catch (error) {
//       dispatch(updateUserFailure(error.message));
//     }
//   };

//   const handleDeleteUser = async () => {
//     try {
//       dispatch(deleteUserStart());
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(deleteUserFailure(data.message));
//         return;
//       }
//       dispatch(deleteUserSuccess(data));
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message));
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       dispatch(signOutUserStart());
//       const res = await fetch('/api/auth/signout');
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(deleteUserFailure(data.message));
//         return;
//       }
//       dispatch(deleteUserSuccess(data));
//     } catch (error) {
//       dispatch(deleteUserFailure(data.message));
//     }
//   };

//   const handleShowListings = async () => {
//     try {
//       setShowListingsError(false);
//       const res = await fetch(`/api/user/listings/${currentUser._id}`);
//       const data = await res.json();
//       if (data.success === false) {
//         setShowListingsError(true);
//         return;
//       }

//       setUserListings(data);
//     } catch (error) {
//       setShowListingsError(true);
//     }
//   };

//   const handleListingDelete = async (listingId) => {
//     try {
//       const res = await fetch(`/api/listing/delete/${listingId}`, {
//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         console.log(data.message);
//         return;
//       }

//       setUserListings((prev) =>
//         prev.filter((listing) => listing._id !== listingId)
//       );
//     } catch (error) {
//       console.log(error.message);
//     }
//   };


return (
  <div className="flex flex-col lg:flex-row gap-12">
    <div className="lg:w-1/2 w-full lg:mx-6 sm:mx-0 ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 shadow-2xl"
        />
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg shadow-2xl"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg shadow-2xl"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg shadow-2xl"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-slate-500 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <button
          onClick={handleDeleteUser}
          className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
        >
          Delete account
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
        >
          Sign out
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleShowListings}
          className="w-auto bg-yellow-600 hover:bg-yellow-300 text-white font-bold py-2 px-4 rounded my-6"
        >
          Show Listings
        </button>
      </div>
    </div>
    <div className="lg:w-1/2 w-full  ">
    <h1 className="text-3xl font-semibold text-center my-7">
            Your Listings
          </h1>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 ">
          
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className=" border-yellow-600 border-2 mx-6  rounded-lg p-3 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xl"
            >
              <Link
                to={`/listing/${listing._id}`}
                className="flex gap-4 items-center"
              >
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
                <p className="font-bold">{listing.title}</p>
              </Link>
              <div className="flex flex-col items-center gap-2">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-green-600 hover:bg-green-800 rounded w-auto uppercase text-white px-2 shadow-lg">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="bg-red-600 hover:bg-red-800 rounded w-auto uppercase text-white px-2 shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}
