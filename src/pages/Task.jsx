import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "../components/utils/Input";
import Loader from "../components/utils/Loader";
import useFetch from "../hooks/useFetch";
import MainLayout from "../layouts/MainLayout";
import validateManyFields from "../validations";

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    status: "todo",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = {
        url: `/tasks/${taskId}`,
        method: "get",
        headers: { Authorization: authState.token },
      };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          description: data.task.description,
          status: data.task.status,
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (task) {
      setFormData({
        description: task.description,
        status: task.status,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    const requestData = {
      description: formData.description,
      status: formData.status,
    };

    const config = {
      url: mode === "add" ? "/tasks" : `/tasks/${taskId}`,
      method: mode === "add" ? "post" : "put",
      data: requestData,
      headers: { Authorization: authState.token },
    };

    fetchData(config).then(() => {
      navigate("/");
    });
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <MainLayout>
      <form className="m-auto my-16 max-w-[1000px] bg-gray-800 text-white p-8 border border-gray-700 shadow-md rounded-md">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-center mb-4 text-gray-300">
              {mode === "add" ? "Add New Task" : "Edit Task"}
            </h2>
            <div className="mb-4">
              <label htmlFor="description" className="text-gray-400">Description</label>
              <Textarea
                type="description"
                name="description"
                id="description"
                value={formData.description}
                placeholder="Write here..."
                onChange={handleChange}
                className="bg-gray-700 text-white border border-gray-600 rounded-md"
              />
              {fieldError("description")}
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="text-gray-400">Status</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 w-full"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="text-gray-400 mb-4">Status: {formData.status}</div>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 font-medium rounded-md"
              onClick={handleSubmit}
            >
              {mode === "add" ? "Add task" : "Update Task"}
            </button>
            <button
              className="ml-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 font-medium rounded-md"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            {mode === "update" && (
              <button
                className="ml-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 font-medium rounded-md"
                onClick={handleReset}
              >
                Reset
              </button>
            )}
          </>
        )}
      </form>
    </MainLayout>
  );
};

export default Task;
