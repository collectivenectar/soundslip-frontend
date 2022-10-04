import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import MainPlayer from './MainPlayer'
import axios from 'axios'

// Pages & Components
import Navbar from './components/Navbar';
import Library from './components/pages/Library';
import Profile from './components/pages/Profile';
import Upload from './components/pages/Upload';

const frontendApi = import.meta.env.VITE_REACT_APP_CLERK_FRONTEND_API;

export const AudioContext = createContext(null)

const baseUrl = "https://soundslip-server.herokuapp.com/soundslips/"

function App() {
    const location = useLocation()
  const navigate = useNavigate()
  const locationRef = useRef(location)

  const [playersObj, setPlayersObj] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSoundPlaying, setCurrentSoundPlaying] = useState(null)
  const [userId, setUserId] = useState(null)
  const playerRef = useRef(new Audio(null))

  function requestUrl(soundslipId){
    let params = {
      id: userId,
      headers: {
        'Content-Type': 'audio/mpeg'
      },
    }
    axios.get(baseUrl + soundslipId, {params})
      .then(response => {
        addNewUrl(response.data, soundslipId)
      })
      .catch(err => {
        console.log(err)
      })
    }

    function addNewUrl(newUrl, soundslipId){
      setPlayersObj(oldObj => {
        if(oldObj === false){
          return {
            [soundslipId]: {
              url: newUrl
            }
          }
        }else{
          return {
            ...oldObj,
            [soundslipId]: {
              url: newUrl
            }
          }
        }
      })
      if(!isPlaying){
        setIsPlaying(oldState => true)
      }
    }

    function switchUrls(){
      playerRef.current.url = playersObj[currentSoundPlaying].url
      setIsPlaying(oldState => true)
    }

    useEffect(() => {
      if(!playersObj){
        if(currentSoundPlaying !== null){
          requestUrl(currentSoundPlaying)
        }
      }else{
        if(!playersObj[currentSoundPlaying]){
          requestUrl(currentSoundPlaying)
        }else{
          if(playerRef.current.url !== playersObj[currentSoundPlaying]){
            switchUrls()
          }
        }
      }
    }, [currentSoundPlaying, playersObj, playerRef.current])

    useEffect(() => {
      if(isPlaying){
        // playerRef.current.autoplay = true
        if(playersObj){
          playerRef.current.src = playersObj[currentSoundPlaying].url
          playerRef.current.load()
          playerRef.current.play()
        }
      }else{
        if(!playersObj){

        }else{
          playerRef.current.pause()
        }
      }
    }, [isPlaying, playersObj, playerRef.current])

    useEffect(() => {
      if(locationRef.current.pathname !== location.pathname){
        if(playerRef.current.src !== null){
          setIsPlaying(playState => false)
          playerRef.current.value = ""
        }else{
        }
      }else if(locationRef.current.pathname === location.pathname){
        setIsPlaying(playState => false)
      }
    }, [location, locationRef.current, playerRef.current])

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
