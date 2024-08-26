import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="mt-8 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
