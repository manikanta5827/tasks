import React, { useEffect, useState, useRef } from 'react';
import TodoTable from '../components/TodoTable';
import api from '../api';

const TodoList = () => {
  const [tasks, settasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    title: '',
    priority: 1,
    status: 'pending',
    start_time: '',
    end_time: '',
  });
  const formDialogRef = useRef();

  const formatDateForInput = (date) => {
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset() * 60000;
    return new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchtasks = async () => {
      const response = await api.get('/todos');
      const adjustedtasks = response.data.map((todo) => ({
        ...todo,
        start_time: new Date(todo.start_time).toISOString(),
        end_time: todo.end_time ? new Date(todo.end_time).toISOString() : null,
      }));
      settasks(adjustedtasks);
    };
    fetchtasks();
  }, []);

  const openForm = (task = null) => {
    if (task) {
      setCurrentTask({
        ...task,
        start_time: formatDateForInput(task.start_time),
        end_time: task.end_time ? formatDateForInput(task.end_time) : '',
      });
    } else {
      setCurrentTask({
        title: '',
        priority: 1,
        status: 'pending',
        start_time: '',
        end_time: '',
      });
    }
    formDialogRef.current.showModal();
  };

  const closeForm = () => {
    formDialogRef.current.close();
    setCurrentTask({
      title: '',
      priority: 1,
      status: 'pending',
      start_time: '',
      end_time: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask((prevTask) => ({
      ...prevTask,
      [name]: name === 'priority' ? parseInt(value, 10) : value,
    }));
  };

  const handleAddOrEditTodo = async (e) => {
    e.preventDefault();

    const taskToSubmit = {
      ...currentTask,
      start_time: new Date(currentTask.start_time).toISOString(),
      end_time: currentTask.end_time ? new Date(currentTask.end_time).toISOString() : null,
    };

    if (currentTask.id) {
      // Update task
      settasks(tasks.map((task) => (task.id === currentTask.id ? { ...task, ...taskToSubmit } : task)));
      await api.put(`/todos/${currentTask.id}`, taskToSubmit);
    } else {
      // Add new task
      const response = await api.post('/todos', taskToSubmit);
      settasks([...tasks, { ...taskToSubmit, id: response.data.id }]);
    }
    closeForm();
  };

  const handleDelete = async (id) => {
    settasks(tasks.filter((todo) => todo.id !== id));
    await api.delete(`/todos/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task List</h1>
      </div>
      <button
        className="mb-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        onClick={() => openForm(null)}
      >
        + Add Task
      </button>
      <TodoTable data={tasks} onEdit={openForm} onDelete={handleDelete} />

      <dialog ref={formDialogRef} className="rounded-lg shadow-lg p-6 bg-white w-11/12 md:w-1/2">
        <form onSubmit={handleAddOrEditTodo} className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {currentTask.id ? 'Update Task' : 'Add Task'}
          </h2>
          <label className="flex flex-col">
            <span className="text-gray-600">Title:</span>
            <input
              type="text"
              name="title"
              value={currentTask.title}
              onChange={handleInputChange}
              required
              className="border rounded-lg p-2 mt-1 focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-600">Priority (1-5):</span>
            <input
              type="number"
              name="priority"
              value={currentTask.priority}
              onChange={handleInputChange}
              min="1"
              max="5"
              required
              className="border rounded-lg p-2 mt-1 focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-600">Status:</span>
            <select
              name="status"
              value={currentTask.status}
              onChange={handleInputChange}
              className="border rounded-lg p-2 mt-1 focus:ring focus:ring-blue-300"
            >
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-gray-600">Start Time:</span>
            <input
              type="datetime-local"
              name="start_time"
              value={currentTask.start_time}
              onChange={handleInputChange}
              required
              className="border rounded-lg p-2 mt-1 focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-600">End Time:</span>
            <input
              type="datetime-local"
              name="end_time"
              value={currentTask.end_time}
              onChange={handleInputChange}
              className="border rounded-lg p-2 mt-1 focus:ring focus:ring-blue-300"
            />
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentTask.id ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default TodoList;
