import React, {useEffect, createContext} from 'react'
import { useLocation } from 'react-router-dom'
import Results from '../partials/library/Results'
import Searchbar from '../partials/library/Searchbar'

import axios from 'axios'
const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL

import { ClerkProvider, SignedIn, SignedOut, UserButton, useUser, RedirectToSignIn } from '@clerk/clerk-react'

export const EditContext = createContext(null)

const Library = () => {
  const [soundslips, setSoundslips] = React.useState(false)
  
  const { isLoaded, isSignedIn, user } = useUser()
  const userId = !isLoaded || !isSignedIn ? null: user.id;

  React.useEffect(() => {
    axios.get(baseUrl + '/soundslips/')
      .then(function(response) {
        setSoundslips(response.data)
      })
  }, [])
  return (
    <div className="library">
      <SignedIn>
      <EditContext.Provider value={{soundslips, setSoundslips, userId}}>
        <Searchbar/>
        <div className="lib-slip-container">
          {soundslips && soundslips.map(soundslip => {
            return (
              <Results key={soundslip._id} soundslip={soundslip}/>
            )
          })}
        </div>
        </EditContext.Provider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn/>
      </SignedOut>
    </div>
  )
}
export default Library
