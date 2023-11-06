import React from 'react';

import ManageSoundslips from '../partials/profile/ManageSoundslips';

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import styles from './Profile.module.scss';

const Home = () => {
  return (
    <div className={styles.home}>
      <SignedIn>
        <ManageSoundslips />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
};

export default Home;
