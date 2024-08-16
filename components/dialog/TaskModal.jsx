// TaskModal.js
import React, { useState } from 'react';
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TaskModal({ theme, isOpen, onClose, onSubmit }) {
  const [topicName, setTopicName] = useState('');
  const [keywords, setKeywords] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ topicName, keywords });
    onClose();
    setTopicName('');
    setKeywords('');
  };

  const handleClose = () => {
    setTopicName('');
    setKeywords('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`p-6 rounded shadow-xl  border ${theme == "light" ? "bg-white" : "bg-black"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Generate Task</h2>
          <X size={24} color="red" className="cursor-pointer" onClick={handleClose} />
        </div>
        <input
          type="text"
          placeholder="Topic Name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          className="w-full p-2 border mb-4"
        />
        <textarea
          placeholder="Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full p-2 border mb-4"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}
