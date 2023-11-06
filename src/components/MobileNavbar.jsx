import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import styles from './MobileNavbar.module.scss';

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  let userName = !isLoaded || !isSignedIn ? null : user.username;

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenuOpen = () => {
    setMenuIsOpen((oldState) => !oldState);
  };

  const mobileMenu = (
    <div className={styles.mobileFixedContainer}>
      <ul className={styles.mobileMenu}>
        <li>
          <Link
            className={styles.mobileUser}
            to='/'
          >
            Manage Samples
          </Link>
        </li>
        <li>
          <Link
            className={styles.mobileUpload}
            to='/upload'
          >
            upload new
          </Link>
        </li>
        <li>
          <Link
            className={styles.mobileLibrary}
            to='/library'
          >
            library
          </Link>
        </li>
      </ul>
    </div>
  );

  return (
    <header>
      <div className={styles.navbarMobile}>
        <SignedIn>
          <div
            className={styles.mobileMenuContainer}
            onClick={toggleMenuOpen}
            style={{ color: menuIsOpen && '#c6c5b6' }}
          >
            <i className='fa-solid fa-bars'></i>
            {menuIsOpen && mobileMenu}
          </div>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
