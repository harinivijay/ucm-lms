import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AdminInsights = () => {
  // State to store the statistics data
  const [bookStats, setBookStats] = useState({});
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    // Fetch book statistics data
    axios.get('http://localhost:8080/lms/loan-reservation/book-statistics')
      .then(response => {
        setBookStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching book statistics:", error);
      });

    // Fetch user statistics data
    axios.get('http://localhost:8080/lms/members/statistics')
      .then(response => {
        setUserStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching user statistics:", error);
      });
  }, []);

  // Sample data for Pie chart (Book Availability)
  const pieData = {
    labels: ['Available Books', 'Loaned Books', 'Reserved Books'],
    datasets: [
      {
        data: [bookStats.totalBooks || 0, bookStats.loanedBooks || 0, bookStats.reservedBooks || 0],
        backgroundColor: ['#2563EB', '#EF4444', '#F59E0B'],
        hoverBackgroundColor: ['#1E3A8A', '#991B1B', '#B45309'],
      },
    ],
  };

  // Pie chart options to position legend on the right
  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333333', // Dark text for light background
          font: {
            size: 14,
          },
        },
      },
    },
    maintainAspectRatio: false, // Allows better control of size
  };

  // Sample data for Line chart (Weekly Activity)
  const [lineData, setLineData] = useState({
    labels: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'],
    datasets: [
      {
        label: 'Books Loaned',
        data: [],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
      },
      {
        label: 'Books Reserved',
        data: [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
      },
    ],
  });

  useEffect(() => {
    // Make the API call to fetch the data
    axios.get('http://localhost:8080/lms/loan-reservation/book-chart-statistics') // Update with your actual API endpoint
      .then(response => {
        const { 'Books Loaned': loanedBooks, 'Books Reserved': reservedBooks } = response.data;

        // Update the chart data
        setLineData(prevData => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: loanedBooks,
            },
            {
              ...prevData.datasets[1],
              data: reservedBooks,
            },
          ],
        }));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      {/* Scrollable container for content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Insights Dashboard</h1>
          <p className="text-gray-600">Key metrics and insights for library management</p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">New Users</h2>
            <p className="text-3xl font-bold text-blue-500">{userStats.newUsers || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
            <p className="text-3xl font-bold text-green-500">{userStats.totalUsers || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Total Librarians</h2>
            <p className="text-3xl font-bold text-yellow-500">{userStats.totalLibrarians || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Pending Requests</h2>
            <p className="text-3xl font-bold text-red-500">{bookStats.pendingRequests || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Total Books</h2>
            <p className="text-3xl font-bold text-purple-500">{bookStats.totalBooks || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Loaned Books</h2>
            <p className="text-3xl font-bold text-indigo-500">{bookStats.loanedBooks || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Reserved Books</h2>
            <p className="text-3xl font-bold text-orange-500">{bookStats.reservedBooks || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Overdue Books</h2>
            <p className="text-3xl font-bold text-teal-500">{bookStats.overdueBooks || 0}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Books Status Distribution</h3>
            <div className="w-full h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h3>
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInsights;
