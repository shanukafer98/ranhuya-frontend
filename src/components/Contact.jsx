import { useEffect, useState } from 'react';

export default function Contact({ listing }) {
  const [serviceProvider, setServiceProvider] = useState(null);
  const [error, setError] = useState(null);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchServiceProvider = async () => {
      try {
        const res = await fetch(`${url}/api/user/${listing.userRef}`);
        if (!res.ok) {
          throw new Error('Failed to fetch service provider details');
        }
        const data = await res.json();
        setServiceProvider(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchServiceProvider();
  }, [listing.userRef]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      {serviceProvider ? (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{serviceProvider.username}</span> for{' '}
            <span className='font-semibold'>{listing.title.toLowerCase()}</span>
          </p>
          <div>
            <p>
              <span className='font-semibold'>Primary Contact Number:</span> {serviceProvider.contactNumber1}
            </p>
            {serviceProvider.contactNumber2 && (
              <p>
                <span className='font-semibold'>Secondary Contact Number:</span> {serviceProvider.contactNumber2}
              </p>
            )}
            <p>
              <span className='font-semibold'>Address:</span> {serviceProvider.address}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading contact details...</p>
      )}
    </>
  );
}
