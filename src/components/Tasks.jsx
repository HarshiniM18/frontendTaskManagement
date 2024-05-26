import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => {
      setTasks(data.tasks);
      setFilteredTasks(data.tasks);
    });
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterTasks(query, statusFilter);
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterTasks(searchQuery, status);
  }

  const filterTasks = (query, status) => {
    const filtered = tasks.filter(task =>
      task.description.toLowerCase().includes(query) &&
      (status === 'all' || task.status === status)
    );
    setFilteredTasks(filtered);
  }

  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search tasks..."
            className="border border-gray-500 rounded-md px-3 py-2 mr-2 bg-gray-800 text-white placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="border border-gray-500 rounded-md px-3 py-2 bg-gray-800 text-white"
          >
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {tasks.length !== 0 && (
          <h2 className="my-2 ml-2 md:ml-0 text-xl text-gray-300">
            Your tasks ({tasks.length})
          </h2>
        )}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {filteredTasks.length === 0 ? (
              <div className="w-[600px] h-[300px] flex items-center justify-center gap-4 text-gray-300">
                <span>No tasks found</span>
                <Link
                  to="/tasks/add"
                  className="bg-gray-700 text-white hover:bg-gray-600 font-medium rounded-md px-4 py-2 transition duration-300 ease-in-out"
                >
                  + Add new task
                </Link>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div
                  key={task._id}
                  className="bg-gray-900 my-4 p-4 text-gray-300 rounded-md shadow-md"
                >
                  <div className="flex items-center">
                    <span className="font-medium">Task #{index + 1}</span>

                    <Tooltip text="Edit this task" position="top">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="ml-auto mr-2 text-green-400 hover:text-green-300 transition duration-300 ease-in-out"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text="Delete this task" position="top">
                      <span
                        className="text-red-500 hover:text-red-400 cursor-pointer transition duration-300 ease-in-out"
                        onClick={() => handleDelete(task._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                  <div className="whitespace-pre mt-2">{task.description}</div>
                  <div className="mt-2">Status: <span className="font-semibold">{task.status}</span></div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Tasks;
