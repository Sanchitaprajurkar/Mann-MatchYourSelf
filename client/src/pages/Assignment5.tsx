import React, { useState, useEffect } from "react";
import axios from "axios";

// API Base URL (Update this after backend deployment)
const API_BASE_URL = "http://localhost:5000/api/form";

interface FormEntry {
  _id?: string;
  name: string;
  email: string;
  gender: string;
  age: string | number;
  dob: string;
  state: string;
  skills: string[];
}

const Assignment5 = () => {
  const [formData, setFormData] = useState<FormEntry>({
    name: "",
    email: "",
    gender: "Female",
    age: "",
    dob: "",
    state: "",
    skills: [],
  });

  const [allData, setAllData] = useState<FormEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const indianStates = ["Maharashtra", "Karnataka", "Delhi", "Gujarat", "Tamil Nadu", "Other"];
  const skillOptions = ["HTML", "CSS", "JavaScript", "React", "Node.js"];

  // 1. Fetch Data (Read Operation)
  const fetchAllEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      setAllData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllEntries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      const updatedSkills = checkbox.checked
        ? [...formData.skills, value]
        : formData.skills.filter((s) => s !== value);
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 2. Submit Data (Create Operation)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.post(`${API_BASE_URL}/submit`, formData);
      setMessage("✅ Data saved to MongoDB successfully!");
      setFormData({ name: "", email: "", gender: "Female", age: "", dob: "", state: "", skills: [] });
      fetchAllEntries(); // Refresh list
    } catch (error: any) {
      setMessage("❌ Error: " + (error.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Data (Delete Operation)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      fetchAllEntries();
      setMessage("🗑️ Record deleted successfully!");
    } catch (error) {
      setMessage("❌ Failed to delete record.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Full Stack Form (Assignment 5)</h2>
          {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            
            <div className="flex gap-4">
              <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} /> Male</label>
              <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} /> Female</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="age" placeholder="Age" required value={formData.age} onChange={handleChange} className="p-3 border rounded-lg" />
              <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="p-3 border rounded-lg text-sm" />
            </div>

            <select name="state" required value={formData.state} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="">Select State</option>
              {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {skillOptions.map(s => (
                <label key={s} className="flex items-center gap-2">
                  <input type="checkbox" name="skills" value={s} checked={formData.skills.includes(s)} onChange={handleChange} /> {s}
                </label>
              ))}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95">
              {loading ? "Processing..." : "Save to Database"}
            </button>
          </form>
        </div>

        {/* Right Side: Data List (Dynamic Fetch) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Live Database Data <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{allData.length}</span>
          </h2>
          <div className="h-[500px] overflow-y-auto space-y-3 pr-2">
            {allData.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.email}</p>
                  </div>
                  <button onClick={() => item._id && handleDelete(item._id)} className="text-red-400 hover:text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-4 text-xs text-gray-600">
                  <p>📍 {item.state}</p>
                  <p>🎂 {item.dob ? new Date(item.dob).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.skills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-[10px] px-2 py-0.5 rounded text-gray-500 font-medium">#{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment5;
