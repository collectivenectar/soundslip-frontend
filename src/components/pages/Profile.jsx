import React from 'react'

import ManageSoundslips from '../partials/profile/ManageSoundslips'

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

const Home = () => {
  
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

