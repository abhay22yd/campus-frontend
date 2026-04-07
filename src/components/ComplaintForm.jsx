import React, { useState } from "react";
import axios from 'axios';

function ComplaintForm({ onSave }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Hostel");
  const [description, setDescription] = useState("");

  
   const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Get the user object from storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) {
    alert("Session expired. Please login again.");
    return;
  }

  const complaintData = {
    title,
    category,
    description,
    user: user.id || user._id // Ensure this matches your backend field
  };

  try {
    const res = await axios.post('http://localhost:5000/api/complaints/add', complaintData, {
      // 2. SEND THE TOKEN IN THE HEADER
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    onSave(res.data);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to submit");
  }
};

  return (
    <div className="surface p-6 md:p-7 w-full lg:col-span-2 sticky top-6">
      <h2 className="text-2xl font-bold mb-2">Raise A New Complaint</h2>
      <p className="muted mb-6 text-sm">Share issue details and we will route it to the right team.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold uppercase muted ml-1">Title</label>
          <input 
            type="text" 
            placeholder="e.g. Broken Fan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-ui mt-1"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase muted ml-1">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select-ui mt-1"
          >
            <option value="Hostel">Hostel</option>
            <option value="Mess">Mess</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Academic">Academic</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase muted ml-1">Description</label>
          <textarea 
            rows="3"
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-ui mt-1 min-h-28"
            required
          ></textarea>
        </div>

        <button 
          type="submit"
          className="primary-btn mt-2"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;