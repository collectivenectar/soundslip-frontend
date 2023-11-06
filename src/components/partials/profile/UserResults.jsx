import React, { useContext, useRef, useState } from 'react';

import { EditContext } from './ManageSoundslips';
import Edit from './Edit';
import Player from '../../Player';

import { toast } from 'react-toastify';
import axios from 'axios';

import styles from './UserResults.module.scss';

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + '/soundslips/';

const UserResults = ({ soundslip }) => {
  const { isEditing, setIsEditing, setFormSubmit, userId } =
    useContext(EditContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const download = useRef(null);

  const toastTemplate = (msg) => toast(msg);

  const parsedTitle =
    soundslip.title.slice(
      0,
      soundslip.title.length >= 35 ? 35 : soundslip.title.length
    ) + (soundslip.title.length > 35 ? '...' : '');
  const parsedDate =
    'created on ' +
    soundslip.createdAt.split('T')[0] +
    ' at ' +
    soundslip.createdAt.split('T')[1].split('.')[0];

  const tagIcons = {
    drums: 'fa-solid fa-drum',
    synth: 'fa-solid fa-wave-square',
    bass: 'fa-solid fa-house-crack',
    lead: 'fa-solid fa-music',
    voice: 'fa-solid fa-microphone-lines',
    loop: 'fa-solid fa-record-vinyl',
    other: 'fa-solid fa-blender',
  };

  function editSoundslip(e) {
    if (e.target.localName === 'i') {
      return false;
    }
    for (let each = 0; each < Object.keys(isEditing).length; each++) {
      let visible = Object.keys(isEditing)[each];
      if (soundslip._id === visible) {
        setIsEditing((oldState) => ({
          ...oldState,
          [visible]: !oldState[visible],
        }));
      } else if (soundslip._id !== visible && isEditing[visible]) {
        setIsEditing((oldState) => ({
          ...oldState,
          [visible]: false,
        }));
      }
    }
  }

  function toggleConfirmDialog() {
    setIsDeleting((oldState) => !oldState);
  }

  const confirmDelete = (
    <div className='deleteDialogCont'>
      {soundslip.title}
      <h2 className='deleteDialogLbl'>
        Are you sure you want to delete this sound?
      </h2>
      <div className='deleteDialogButtons'>
        <button
          className='deleteDialogButton'
          onClick={deleteSoundslip}
        >
          Yes
        </button>
        <button
          className='deleteDialogButton'
          onClick={toggleConfirmDialog}
        >
          No
        </button>
      </div>
    </div>
  );

  function deleteSoundslip() {
    axios
      .delete(baseUrl + `${soundslip._id}`, { data: { userId: userId } })
      .then((response) => {
        if (response.statusText === 'OK') {
          setFormSubmit((submitted) => submitted + 1);
        } else {
          console.log(response);
        }
      })
      .catch((err) => {
        toastTemplate(
          'there was an error deleting your sample, please try again'
        );
        console.log(err);
      });
  }

  function downloadSound() {
    let soundslipId = soundslip._id;
    let fullUrl = baseUrl + 'download/' + soundslipId;
    axios({
      method: 'get',
      url: fullUrl,
      data: { userId: userId },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        download.current.href = response.data;
        download.current.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className={styles.soundslipContainerUser}>
      {isDeleting && confirmDelete}
      <section className={styles.slipPanel}>
        <div className={styles.userPlayerSection}>
          <Player soundslip={soundslip} />
          <a ref={download}></a>
          <a
            className={styles.userDownload}
            onClick={() => downloadSound()}
          >
            <i className='fa-solid fa-floppy-disk'></i>
          </a>
        </div>
        <div
          className={styles.userSlipDetails}
          onClick={editSoundslip}
        >
          <div className={styles.soundslipTopline}>
            <h2 className={styles.soundslipTitle}>
              {soundslip && parsedTitle}
            </h2>
            <div className={styles.soundslipActions}>
              <a
                className={styles.soundslipDelete}
                onClick={toggleConfirmDialog}
              >
                <i className='fa-solid fa-delete-left'></i>
              </a>
            </div>
          </div>
          <h3 className={styles.soundslipDesc}>
            {soundslip && soundslip.body}
          </h3>
          <div className={styles.userSlipLastLine}>
            <h3 className={styles.soundslipDate}>{soundslip && parsedDate}</h3>
            <div className={styles.userSlipTagGroup}>
              <i className={tagIcons[soundslip.tag]}></i>
              <h4>{soundslip.tag}</h4>
            </div>
          </div>
        </div>
      </section>
      <section>
        {isEditing[soundslip._id] && (
          <Edit
            key={soundslip._id}
            soundslip={soundslip}
          />
        )}
      </section>
    </div>
  );
};

export default UserResults;
