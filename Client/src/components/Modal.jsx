import React from "react";
import ReactDOM from "react-dom";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 modal-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
