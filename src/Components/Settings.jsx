import React from 'react';
import { useSelector } from 'react-redux';

const Settings = () => {
  const user = useSelector((state) => state.auth.user || {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">⚙️ Settings</h1>
      <div className="mt-4 p-4 bg-base-200 rounded-lg shadow">
        <h2 className="text-xl font-semibold">User Information</h2>
        <p><strong>Username:</strong> {user.username || 'Guest'}</p>
        <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
        <p><strong>Role:</strong> {user.role || 'User'}</p>
      </div>
    </div>
  );
};

export default Settings;
