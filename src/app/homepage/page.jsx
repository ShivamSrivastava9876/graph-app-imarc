"use client";

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaPlus, FaMinus, FaBars } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Homepage = () => {
  const [graphsData, setGraphsData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Sample graph data
    const sampleGraph = {
      id: 9999999999999, // Unique ID for the sample graph
      title: 'Sample Data',
      description: 'A sample graph with hardcoded data',
      rows: [
        { price: 30000, date: '2024-01-01' },
        { price: 32000, date: '2024-02-01' },
        { price: 31000, date: '2024-03-01' },
        { price: 33000, date: '2024-04-01' },
        { price: 34000, date: '2024-05-01' },
      ],
    };

    // Fetch data from local storage and merge with sample data
    const localStorageData = JSON.parse(localStorage.getItem('graphs')) || [];
    console.log(localStorageData, "local");
    const combinedData = [sampleGraph, ...localStorageData].map((graph) => {
      return {
        id: graph.id, // Ensure ID is included in the combined data
        labels: graph.rows.map(row => row.date),
        datasets: [
          {
            label: graph.title,
            data: graph.rows.map(row => row.price),
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
            pointBackgroundColor: 'rgba(75,192,192,1)',
          },
        ],
      };
    });

    setGraphsData(combinedData);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Data',
      },
    },
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleAddGraph = () => {
    router.push('/addGraph');
  };

  const handleViewGraph = (graphId) => {
    router.push(`/graphDetails/${graphId}`);
  };

  const handleDeleteGraph = (graphId) => {
    if (window.confirm('Are you sure you want to delete this graph and its data?')) {
      // Remove from local storage
      const localStorageData = JSON.parse(localStorage.getItem('graphs')) || [];
      const updatedData = localStorageData.filter(graph => graph.id !== graphId);
      localStorage.setItem('graphs', JSON.stringify(updatedData));

      // Update state to re-render
      setGraphsData(prevData => prevData.filter(graph => graph.id !== graphId));
    }
  };

  return (
    <div className="flex flex-wrap justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">GRAPHS</h1>
        <button
          onClick={handleAddGraph}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Graph
        </button>
      </div>
      
      {graphsData.map((data, index) => (
        <div key={index} className="w-full md:w-1/2 p-4">
          <div className="bg-white p-8 rounded shadow-md w-full">
            {/* First Row: View and Delete Buttons */}
            <div className="flex justify-end mb-6 space-x-4">
              <button
                onClick={() => handleViewGraph(data.id)}
                className="px-3 py-1.5 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteGraph(data.id)}
                className="px-3 py-1.5 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>

            {/* Second Row: Title and Icons */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{data.datasets[0].label}</h2>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 text-gray-600 hover:text-gray-800">
                  <FaPlus />
                </button>
                <button className="p-1.5 text-gray-600 hover:text-gray-800">
                  <FaMinus />
                </button>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="p-1.5 text-gray-600 hover:text-gray-800"
                  >
                    <FaBars />
                  </button>
                  {dropdownOpen === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                      <ul>
                        <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Download SVG</a></li>
                        <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Download PNG</a></li>
                        <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Download CSV</a></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">{data.description || 'A brief description of the graph data.'}</p>

            {/* Line Chart */}
            <Line data={data} options={options} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Homepage;
