"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiMinus } from 'react-icons/fi'; // Import plus and minus icons

const AddGraph = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState([{ price: '', date: '' }]); // State for rows
  const [error, setError] = useState('');

  const router = useRouter();

  const handleAddGraph = (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!title || !description || rows.some(row => !row.price || !row.date)) {
      setError('All fields are required. Please fill in all fields.');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
      return;
    }

    // Validate description word count
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 30) {
      setError('Description should not exceed 30 words.');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
      return;
    }

    // Create a new graph object
    const newGraph = {
      id: Date.now(), // Unique identifier
      title,
      description,
      rows: rows.map(row => ({
        price: parseFloat(row.price),
        date: row.date,
      })),
    };

    // Retrieve existing graphs from localStorage
    const existingGraphs = JSON.parse(localStorage.getItem('graphs')) || [];

    // Append the new graph
    existingGraphs.push(newGraph);

    // Save back to localStorage
    localStorage.setItem('graphs', JSON.stringify(existingGraphs));

    // Clear the form
    setTitle('');
    setDescription('');
    setRows([{ price: '', date: '' }]);
    setError('');

    alert('Graph added successfully!');
  };

  const handleHomeClick = () => {
    router.push('/homepage');
  };

  const handleAddRow = () => {
    setRows([...rows, { price: '', date: '' }]);
  };

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    }
  };

  const handleRowChange = (index, field, value) => {
    const newRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(newRows);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Graph</h2>
          <button
            onClick={handleHomeClick}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
          >
            Home
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAddGraph}>
          {/* Graph Title */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="title">
              Graph Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter graph title"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="description">
              Description (Max 30 words)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter a brief description"
              rows="3"
            ></textarea>
            <p className="text-sm text-gray-600 mt-1">
              {description.trim().split(/\s+/).length}/30 words
            </p>
          </div>

          {/* Section Title and Controls */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Price and Date</h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
              >
                <FiPlus />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveRow(rows.length - 1)}
                disabled={rows.length === 1}
                className={`p-1 ${rows.length === 1 ? 'bg-gray-400' : 'bg-red-600'} text-white rounded-full hover:bg-red-700 focus:outline-none`}
              >
                <FiMinus />
              </button>
            </div>
          </div>

          {/* Price and Date Rows */}
          {rows.map((row, index) => (
            <div key={index} className="flex flex-col md:flex-row md:space-x-4 mb-4">
              <div className="flex-1 mb-4 md:mb-0">
                <label className="block text-gray-700 mb-2 font-semibold" htmlFor={`price-${index}`}>
                  Price
                </label>
                <input
                  type="number"
                  id={`price-${index}`}
                  value={row.price}
                  onChange={(e) => handleRowChange(index, 'price', e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter price"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 font-semibold" htmlFor={`date-${index}`}>
                  Select Date
                </label>
                <input
                  type="date"
                  id={`date-${index}`}
                  value={row.date}
                  onChange={(e) => handleRowChange(index, 'date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
          ))}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
            >
              Add Graph
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGraph;
