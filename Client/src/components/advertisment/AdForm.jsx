import React, { useState } from "react";

const AdForm = ({
  onSubmit,
  setCandidateDetails,
  setCustomization,
  candidateDetails,
  customization,
  isShowPaymentBtn,
  setIsShowPaypal
  
}) => {
  const handleCandidateDetailsChange = (e) => {
    const { name, value } = e.target;
    setCandidateDetails({ ...candidateDetails, [name]: value });
  };

  const handleCustomizationChange = (type, value) => {
    setCustomization({ ...customization, [type]: value });
  };

  const handleSave = () => {
    onSubmit();
  };

  return (
    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#134B70] mb-6 text-right">
        صمم لوحتك الانتخابية
      </h2>

      <div className="space-y-6">
        {/* Candidate Details */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            اسم المرشح
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={candidateDetails.name}
            onChange={handleCandidateDetailsChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#134B70] focus:border-[#134B70] sm:text-sm"
            dir="rtl"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="slogan"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            الشعار الانتخابي
          </label>
          <input
            type="text"
            id="slogan"
            name="slogan"
            value={candidateDetails.slogan}
            onChange={handleCandidateDetailsChange}
            className="mt-1 block w-full  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#134B70] focus:border-[#134B70] sm:text-sm"
            dir="rtl"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            الدائرة الانتخابية
          </label>
          <input
            type="text"
            id="district"
            name="district"
            value={candidateDetails.district}
            onChange={handleCandidateDetailsChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#134B70] focus:border-[#134B70] sm:text-sm"
            dir="rtl"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="photoURL"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            رابط الصورة الشخصية
          </label>
          <input
            type="text"
            id="photoURL"
            name="photoURL"
            value={candidateDetails.photoURL}
            onChange={handleCandidateDetailsChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#134B70] focus:border-[#134B70] sm:text-sm"
            dir="rtl"
          />
        </div>

        {/* Customization Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              لون الخط
            </label>
            <input
              type="color"
              value={customization.fontColor}
              onChange={(e) =>
                handleCustomizationChange("fontColor", e.target.value)
              }
              className="mt-1 w-full h-10 cursor-pointer"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              لون البطاقة
            </label>
            <input
              type="color"
              value={customization.cardColor}
              onChange={(e) =>
                handleCustomizationChange("cardColor", e.target.value)
              }
              className="mt-1 w-full h-10 cursor-pointer"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              لون الإطار
            </label>
            <input
              type="color"
              value={customization.borderColor}
              onChange={(e) =>
                handleCustomizationChange("borderColor", e.target.value)
              }
              className="mt-1 w-full h-10 cursor-pointer"
            />
          </div>
        </div>

        {/* Background Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            اختر الخلفية
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() =>
                handleCustomizationChange("backgroundImage", "/jordan-flag.jpg")
              }
              className="h-24 w-full bg-cover bg-center rounded-lg"
              style={{ backgroundImage: "url('/jordan-flag.jpg')" }}
            />
            <button
              onClick={() =>
                handleCustomizationChange("backgroundImage", "/amman-city.jpg")
              }
              className="h-24 w-full bg-cover bg-center rounded-lg"
              style={{ backgroundImage: "url('/amman-city.jpg')" }}
            />
            <button
              onClick={() =>
                handleCustomizationChange("backgroundImage", "/petra.jpg")
              }
              className="h-24 w-full bg-cover bg-center rounded-lg"
              style={{ backgroundImage: "url('/petra.jpg')" }}
            />
            <button
              onClick={() =>
                handleCustomizationChange("backgroundImage", "/wadi-rum.jpg")
              }
              className="h-24 w-full bg-cover bg-center rounded-lg"
              style={{ backgroundImage: "url('/wadi-rum.jpg')" }}
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mt-6 w-full bg-[#134B70] text-white font-bold py-2 px-4 rounded hover:bg-[#0D3A59] transition duration-300"
        >
          حفظ التصميم
        </button>
        {isShowPaymentBtn && (
          <button
            onClick={() => setIsShowPaypal(true)}
            className="mt-6 w-full bg-[#134B70] text-white font-bold py-2 px-4 rounded hover:bg-[#0D3A59] transition duration-300"
          >
            اكمال الدفع
          </button>
        )}
      </div>
    </div>
  );
};

export default AdForm;
