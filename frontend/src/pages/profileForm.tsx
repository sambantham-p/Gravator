import * as yup from 'yup';

import { City, Country, ICity, IState, State } from 'country-state-city';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

const baseURL = import.meta.env.VITE_BASE_URL;

// Phone regex for indian phone numbers
const phoneReg = /^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/;

const Profile = yup.object().shape({
  emailAddress: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),
  fullName: yup.string().required('User Name is required'),
  url: yup.string().url(),
  description: yup.string(),
  location: yup.object().shape({
    country: yup.string().required(),
    state: yup.string().required(),
    city: yup.string().required(),
  }),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(phoneReg, 'Phone number is not valid'),
});

export const ProfileForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Profile),
  });
  const getCountryNameByCode = (countryCode: any) => {
    const country = Country.getAllCountries().find(
      (c) => c.isoCode === countryCode
    );
    return country?.name || countryCode;
  };

  const getStateNameByCode = (countryCode: any, stateCode: any) => {
    const state = State.getStatesOfCountry(countryCode).find(
      (s) => s.isoCode === stateCode
    );
    return state?.name || stateCode;
  };
  const handleOnSubmit = (data: any) => {
    const formattedData = {
      emailAddress: data.emailAddress,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      country: getCountryNameByCode(data.location.country),
      state: getStateNameByCode(data.location.country, data.location.state),
      city: data.location.city,
      url: data.url,
      description: data.description,
    };

    axios
      .post(`${baseURL}/user`, formattedData)
      .then((response) => {
        navigate(`/${response.data._id}/profile`, {
          state: response.data._id,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, { position: 'top-right' });
        console.error('Submission error:', err);
      });
  };

  const countries = Country.getAllCountries();
  const selectedCountryISOCode = useWatch({
    control,
    name: 'location.country',
  });
  const selectedStateISOCode = useWatch({ control, name: 'location.state' });
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  useEffect(() => {
    if (selectedCountryISOCode) {
      setStates(State.getStatesOfCountry(selectedCountryISOCode) || []);
      setCities([]);
      setValue('location.state', '');
      setValue('location.city', '');
    }
  }, [selectedCountryISOCode, setValue]);
  useEffect(() => {
    if (selectedCountryISOCode && selectedStateISOCode) {
      const newCities =
        City.getCitiesOfState(selectedCountryISOCode, selectedStateISOCode) ||
        [];
      setCities(newCities);
      setValue('location.city', '');
    }
  }, [selectedCountryISOCode, selectedStateISOCode, setValue]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-6 md:p-12 lg:p-24'>
      <div className='bg-blue-100 shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 max-w-lg w-full'>
        <h1 className='text-2xl font-bold text-center text-gray-black mb-10'>
          User Profile
        </h1>
        <form
          className='flex flex-col space-y-8 items-center sm:items-start w-full'
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <div>
            <input
              placeholder={'Email'}
              {...register('emailAddress')}
              className='sm:w-screen max-w-96 px-3 py-1 sm:px-4 rounded-lg border focus:bg-blue-200 text-left'
            />
            <p className='error'>{errors.emailAddress?.message}</p>
          </div>
          <div>
            <input
              placeholder={'Full Name'}
              {...register('fullName')}
              className='sm:w-screen max-w-96 px-3 py-1 sm:px-4 rounded-lg border focus:bg-blue-200 text-left'
            />
            <p className='error'>{errors.fullName?.message}</p>
          </div>
          <div>
            <input
              placeholder={'Phone Number'}
              {...register('phoneNumber')}
              className='sm:w-screen max-w-96 px-3 py-1 sm:px-4 rounded-lg border focus:bg-blue-200 text-left'
            />
            <p className='error'>{errors.phoneNumber?.message}</p>
          </div>

          <div>
            <select
              {...register('location.country')}
              className='sm:w-screen max-w-96 px-3 py-2 sm:px-4 rounded-lg border focus:bg-blue-200 text-left'
              onChange={(e) => {
                setValue('location.country', e.target.value);
                setValue('location.state', '');
                setValue('location.city', '');
              }}
            >
              <option value=''>Select Country</option>
              {countries.map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
            <p className='error'>{errors.location?.country?.message}</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <select
                {...register('location.state')}
                className='w-80 sm:w-48 py-2 sm:px-6 rounded-lg border focus:bg-blue-200 text-left'
                onChange={(e) => setValue('location.state', e.target.value)}
              >
                <option value=''>Select State</option>
                {states.map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className='error'>{errors.location?.state?.message}</p>
            </div>
            <div className='flex-1'>
              <select
                {...register('location.city')}
                className='w-80 sm:w-48 px-4 py-2 sm:px-6 rounded-lg border focus:bg-blue-200 text-left'
                onChange={(e) => setValue('location.city', e.target.value)}
              >
                <option value=''>Select City</option>
                {cities.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className='error'>{errors.location?.city?.message}</p>
            </div>
          </div>
          <div>
            <input
              placeholder={'Short Description'}
              {...register('description')}
              className='sm:w-screen max-w-96 px-3 py-1 sm:px-4 rounded-lg border focus:bg-blue-200 text-left'
            />
            <p className='error'>{errors.description?.message}</p>
          </div>
          <div>
            <input
              placeholder={'Personal Website or Social Profile URL'}
              {...register('url')}
              className='sm:w-screen max-w-96 px-3 py-1 sm:px-4 rounded-lg border focus:bg-blue-200 text-left'
            />
            <p className='error'>{errors.url?.message}</p>
          </div>

          <button
            className=' mb-6 w-1/2 py-2 mx-auto md:w-5/6  pt-3 sm:h-12  bg-blue-400 transition duration-300 hover:bg-blue-500 font-bold rounded-lg text-white'
            type='submit'
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
