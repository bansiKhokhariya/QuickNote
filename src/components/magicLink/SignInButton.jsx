"use client";
import React, { useState, useContext, useEffect } from 'react';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button'

const SignInButton = ({ redirectUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [theme, setTheme] = useState("system"); // Default theme

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleLoginWithEmail = async () => {
    try {
      setLoading(true);
      setDisabled(true);

      // Use Magic SDK to log in with a magic link
      await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL(redirectUrl, window.location.origin).href,
      });

      // Get user information after login
      const userMetadata = await magic.user.getInfo();
      setUser(userMetadata);

      // Save user data to your backend
      await fetch('/api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userMetadata.email,
        }),
      });

      setLoading(false);
    } catch (error) {
      setDisabled(false);
      setLoading(false);
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <Button onClick={handleOpenModal}>Sign In</Button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded shadow-lg w-96 border ${theme === "light" ? "bg-white" : "bg-black text-white"
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
              onClick={handleLoginWithEmail}
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
