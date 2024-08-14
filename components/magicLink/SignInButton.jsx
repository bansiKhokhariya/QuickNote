"use client";
import React, { useState, useContext, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { signIn } from "next-auth/react";

const SignInButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [theme, setTheme] = useState("light");

  const handleOpenModal = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setDisabled(true);
      await signIn('email', { email, callbackUrl: '/edit/83BC36' });
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      console.error('Error signing in', error);
    }
  };

  return (
    <div>
      <Button variant="outline" size="icon">
        <User className="h-[1.2rem] w-[1.2rem]" />
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded shadow-xl w-96 border ${theme == "light" ? "bg-white" : "bg-black"
              }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sign In</h2>
              <X
                onClick={handleCloseModal}
                color="red"
                className="cursor-pointer"
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              required
            />
            <button
              className="py-2 px-4 bg-black text-white rounded border"
              onClick={handleSignIn}
              disabled={disabled}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
