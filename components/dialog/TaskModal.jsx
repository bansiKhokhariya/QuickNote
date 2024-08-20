
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskModal({ theme, isOpen, onClose, onSubmit }) {
  const [topicName, setTopicName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [strategy, setStrategy] = useState('none');
  const [pixelOption, setPixelOption] = useState('A1');
  const [feedProvider, setFeedProvider] = useState('ADS');
  const [customField, setCustomField] = useState('MB5');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const titleParts = [topicName];

    // Conditionally add parts based on their values
    if (strategy !== 'none') {
      titleParts.push(strategy);
    }
    titleParts.push(pixelOption);
    titleParts.push(feedProvider);
    titleParts.push(customField);
    // Combine the parts into a single string separated by ' - '
    const title = titleParts.join(' - ');
    onSubmit({ topicName: title, keywords });
    onClose();
    // Clear fields
    setTopicName('');
    setKeywords('');
    setStrategy('none');
    setPixelOption('A1');
    setFeedProvider('ADS');
    setCustomField('MB5');
  };

  const handleClose = () => {
    setTopicName('');
    setKeywords('');
    setStrategy('none');
    setPixelOption('A1');
    setFeedProvider('ADS');
    setCustomField('MB5');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1B1D21] bg-opacity-50">
      <div className={`p-6 rounded shadow-xl w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-lg border ${theme === "light" ? "bg-white" : "bg-[#1B1D21]"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Generate Task</h2>
          <X size={24} color="red" className="cursor-pointer" onClick={handleClose} />
        </div>
        <input
          type="text"
          placeholder="Topic Name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <textarea
          placeholder="Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <div>
          <label className='text-gray-500'>strategy:</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full p-2 border rounded mb-4 mt-2"
          >
            <option value="ST1">ST1</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label className='text-gray-500'>Pixel:</label>
          <select
            value={pixelOption}
            onChange={(e) => setPixelOption(e.target.value)}
            className="w-full p-2 border rounded mb-4 mt-2"
          >
            {Array.from({ length: 10 }, (_, i) => `A${i + 1}`).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='text-gray-500'>Feed provide:</label>
          <select
            value={feedProvider}
            onChange={(e) => setFeedProvider(e.target.value)}
            className="w-full p-2 border rounded mb-4 mt-2"
          >
            <option value="ADS">ADS</option>
            <option value="Tonic">Tonic</option>
            <option value="Syestem1">Syestem1</option>
            <option value="Sedo">Sedo</option>
          </select>
        </div>
        <div>
          <label className='text-gray-500'>Custom Field:</label>
          <input
            type="text"
            placeholder="Custom Field"
            value={customField}
            onChange={(e) => setCustomField(e.target.value)}
            className="w-full p-2 border rounded mb-4 mt-2"
          />
        </div>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}
