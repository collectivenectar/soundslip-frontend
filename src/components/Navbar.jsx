import React from 'react';
import { Link } from 'react-router-dom';

import { dark } from '@clerk/themes';
import { SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  let userName = !isLoaded || !isSignedIn ? null : user.username;

  return (
    <header>
      <div className={styles.navbar}>
        <SignedIn>
          <nav>
            <Link to='/library'>LIBRARY</Link>
            <ul>
              <li>
                <Link to='/upload'>UPLOAD ++</Link>
              </li>
              <li>
                <Link to='/'>{userName}</Link>
              </li>
              <UserButton />
            </ul>
          </nav>
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
