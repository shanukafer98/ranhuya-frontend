import { Link, } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <header className='bg-transparent-50 shadow-md'>
      <div className='flex justify-between items-center max-w-7xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-yellow-600'>රන්</span>
            <span className='text-slate-700'>හුය</span>
          </h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 text-lg font-bold    hover:text-slate-300'>
              Home
            </li>
          </Link>
       
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-blue-500 hover:underline text-lg font-bold hover:text-blue-700'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
