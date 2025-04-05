import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

export const ProfileCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state;
  const [profile, setProfile] = useState<any>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    function getSuffix(n: number) {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
      }
    }
    return `${day}${getSuffix(day)} ${month} ${year}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseURL}/user/${userId}`);
        setProfile(res.data);
        res.data.joinOn = formatDate(res?.data?.joinOn);
      } catch (err) {
        console.error('Error fetching user:', err);
        if (err?.response?.status === 500) {
          navigate('/');
        }
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className='h-screen flex items-center bg-blue-50'>
      <div className='mx-auto max-w-max px-6 py-2 md:px-12 md:py-10 overflow-hidden rounded-3xl bg-slate-50 shadow-lg md:max-w-2xl'>
        {profile.gravatar.thumbnailUrl ? (
          <div className='flex-col md:pb-5'>
            <img
              src={profile.gravatar.thumbnailUrl}
              alt='Gravatar'
              className='w-24 h-24 rounded-full object-cover mb-2 mx-auto'
            />
            <p className='flex justify-center font-bold text-4xl mb-2'>
              {profile.gravatar.displayName || profile.fullName}
            </p>

            {profile.description && (
              <p className='flex justify-center text-xl'>
                {profile.description}
              </p>
            )}

            <div className='flex flex-col md:flex-row gap-1 justify-center items-center text-lg'>
              <p>{profile.country} ,</p>
              <p>{profile.state} ,</p>
              <p>{profile.city}</p>
            </div>
          </div>
        ) : (
          <div className='w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold mb-4 mx-auto'>
            {profile.fullName?.toUpperCase().charAt(0)}
          </div>
        )}

        <div className='bg-gray-100 rounded-xl px-4 py-4 w-full md:w-96 sm:w-60'>
          <div className='flex justify-between items-center mb-6'>
            <span className='text-base text-gray-600 hidden sm:inline'>
              Status
            </span>
            <span className='bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium mx-auto sm:mx-0'>
              Active
            </span>
          </div>
          <hr className='pb-3' />

          <div className='flex justify-between items-center mb-6'>
            <span className='text-base  text-gray-600 hidden sm:inline'>
              Joined On
            </span>
            <span className='text-base text-gray-600 mx-auto sm:mx-0'>
              {profile.joinOn}
            </span>
          </div>
          <hr className='pb-3' />
          <div className='flex justify-between items-center mb-6'>
            <span className='text-base text-gray-600 hidden md:inline'>
              Email
            </span>
            <span className='text-base text-gray-600 mx-auto sm:mx-0 '>
              {profile.emailAddress}
            </span>
          </div>
          <hr className='pb-3' />
          {profile.url && (
            <div className='flex justify-between items-center mb-6'>
              <span className='text-base  text-gray-600 hidden md:inline'>
                URL
              </span>
              <span
                className='text-base text-gray-600 mx-auto sm:mx-0 lg:truncate lg:max-w-[220px] lg:hover lg:cursor-pointer'
                title={profile.url}
              >
                {profile.url}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
