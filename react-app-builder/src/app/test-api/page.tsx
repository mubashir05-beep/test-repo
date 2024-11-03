// react-app-builder/src/app/test-api/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestApi() {
  const [sessionData, setSessionData] = useState(null);
  const [providersData, setProvidersData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSession = async () => {
    try {
      const response = await axios.get('/api/auth/session');
      setSessionData(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get('/api/auth/providers');
      setProvidersData(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Test API Routes</h1>
      <button onClick={fetchSession}>Fetch Session</button>
      <button onClick={fetchProviders}>Fetch Providers</button>
      {error && <p>Error: {error}</p>}
      {sessionData && (
        <div>
          <h2>Session Data</h2>
          <pre>{JSON.stringify(sessionData, null, 2)}</pre>
        </div>
      )}
      {providersData && (
        <div>
          <h2>Providers Data</h2>
          <pre>{JSON.stringify(providersData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}