import React from 'react';

import AddSoundslip from '../partials/upload/AddSoundslip';

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import styles from './Upload.module.scss';
const Upload = () => {
  return (
    <div className={styles.upload}>
      <SignedIn>
        <div className={styles.uploadContainer}>
          <h2>Upload a new sample</h2>
          <AddSoundslip />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
};

export default Upload;
