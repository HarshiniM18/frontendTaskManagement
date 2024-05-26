import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = isLoggedIn ? `${authState.user.name}'s tasks` : 'Task Management Application';
  }, [isLoggedIn, authState]);

  return (
    <MainLayout>
      {!isLoggedIn ? (
        <div className="bg-gray-800 text-white h-[40vh] py-8 text-center flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold mb-4">Task Management Application</h1>
          <Link
            to="/signup"
            className="mt-10 text-xl inline-block px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-500 transition duration-300 ease-in-out"
          >
            Sign Up Here!
            <span className="ml-2 text-lg"><i className="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl mt-8 mx-8 border-b-2 border-black-300 pb-2 text-black-100">
            Welcome {authState.user.name}
          </h1>
          <div className="mt-4 mx-8 p-4 bg-gray-900 shadow-lg rounded text-gray-200">
            <Tasks />
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Home;
