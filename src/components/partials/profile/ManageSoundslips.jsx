import React, { useState, useEffect, createContext } from 'react'

import UserResults from './UserResults'

import { isLoaded, isSignedIn, useUser } from '@clerk/clerk-react'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL

export const EditContext = createContext(null)

const ManageSoundslips = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const userId = !isLoaded || !isSignedIn ? null: user.id;

  const [ soundslips, setSoundslips  ] = useState(false)
  const [ isEditing, setIsEditing ] = useState({})
  const [ formSubmit, setFormSubmit ] = useState(0)
  const [ soundPlaying, setSoundPlaying ] = useState(0)
  const [ displayLoading, setDisplayLoading ] = useState(true)

  function setupEdit(soundslips) {
    let editStateArray = {}
    for(let each = 0; each < soundslips.length; each++){
      editStateArray[soundslips[each]._id] = false
    }
    setIsEditing(oldArray => editStateArray)
  }

  useEffect(() => {

    axios.post(baseUrl + '/profile/', {id: userId})
      .then(function(response) {
        setSoundslips(oldSlips => response.data)
        setDisplayLoading(false)
        setupEdit(response.data)
        let allSlipsState = {}
        for(let slip = 0; slip < response.data.length; slip++){
          allSlipsState[response.data[slip]._id] = false
        }
        setSoundPlaying(oldValue => allSlipsState)
      })
      .catch(err => console.log(err))
      return (
        setDisplayLoading(true)
      )
  }, [formSubmit])

  return (
    <div className="all-user-soundslips">
      <section className="public-soundslips">
        <h2>Public Uploads</h2>
        <EditContext.Provider value={{ isEditing, setIsEditing, setFormSubmit, soundPlaying, setSoundPlaying, userId }}>
          <div className="user-slip-cell-cont" >
            {!soundslips && !displayLoading && (<a className="bad-search-response" >You haven't uploaded any public samples yet.</a>)}
            {displayLoading && (<div className="loading-sample-cell">fetching public samples...</div>)}
            {soundslips && soundslips.map(soundslip => {
            if(soundslip.public){
              return (
                <UserResults
                  key={soundslip._id}
                  soundslip={soundslip}
                />
              )
            }
          })
          }
          </div>
        </ EditContext.Provider>
      </section>
      <section className="private-soundslips">
        <h2>Private Uploads</h2>
        <EditContext.Provider value={{ isEditing, setIsEditing, setFormSubmit, soundPlaying, setSoundPlaying, userId }}>
          <div className="user-slip-cell-cont">
            {!soundslips && !displayLoading && (<a className="bad-search-response" >You haven't uploaded any private samples yet.</a>)}
            {displayLoading && (<div className="loading-sample-cell">fetching private samples...</div>)}
            {soundslips && soundslips.map(soundslip => {
            if(!soundslip.public){
              return (
                <UserResults
                  key={soundslip._id}
                  soundslip={soundslip}
                />
              )
            }
          })
          }
          </div>
        </ EditContext.Provider>
      </section>
    </div>
  )
}

export default ManageSoundslips
