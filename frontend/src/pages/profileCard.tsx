import {
  CalendarCheck,
  Link as LinkIcon,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';
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
      } catch (err: any) {
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
        
        <div className='bg-gray-100 rounded-xl px-4 py-4 w-full sm:w-60 md:w-[105%] mx-auto'>
          <div className='mb-6 lg:flex lg:space-x-6'>
            <div className='hidden lg:block text-base text-gray-600 w-28'>
              Status
            </div>
            <div className='flex items-center justify-center lg:justify-start gap-4'>
              <UserCheck className='w-5 h-5 text-gray-500 lg:hidden' />
              <span className='bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium'>
                Active
              </span>
            </div>
          </div>
          <hr className='pb-3' />

          <div className='mb-6 lg:flex lg:space-x-6'>
            <div className='hidden lg:block text-base text-gray-600 w-28'>
              Joined On
            </div>
            <div className='flex items-center justify-center lg:justify-start gap-4'>
              <CalendarCheck className='w-5 h-5 text-gray-500 lg:hidden' />
              <span className='text-base text-gray-600'>{profile.joinOn}</span>
            </div>
          </div>
          <hr className='pb-3' />

          <div className='mb-6 lg:flex lg:space-x-6'>
            <div className='hidden lg:block text-base text-gray-600 w-28'>
              Email
            </div>
            <div className='flex items-center justify-center lg:justify-start gap-4'>
              <Mail className='w-5 h-5 text-gray-500 lg:hidden' />
              <span
                className='text-base text-gray-600 max-w-[220px] truncate hover:overflow-visible hover:whitespace-normal'
                title={profile.emailAddress}
              >
                {profile.emailAddress}
              </span>
            </div>
          </div>
          <hr className='pb-3' />

          {profile.url && (
            <>
              <div className='mb-6 lg:flex lg:space-x-6'>
                <div className='hidden lg:block text-base text-gray-600 w-28'>
                  URL
                </div>
                <div className='flex items-center justify-center lg:justify-start gap-4'>
                  <LinkIcon className='w-5 h-5 text-gray-500 lg:hidden' />
                  <span
                    className='text-base text-gray-600 max-w-[220px] truncate hover:overflow-visible hover:whitespace-normal'
                    title={profile.url}
                  >
                    {profile.url}
                  </span>
                </div>
              </div>
              <hr className='pb-3' />
            </>
          )}

          {profile.phoneNumber && (
            <div className='mb-6 lg:flex lg:space-x-6'>
              <div className='hidden lg:block text-base text-gray-600 w-28'>
                Phone
              </div>
              <div className='flex items-center justify-center lg:justify-start gap-4'>
                <Phone className='w-5 h-5 text-gray-500 lg:hidden' />
                <span className='text-base text-gray-600'>
                  {profile.phoneNumber}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
