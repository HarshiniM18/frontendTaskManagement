import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import Input from './utils/Input';
import Loader from './utils/Loader';

const SignupForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("signup", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = { url: "/auth/signup", method: "post", data: formData };
    fetchData(config).then(() => {
      navigate("/login");
    });
  }

  const fieldError = (field) => (
    <p className={`mt-1 text-red-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <form className='m-auto my-16 max-w-[500px] p-8 bg-gray-800 text-white border border-gray-700 shadow-lg rounded-md'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-4 text-2xl font-semibold'>Welcome, Sign Up Here...</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Name</label>
              <Input type="text" name="name" id="name" value={formData.name} placeholder="Enter Your Name" onChange={handleChange} className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" />
              {fieldError("name")}
            </div>

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
              <Link to="/login" className='text-gray-400 hover:text-gray-300 transition duration-300 ease-in-out'>Already have an account? Login here</Link>
            </div>
          </>
        )}
      </form>
    </>
  )
}

export default SignupForm;
