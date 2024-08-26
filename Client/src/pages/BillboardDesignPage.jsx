import React, { useState } from "react";
import axios from "axios";
import TailwindCard from "../components/advertisment/TailwindCard";
import PayPalButton from "../components/advertisment/PayPalButton";
import AdForm from "../components/advertisment/AdForm";

const BillboardDesignPage = () => {
  const [candidateDetails, setCandidateDetails] = useState({
    name: "",
    slogan: "",
    district: "",
    photoURL: "",
  });

  const [customization, setCustomization] = useState({
    fontColor: "#134B70",
    cardColor: "#EEEEEE",
    borderColor: "#508C9B",
    backgroundImage: "",
  });

  const [isShowPaymentBtn, setIsShowPaymentBtn] = useState(false);
  const [isShowPaypal, setIsShowPaypal] = useState(false);

  const onSubmit = async () => {
    try {
      const designData = {
        national_id: "409757581080",
        content: JSON.stringify({
          candidateDetails,
          customization,
        }),
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        payment_amount: 100, // Calculate based on your business logic
      };

      const response = await axios.post(
        "http://localhost:4000/api/advertisements",
        designData
      );
      console.log("Design saved:", response.data);
      alert("تم حفظ التصميم بنجاح!");
      setIsShowPaymentBtn(true);
    } catch (error) {
      console.error("Error saving design:", error);
      alert("حدث خطأ أثناء حفظ التصميم. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className=" flex  flex-col md:flex-row bg-gray-100 p-8 space-y-8 md:space-y-0 md:space-x-8">
      <AdForm
        onSubmit={onSubmit}
        setCustomization={setCustomization}
        setCandidateDetails={setCandidateDetails}
        candidateDetails={candidateDetails}
        customization={customization}
        isShowPaymentBtn={isShowPaymentBtn}
        setIsShowPaypal={setIsShowPaypal}
      />

      <div className="flex-1 flex flex-col">
        <div>
          <h2 className="text-2xl flex justify-center  font-bold text-[#134B70] mb-6">
            معاينة لوحتك الانتخابية
          </h2>
          <TailwindCard
            candidateDetails={candidateDetails}
            customization={customization}
          />
        </div>
        {isShowPaypal && (
          <div className="mt-24">
            <PayPalButton amount="10.00" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BillboardDesignPage;
