import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth, createUserWithEmailAndPassword, sendEmailVerification } from '../firebase';
import OAuth from '../components/OAuth';
const url = import.meta.env.VITE_BACKEND_URL;

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCredential.user);

      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(`${url}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Sign up successful! Please check your email to verify your account.');
        navigate('/sign-in');
      } else {
        throw new Error(data.message || 'Failed to sign up');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          required
          onChange={handleChange}
        />
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 hover:underline'>Sign in</span>
        </Link>
      </div>

    </div>
  );
}
