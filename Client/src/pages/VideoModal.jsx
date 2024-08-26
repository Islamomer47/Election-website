import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

const VideoModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Define Joyride steps in Arabic
  const steps = [
    {
      target: ".video-button",
      content: "اضغط على هذا الزر لفتح نافذة الفيديو.",
    },
  ];

  useEffect(() => {
    // Start the tour after 1 second
    const timer = setTimeout(() => {
      setRunTour(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="fixed bottom-48 right-12 z-50 cursor-pointer video-button">
        <button
          onClick={openModal}
          className="w-[80px] h-[80px] p-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full shadow-lg hover:from-green-700 hover:to-green-500 transition duration-300 flex items-center justify-center overflow-hidden"
        >
          <video
            src="./src/assets/img/vedu.mp4"
            type="video/mp4"
            className="w-full h-full object-cover rounded-full"
            autoPlay
            muted
            loop
          />
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-11/12 md:w-2/3 lg:w-[50rem] animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-1 right-1 text-gray-700 hover:text-gray-900 text-2xl modal-close-button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <video controls className="rounded w-full modal-video">
              <source src="./src/assets/img/vedu.mp4" type="video/mp4" />
              متصفحك لا يدعم علامة الفيديو.
            </video>
          </div>
        </div>
      )}

      {/* Joyride component */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        scrollToFirstStep
        showSkipButton
        showProgress
        locale={{
          back: "رجوع",
          close: "إغلاق",
          last: "إنهاء",
          next: "التالي",
          skip: "تخطي",
        }}
        styles={{
          options: {},
          buttonBack: {
            color: "#00000",
          },
          buttonClose: {
            color: "#00000",
          },
          buttonLast: {
            color: "#00000",
          },
          buttonNext: {
            color: "#00000",
          },
          buttonSkip: {
            color: "#00000",
          },
        }}
      />
    </div>
  );
};

export default VideoModal;
