import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, UserButton, useUser, RedirectToSignIn } from '@clerk/clerk-react';

// Pages & Components
import Navbar from './components/Navbar';
import Library from './components/pages/Library';
import Profile from './components/pages/Profile';
import Upload from './components/pages/Upload';

const frontendApi = import.meta.env.VITE_REACT_APP_CLERK_FRONTEND_API;

function App() {
  const navigate = useNavigate();
  return (
      <ClerkProvider
        frontendApi={frontendApi}
        navigate={(to) => navigate(to)}
      >
          <div className="App">
              <Navbar/>
              <div className="pages">
                  <Routes>
                      <Route path="/library" element={< Library />}>
                      </Route>
                      <Route path="/" element={< Profile />}>
                      </Route>
                      <Route path="/upload" element={<Upload />}>
                      </Route>
                  </Routes>
              </div>
          </div>
      </ClerkProvider>
  )
}

export default App
