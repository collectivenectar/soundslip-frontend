import React from 'react'
import AddSoundslip from '../partials/upload/AddSoundslip'

import {SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

const Upload = () => {
  return(
    <div className="upload">
    <SignedIn>
      <div className="upload-container">
        <h2>Upload a new sample</h2>
        < AddSoundslip />
      </div>
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
    </div>
  )
}

export default Upload