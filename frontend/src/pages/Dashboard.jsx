import React, { useState, useEffect } from 'react';
import api from '../api';

const calculateTimeDifference = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = Math.abs(end - start);

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedPercentage: 0,
    pendingPercentage: 0,
  });
  const [pendingSummary, setPendingSummary] = useState({
    count: 0,
    totalLapsedHours: 0,
    totalFinishHours: 0,
  });
  const [groupedTasks, setGroupedTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/todos');
        setTasks(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (tasks.length === 0) return;

    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'finished').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending');

    const completedPercentage = ((completedTasks / totalTasks) * 100).toFixed(0);
    const pendingPercentage = (100 - completedPercentage).toFixed(0);

    let totalLapsedHours = 0;
    let totalFinishHours = 0;

    pendingTasks.forEach(task => {
      const lapsed = calculateTimeDifference(task.start_time, now);
      const finish = calculateTimeDifference(now, task.end_time);

      totalLapsedHours += lapsed.hours + lapsed.minutes / 60;
      totalFinishHours += finish.hours + finish.minutes / 60;
    });

    const priorityGroups = pendingTasks.reduce((groups, task) => {
      const priority = task.priority;
      if (!groups[priority]) {
        groups[priority] = {
          tasks: [],
          totalLapsedHours: 0,
          totalFinishHours: 0,
        };
      }
      const lapsed = calculateTimeDifference(task.start_time, now);
      const finish = calculateTimeDifference(now, task.end_time);

      groups[priority].tasks.push(task);
      groups[priority].totalLapsedHours += lapsed.hours + lapsed.minutes / 60;
      groups[priority].totalFinishHours += finish.hours + finish.minutes / 60;

      return groups;
    }, {});

    setSummary({ totalTasks, completedPercentage, pendingPercentage });
    setPendingSummary({ count: pendingTasks.length, totalLapsedHours, totalFinishHours });
    setGroupedTasks(priorityGroups);
  }, [tasks]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-bold">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-lg font-bold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p className="text-gray-700">Total Tasks: {summary.totalTasks}</p>
            <p className="text-green-600">Tasks Completed: {summary.completedPercentage}%</p>
            <p className="text-yellow-600">Tasks Pending: {summary.pendingPercentage}%</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Pending Task Summary</h2>
            <p className="text-gray-700">Pending Tasks: {pendingSummary.count}</p>
            <p className="text-gray-700">Total Time Lapsed: {pendingSummary.totalLapsedHours.toFixed(2)} hours</p>
            <p className="text-gray-700">Total Time to Finish: {pendingSummary.totalFinishHours.toFixed(2)} hours</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Tasks Grouped by Priority</h2>
        <table className="table-auto w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Priority</th>
              <th className="border border-gray-300 p-2">Total Pending Tasks</th>
              <th className="border border-gray-300 p-2">Total Time Lapsed (hours)</th>
              <th className="border border-gray-300 p-2">Total Time to Finish (hours)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedTasks).map(([priority, group]) => (
              <tr key={priority} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{priority}</td>
                <td className="border border-gray-300 p-2">{group.tasks.length}</td>
                <td className="border border-gray-300 p-2">{group.totalLapsedHours.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{group.totalFinishHours.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
