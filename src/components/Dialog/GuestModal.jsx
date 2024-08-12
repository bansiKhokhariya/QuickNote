import React from 'react';

const GuestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Guest Modal</h2>
        <p className="mb-4">Note published successfully! Here is your modal content.</p>
        <button
          className="py-2 px-4 bg-red-500 text-white rounded border"
          onClick={onClose}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default GuestModal;
