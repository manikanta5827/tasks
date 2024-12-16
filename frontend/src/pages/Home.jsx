import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import TodoList from './TodoList';

import Header from '../components/Header';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="todolist" element={<TodoList />} />
      </Routes>
    </div>
  );
}

export default Home;
