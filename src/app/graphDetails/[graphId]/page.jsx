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
import { FaBell, FaFilter, FaPlus, FaMinus, FaBars } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphDetails = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);
  const [activeButton, setActiveButton] = useState('Home');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { graphId } = params;

  useEffect(() => {
    if (graphId) {
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

      // Fetch graph data from local storage and merge with sample data
      const localStorageData = JSON.parse(localStorage.getItem('graphs')) || [];
      const graph = localStorageData.find(g => g.id === parseInt(graphId)) || sampleGraph;

      if (graph.id === sampleGraph.id) {
        setGraphData({
          labels: sampleGraph.rows.map(row => row.date),
          datasets: [
            {
              label: sampleGraph.title,
              data: sampleGraph.rows.map(row => row.price),
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.1,
              pointBackgroundColor: 'rgba(75,192,192,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75,192,192,1)',
            },
          ],
        });
        setLatestPrice(sampleGraph.rows[sampleGraph.rows.length - 1].price);
      } else {
        const { rows } = graph;
        setGraphData({
          labels: rows.map(row => row.date),
          datasets: [
            {
              label: graph.title,
              data: rows.map(row => row.price),
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.1,
              pointBackgroundColor: 'rgba(75,192,192,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75,192,192,1)',
            },
          ],
        });
        setLatestPrice(rows[rows.length - 1].price);
      }
    }
  }, [graphId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Data',
      },
    },
  };

  const handleUpdateClick = () => {
    // Check if the graph is the sample graph
    if (graphData && graphData.datasets[0].label === 'Sample Data') {
      setShowModal(true); // Show modal if it's a sample graph
    } else {
      router.push(`/updateGraph/${graphId}`);
    }
  };

  const handleHomeClick = () => {
    router.push('/homepage');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full lg:w-3/4 p-8 bg-white rounded shadow-md">
        {/* First Row: Buttons */}
        <div className="flex justify-between mb-6">
          {/* Left Side Buttons */}
          <div className="flex space-x-2 justify-center lg:justify-start w-full lg:w-auto">
            {['1Y', '2Y', '5Y', '10Y', 'All'].map((label) => (
              <button
                key={label}
                onClick={() => setActiveButton(label)}
                className={`px-4 py-2 text-sm font-medium rounded ${activeButton === label ? 'border border-gray-300' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex space-x-2 justify-center w-full lg:w-auto mt-4 lg:mt-0">
            <button
              onClick={handleHomeClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100"
            >
              Home
            </button>
            <button
              onClick={handleUpdateClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100"
            >
              Update
            </button>
            <button className="p-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
              <FaBell />
            </button>
            <button className="p-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
              <FaFilter />
            </button>
          </div>
        </div>

        {/* Second Row: Title and Icons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{graphData?.datasets[0]?.label || 'Sales Overview'}</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FaPlus />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FaMinus />
            </button>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <FaBars />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <ul>
                    <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Download SVG</a></li>
                    <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Download PNG</a></li>
                    <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Download CSV</a></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">{graphData?.description || 'A brief description of the graph data.'}</p>

        {/* Line Chart */}
        {graphData && <Line data={graphData} options={options} />}
      </div>

      {/* New Element */}
      <div className="w-full lg:w-1/4 lg:ml-4 mt-8 lg:mt-0 flex flex-col space-y-6 p-8 border border-gray-300 bg-white rounded shadow-md h-full lg:h-auto">
        <div className="p-6 border border-gray-300 rounded bg-white flex flex-col items-center">
          <div className="text-xl font-bold">{latestPrice !== null ? latestPrice : 'N/A'}</div>
          <div className="text-sm text-gray-600">INR, INDIA</div>
        </div>
        <div className="p-6 border border-gray-300 rounded bg-white flex flex-col items-center">
          <div className="text-sm font-semibold">% w-o-w change</div>
          <div className="text-sm text-gray-600">N/A</div>
        </div>
        <div className="p-6 border border-gray-300 rounded bg-white flex flex-col items-center">
          <div className="text-sm font-semibold">% m-o-m change</div>
          <div className="text-sm text-gray-600">N/A</div>
        </div>
        <div className="p-6 border border-gray-300 rounded bg-white flex flex-col items-center">
          <div className="text-sm font-semibold">% q-o-q change</div>
          <div className="text-sm text-gray-600">N/A</div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Update Not Allowed</h2>
            <p className="mb-4">This is a sample graph. You cannot update this graph. Please select a different graph to update.</p>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphDetails;
