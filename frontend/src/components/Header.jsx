import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../storage/local_store.js';

const Header = () => {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex space-x-6">
          <Link to="/" className="text-lg font-semibold hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/todolist" className="text-lg font-semibold hover:text-gray-200">
            TodoList
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
