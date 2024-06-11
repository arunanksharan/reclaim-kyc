'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { KYCFormData } from '@/interfaces/kyc';

// components/KYCForm.tsx

const KYCForm: React.FC = () => {
  // State to hold form data with initial types defined
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: '',
    address: '',
    dob: '',
    idNumber: '',
  });

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Here you might handle the submission to your backend API
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex flex-row items-center justify-center">
        <label htmlFor="fullName"></label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="border-2 border-gray-300"
        />
      </div>
      <div className="flex flex-row items-center justify-center">
        <label htmlFor="address"></label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Address"
        />
      </div>
      <div className="flex flex-row items-center justify-center">
        <label htmlFor="dob">DoB</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-row items-center justify-center">
        <label htmlFor="idNumber"></label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          required
          placeholder="ID Number"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default KYCForm;
