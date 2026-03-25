import React, { useState } from "react";

const Assignment3 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "Female",
    age: "",
    dob: "",
    state: "",
    skills: [] as string[],
  });

  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);

  const indianStates = [
    "Maharashtra", "Karnataka", "Delhi", "Gujarat", "Tamil Nadu", 
    "West Bengal", "Rajasthan", "Punjab", "Kerala", "Other"
  ];

  const skillOptions = ["HTML", "CSS", "JavaScript", "React", "Node.js", "Python"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      const updatedSkills = checkbox.checked
        ? [...formData.skills, value]
        : formData.skills.filter((skill) => skill !== value);
      
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Assignment 3
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Design and Development of Interactive Frontend Form
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="email@example.com"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="flex space-x-6 pt-1">
                {["Male", "Female", "Other"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      name="gender"
                      type="radio"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="25"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            {/* State Dropdown */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <select
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              >
                <option value="">Select a state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Skills Checkboxes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <div className="grid grid-cols-3 gap-2">
                {skillOptions.map((skill) => (
                  <label key={skill} className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      name="skills"
                      type="checkbox"
                      value={skill}
                      checked={formData.skills.includes(skill)}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="ml-2 text-xs text-gray-600">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Submit Profile
            </button>
          </div>
        </form>

        {/* Dynamic Display of Submitted Data */}
        {submittedData && (
          <div className="mt-10 p-6 bg-gray-900 rounded-2xl text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold border-b border-gray-700 pb-3 mb-4 text-amber-400">
              Submitted Data Output
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Full Name</span>
                <span className="font-semibold">{submittedData.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Email</span>
                <span className="font-semibold">{submittedData.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Gender</span>
                <span className="font-semibold">{submittedData.gender}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Age</span>
                <span className="font-semibold">{submittedData.age}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">DOB</span>
                <span className="font-semibold">{submittedData.dob}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">State</span>
                <span className="font-semibold">{submittedData.state}</span>
              </div>
              <div className="pt-2">
                <span className="text-gray-400 block mb-2">Skills</span>
                <div className="flex flex-wrap gap-2">
                  {submittedData.skills.length > 0 ? (
                    submittedData.skills.map((skill) => (
                      <span key={skill} className="bg-amber-400/20 text-amber-400 text-xs px-3 py-1 rounded-full border border-amber-400/30">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignment3;
