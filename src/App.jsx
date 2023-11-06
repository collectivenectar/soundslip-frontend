import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// Pages & Components
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import Library from './components/pages/Library';
import Profile from './components/pages/Profile';
import Upload from './components/pages/Upload';
import MainPlayer from './MainPlayer';
import styles from '../src/App.module.scss';

// 3rd party stuff
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// vite environment variables
const frontendApi = import.meta.env.VITE_REACT_APP_CLERK_FRONTEND_API;
const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + '/soundslips/';

// React hooks for state provisioning
export const AudioContext = createContext(null);
export const LightModeContext = createContext(true);

function App() {
  console.log(frontendApi);
  const location = useLocation();
  const navigate = useNavigate();
  const locationRef = useRef(location);

  const [playersObj, setPlayersObj] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSoundPlaying, setCurrentSoundPlaying] = useState(null);
  const [userId, setUserId] = useState(null);
  const playerRef = useRef(new Audio(null));

  const [lightModeState, setLightModeState] = useState(true);

  const [matchesMobile, setMatchesMobile] = useState(
    window.matchMedia('(max-width: 990px)').matches
  );

  function requestUrl(soundslipId) {
    let params = {
      id: userId,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    };
    axios
      .get(baseUrl + soundslipId, { params })
      .then((response) => {
        addNewUrl(response.data, soundslipId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function addNewUrl(newUrl, soundslipId) {
    setPlayersObj((oldObj) => {
      if (oldObj === false) {
        return {
          [soundslipId]: { url: newUrl },
        };
      } else {
        return {
          ...oldObj,
          [soundslipId]: { url: newUrl },
        };
      }
    });
    if (!isPlaying) {
      setIsPlaying((oldState) => true);
    }
  }

  function switchUrls() {
    playerRef.current.url = playersObj[currentSoundPlaying].url;
    setIsPlaying((oldState) => true);
  }

  function playEnded() {
    setIsPlaying((oldState) => false);
  }

  useEffect(() => {
    window
      .matchMedia('(max-width: 990px)')
      .addEventListener('change', (e) => setMatchesMobile(e.matches));
  }, []);

  useEffect(() => {
    if (!playersObj) {
      if (currentSoundPlaying !== null) {
        requestUrl(currentSoundPlaying);
      }
    } else {
      if (!playersObj[currentSoundPlaying]) {
        requestUrl(currentSoundPlaying);
      } else {
        if (playerRef.current.url !== playersObj[currentSoundPlaying]) {
          switchUrls();
        }
      }
    }
  }, [currentSoundPlaying, playersObj, playerRef.current]);

  useEffect(() => {
    if (isPlaying) {
      // playerRef.current.autoplay = true
      if (playersObj) {
        playerRef.current.src = playersObj[currentSoundPlaying].url;
        playerRef.current.load();
        playerRef.current.play();
      }
    } else {
      if (!playersObj) {
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying, playersObj, playerRef.current]);

  useEffect(() => {
    if (locationRef.current.pathname !== location.pathname) {
      if (playerRef.current.src !== null) {
        setIsPlaying((playState) => false);
        playerRef.current.value = '';
      }
    } else if (locationRef.current.pathname === location.pathname) {
      setIsPlaying((playState) => false);
    }
  }, [location, locationRef.current, playerRef.current]);

  useEffect(() => {
    const player = playerRef.current;
    player.addEventListener('ended', playEnded, false);

    return () => {
      player.removeEventListener('ended', playEnded, false);
    };
  }, [playerRef.current]);

  return (
    <ClerkProvider
      frontendApi={frontendApi}
      navigate={(to) => navigate(to)}
      appearance={{
        baseTheme: dark,
      }}
    >
      <div className='App'>
        <LightModeContext.Provider
          value={{ lightModeState, setLightModeState }}
        >
          <AudioContext.Provider
            value={{
              currentSoundPlaying,
              setCurrentSoundPlaying,
              isPlaying,
              setIsPlaying,
              setUserId,
            }}
          >
            {!matchesMobile && <Navbar />}
            {matchesMobile && <MobileNavbar />}
            <MainPlayer />
            <ToastContainer />
            <div className='pages'>
              <Routes>
                <Route
                  path='/library'
                  element={<Library />}
                ></Route>
                <Route
                  path='/'
                  element={<Profile />}
                ></Route>
                <Route
                  path='/upload'
                  element={<Upload />}
                ></Route>
              </Routes>
            </div>
          </AudioContext.Provider>
        </LightModeContext.Provider>
      </div>
    </ClerkProvider>
  );
}

export default App;
