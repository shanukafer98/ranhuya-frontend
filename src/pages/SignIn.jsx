import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { auth, signInWithEmailAndPassword } from '../firebase';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(signInStart());
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      if (!userCredential.user.emailVerified) {
        dispatch(signInFailure('Email not verified. Please verify your email.'));
        toast.error('Email not verified. Please verify your email.');
        return;
      }
      
      // // Generate the token
      const token = await userCredential.user.getIdToken(true);
      console.log('Generated Token:', token); // For debugging

      // // Verify the token is generated correctly
      if (!token) {
        throw new Error('Failed to generate authentication token.');
      }

      // Send token to the backend
      const res = await fetch(`${url}/api/auth/signin`, {
        method: 'POST',
        credentials: 'include', 
        
        headers: {
          'Content-Type': 'application/json',
       
        },
        body: JSON.stringify(formData),
      });

      // Check the response
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }

      // Successful sign in
      dispatch(signInSuccess(data));
      toast.success('Sign In Successful!');
      navigate('/');
    } catch (error) {
      console.error('Sign In Error:', error); // Log error for debugging
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          required
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          required
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 hover:bg-slate-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p> Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700 hover:underline'>Sign up</span>
        </Link>
      </div>
    </div>
  );
}
