import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'; // Import auth from firebase.js
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);

      const res = await fetch(`${url}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      dispatch(signInSuccess(data));
      toast.success('Sign in with Google successful!');
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google', error);
      toast.error('Could not sign in with Google');
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 hover:bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
