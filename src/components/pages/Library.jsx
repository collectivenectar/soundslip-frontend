import React, { useState, useEffect, createContext } from 'react'

import Results from '../partials/library/Results'
import Searchbar from '../partials/library/Searchbar'

import { toast } from 'react-toastify'
import { ClerkProvider, SignedIn, SignedOut, useUser, RedirectToSignIn } from '@clerk/clerk-react'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL

export const EditContext = createContext(null)

const Library = () => {
  const [ soundslips, setSoundslips ] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
  const [ displayLoading, setDisplayLoading ] = useState( true )

  const toastTemplate = (msg) => toast(msg)
  const userId = !isLoaded || !isSignedIn ? null: user.id;

  useEffect(() => {
    axios.get(baseUrl + '/soundslips/')
      .then(function(response) {
        setSoundslips(response.data)
        setDisplayLoading(false)
      })
      .catch(err =>{
        toastTemplate("public results not working...")
      })
    return (
      setDisplayLoading(true)
    )
  }, [])

  return (
    <div className="library">
      <SignedIn>
        <EditContext.Provider value={{ soundslips, setSoundslips, userId }}>
          <Searchbar/>
            { !soundslips.length && !displayLoading && (<a className="bad-search-response" >No results for that search</a>) }
            {displayLoading ? <div className="loading-sample-cell">fetching results...</div>: null  }
            { soundslips.length && <div className="lib-slip-container">
              { soundslips.map(soundslip => {
                return (
                    <Results key={soundslip._id} soundslip={soundslip}/>
                )
                }) 
              }
            </div>
            }
        </EditContext.Provider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn/>
      </SignedOut>
    </div>
  )
}
export default Library
