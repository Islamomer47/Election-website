import React, { useState } from "react";

// Utility function to format date for input fields
const formatDateForInput = (date) => {
  return date.toISOString().split("T")[0];
};

// Input component for reusability
const FormInput = ({ label, name, type, value, onChange, required }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Textarea component for content
const FormTextarea = ({ label, name, value, onChange, required }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows="4"
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    ></textarea>
  </div>
);

// Main AdvertisementForm component
const AdvertisementForm = () => {
  const [formData, setFormData] = useState({
    national_id: "",
    content: "",
    start_date: formatDateForInput(new Date()),
    end_date: formatDateForInput(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ), // Default to 7 days from now
    payment_amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    console.log("Submitting data:", formData);

    try {
      const response = await fetch("http://localhost:3000/api/advertisements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          payment_amount: parseFloat(formData.payment_amount),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Server response:", responseData);
        setSubmitMessage("Advertisement submitted successfully!");
        setFormData({
          national_id: "",
          content: "",
          start_date: formatDateForInput(new Date()),
          end_date: formatDateForInput(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          ),
          payment_amount: "",
        });
      } else {
        console.error("Server error response:", responseData);
        setSubmitMessage(
          `Failed to submit advertisement. Server says: ${responseData.error}`
        );
      }
    } catch (error) {
      console.error("Error submitting advertisement:", error);
      setSubmitMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Submit New Advertisement</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="National ID"
          name="national_id"
          type="text"
          value={formData.national_id}
          onChange={handleChange}
          required
        />
        <FormTextarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Start Date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <FormInput
          label="End Date"
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Payment Amount"
          name="payment_amount"
          type="number"
          value={formData.payment_amount}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Advertisement"}
        </button>
      </form>
      {submitMessage && (
        <div
          className={`mt-4 p-2 rounded ${
            submitMessage.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default AdvertisementForm;
