import React, { useEffect } from 'react'
import ManageSoundslips from '../partials/profile/ManageSoundslips'

import {SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

const Home = () => {
  useEffect(() => {
    console.log("Profile component mounted")
  }, [])
  useEffect(() => {
    return () => {
      console.log("Profile component unmounted")
    }
  }, [])
  return (
    <div className="home">
      <SignedIn>
        <ManageSoundslips />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn/>
      </SignedOut>
    </div>
  )
}


export default Home

