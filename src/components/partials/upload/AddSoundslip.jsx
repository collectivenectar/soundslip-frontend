import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { isLoaded, isSignedIn, useUser } from '@clerk/clerk-react';
import styles from './AddSoundslip.module.scss';

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

const AddSoundslip = () => {
  const navigate = useNavigate();

  const { isLoaded, isSignedIn, user } = useUser();
  const userInfo =
    !isLoaded || !isSignedIn
      ? null
      : { userId: user.id, userName: user.username };

  const [tag, setTag] = useState('');
  const tagsGrid = useRef(null);

  const [soundslipForm, setSoundslipForm] = useState({
    file: '',
    title: '',
    body: '',
    tag: tag,
    public: false,
    userId: userInfo.userId,
    userName: userInfo.userName,
  });

  const toastUpload = () => toast('uploading...');
  const toastFailedUpload = () =>
    toast('There was a problem uploading your sample, please try again');
  const toastTemplate = (msg) => toast(msg);

  function toggleTag(e) {
    setTag((oldState) => e.target.parentElement.name);
    setSoundslipForm((oldForm) => {
      return {
        ...oldForm,
        tag: e.target.parentElement.name,
      };
    });
  }

  function updateForm(e) {
    if (e.target.name === 'public') {
      setSoundslipForm((prevForm) => {
        return {
          ...prevForm,
          public: !prevForm.public,
        };
      });
    } else if (e.target.name === 'upload') {
      setSoundslipForm((prevForm) => {
        return {
          ...prevForm,
          file: e.target.files[0],
        };
      });
    } else {
      setSoundslipForm((prevForm) => {
        let inputValidation = '';
        if (e.target.name === 'title') {
          if (e.target.value.length <= 50) {
            inputValidation = e.target.value;
          } else {
            inputValidation = prevForm.title.slice(0, prevForm.title.length);
            toastTemplate('character limit reached for description title: 50');
          }
        } else {
          if (e.target.value.length <= 100) {
            inputValidation = e.target.value;
          } else {
            inputValidation = prevForm.body.slice(0, prevForm.body.length);
            toastTemplate('character limit reached for description body: 100');
          }
        }
        return {
          ...prevForm,
          [e.target.name]: inputValidation,
        };
      });
    }
  }

  function inputCheck() {
    let keys = Object.keys(soundslipForm);
    for (let key = 0; key < keys.length - 2; key++) {
      if (soundslipForm[keys[key]] === '') {
        return false;
      }
    }
    return true;
  }

  function handleSubmit(e) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    e.preventDefault();
    if (inputCheck()) {
      toastUpload();
      axios
        .post(baseUrl + '/soundslips/', soundslipForm, config)
        .then(function (response) {
          if (response.status === 200) {
            navigate('/');
          } else {
            toastFailedUpload();
          }
        })
        .catch((err) => {
          toastTemplate(
            'Whoa there, this is just a sample, right? For the moment, the limit is 2MB until IPFS is integrated'
          );
        });
    } else {
      toastTemplate('form incomplete, please finish filling it out');
    }
  }

  return (
    <form
      className={styles.createNew}
      encType='multipart/form-data'
    >
      <label
        className={styles.fileUploadText}
        htmlFor='upload'
      >
        Choose a file to upload
      </label>
      <input
        className={styles.fileUpload}
        type='file'
        name='upload'
        onChange={(e) => updateForm(e)}
      ></input>
      <label
        className={styles.titleLabel}
        htmlFor='title'
      >
        Sample Title:
      </label>
      <input
        className={styles.uploadText}
        type='text'
        name='title'
        value={soundslipForm.title}
        onChange={(e) => updateForm(e)}
      ></input>
      <label
        className={styles.bodyLabel}
        htmlFor='textarea'
      >
        description
      </label>
      <textarea
        className={styles.uploadText}
        type='textarea'
        name='body'
        value={soundslipForm.body}
        onChange={(e) => updateForm(e)}
      ></textarea>
      <div className={styles.publicLabel}>
        <label>
          public
          <input
            type='checkbox'
            name='public'
            value={soundslipForm.public}
            onChange={(e) => updateForm(e)}
          ></input>
        </label>
        <section>
          <h2
            href=''
            className={styles.filtersTitle}
          >
            Select your sample type:
          </h2>
          <div
            className={styles.uploadTagsGrid}
            ref={tagsGrid}
          >
            <label className={styles.filterResults}>
              drums
              <a
                className={styles.filterIcons}
                name='drums'
              >
                <i
                  className='fa-solid fa-drum'
                  onClick={toggleTag}
                  style={{
                    backgroundColor: `${
                      tag === 'drums' ? '#918f78' : '#22252d'
                    }`,
                  }}
                ></i>
              </a>
            </label>
            <label className={styles.filterResults}>
              synth
              <a
                className={styles.filterIcons}
                name='synth'
              >
                <i
                  className='fa-solid fa-wave-square'
                  onClick={toggleTag}
                  style={{
                    backgroundColor: `${
                      tag === 'synth' ? '#918f78' : '#22252d'
                    }`,
                  }}
                ></i>
              </a>
            </label>
            <label className={styles.filterResults}>
              bass
              <a
                className={styles.filterIcons}
                name='bass'
              >
                <i
                  className='fa-solid fa-house-crack'
                  onClick={toggleTag}
                  style={{
                    backgroundColor: `${
                      tag === 'bass' ? '#918f78' : '#22252d'
                    }`,
                  }}
                ></i>
              </a>
            </label>
            <label className={styles.filterResults}>
              lead
              <a
                className={styles.filterIcons}
                name='lead'
              >
                <i
                  className='fa-solid fa-music'
                  onClick={toggleTag}
                  style={{
                    backgroundColor: `${
                      tag === 'lead' ? '#918f78' : '#22252d'
                    }`,
                  }}
                ></i>
              </a>
            </label>
            <label className={styles.filterResults}>
              voice
              <a
                className={styles.filterIcons}
                name='voice'
              >
                <i
                  className='fa-solid fa-microphone-lines'
                  onClick={toggleTag}
                  style={{
                    backgroundColor: `${
                      tag === 'voice' ? '#918f78' : '#22252d'
                    }`,
                  }}
                ></i>
              </a>
            </label>
            <label className={styles.filterResults}>
              loop
              <a
                className='filterIcons'
                name='loop'
              >
                <i
                  className='fa-solid fa-record-vinyl'
                  onClick={toggleTag}
                  style={{
                    backgroundColor: `${
                      tag === 'loop' ? '#918f78' : '#22252d'
                    }`,
                  }}
                ></i>
              </a>
            </label>
            <label className={styles.filterResults}>
              other
              <a
                className={styles.filterIcons}
                name='other'
              >
                <i
                  className='fa-solid fa-blender'
                  onClick={toggleTag}
                  style={{
                    backgroundColor: `${
                      tag === 'other' ? '#918f78' : '#22252d'
                    }`,
                  }}
                ></i>
              </a>
            </label>
          </div>
        </section>
      </div>
      <button
        className={styles.uploadButton}
        onClick={handleSubmit}
      >
        upload
      </button>
    </form>
  );
};
export default AddSoundslip;
