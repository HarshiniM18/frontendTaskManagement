import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validateManyFields from '../validations';
import Input from './utils/Input';
import { useDispatch, useSelector } from "react-redux";
import { postLoginData } from '../redux/actions/authActions';
import Loader from './utils/Loader';

const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("login", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-red-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <form className='m-auto my-16 max-w-[500px] bg-gray-800 text-white p-8 border border-gray-700 shadow-lg rounded-md'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className='text-center mb-4 text-2xl font-semibold'>Welcome, Please Login...</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Email</label>
            <Input type="text" name="email" id="email" value={formData.email} placeholder="Enter Your Email" onChange={handleChange} className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" />
            {fieldError("email")}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Password</label>
            <Input type="password" name="password" id="password" value={formData.password} placeholder="Enter Your Password" onChange={handleChange} className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" />
            {fieldError("password")}
          </div>

          <button className='w-full bg-gray-600 text-white px-4 py-2 font-medium rounded-md hover:bg-gray-500 transition duration-300 ease-in-out' onClick={handleSubmit}>Submit</button>

          <div className='pt-4 text-center'>
            <Link to="/signup" className='text-gray-400 hover:text-gray-300 transition duration-300 ease-in-out'>Don't have an account? Signup here...</Link>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginForm;
