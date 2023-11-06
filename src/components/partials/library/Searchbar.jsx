import React, { useState, useContext, useRef } from 'react';

import { EditContext } from '../../pages/Library';

import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Searchbar.module.scss';

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + '/soundslips';

const Searchbar = () => {
  const { soundslips, setSoundslips, userId } = useContext(EditContext);

  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('Title');

  const [filters, setFilters] = useState({
    drums: false,
    synth: false,
    bass: false,
    lead: false,
    voice: false,
    loop: false,
    other: false,
  });
  const filtersGrid = useRef(null);

  const toastTemplate = (msg) => toast(msg);

  function updateQuery(value) {
    setQuery((newValue) => value);
  }
  function updateType() {
    if (queryType === 'Title') {
      setQueryType((oldType) => 'Username');
    } else {
      setQueryType((oldType) => 'Title');
    }
  }

  function toggleFilter(e) {
    if (!filters[e.target.parentElement.name]) {
      setFilters((oldState) => {
        return { ...oldState, [e.target.parentElement.name]: true };
      });
    } else {
      setFilters((oldState) => {
        return {
          ...oldState,
          [e.target.parentElement.name]: false,
        };
      });
    }
  }

  function requestSearch() {
    let queries = {
      Username: '/',
      Title: '/',
      description: '/',
    };
    let tags = [];
    let keys = Object.keys(filters);

    for (let each = 0; each < keys.length; each++) {
      if (filters[keys[each]] === true) {
        tags.push(`${keys[each]}`);
      }
    }

    let params = {
      params: {
        queryType: queryType,
        query: query,
        filters: tags.join(','),
      },
    };

    if (queryType === 'Username') {
      if (query.includes(' ')) {
        toastTemplate(
          'Usernames do not have spaces, please remove any spaces from your search and try again'
        );
      } else {
        axios
          .get(baseUrl + queries[queryType], params)
          .then((response) => {
            setSoundslips(response.data);
          })
          .catch((err) => console.log(err));
      }
    } else {
      if (query === '') {
        params.params.queryType = 'Title';
      }
      axios
        .get(baseUrl + queries[queryType], params)
        .then((response) => {
          setSoundslips(response.data);
        })
        .catch((err) => {
          console.log(err);
          toastTemplate('there was a problem submitting your search request');
        });
    }
  }

  return (
    <div className={styles.searchbarContainer}>
      <section>
        <form
          className={styles.searchForm}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label>Search By:</label>
          <div>
            <a
              className={styles.searchType}
              onClick={updateType}
            >
              {queryType}
            </a>
            <a
              className={styles.searchTypeToggled}
              onClick={updateType}
            >
              {queryType === 'Title' ? 'Username' : 'Title'}
            </a>
          </div>
          <input
            className={styles.searchInput}
            type='text'
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
          ></input>
          <a
            onClick={() => requestSearch()}
            className={styles.searchButton}
          >
            Search
          </a>
        </form>
      </section>
      <section>
        <h2
          href=''
          className={styles.filtersTitle}
        >
          Filters:
        </h2>
        <div
          className={styles.filtersGrid}
          ref={filtersGrid}
        >
          <label className={styles.filterResults}>
            drums
            <a
              className={styles.filterIcons}
              name='drums'
            >
              <i
                className='fa-solid fa-drum'
                onClick={toggleFilter}
                style={{
                  backgroundColor: `${
                    filters['drums'] ? '#918f78' : '#22252d'
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
                onClick={toggleFilter}
                style={{
                  backgroundColor: `${
                    filters['synth'] ? '#918f78' : '#22252d'
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
                onClick={toggleFilter}
                style={{
                  backgroundColor: `${filters['bass'] ? '#918f78' : '#22252d'}`,
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
                onClick={toggleFilter}
                style={{
                  backgroundColor: `${filters['lead'] ? '#918f78' : '#22252d'}`,
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
                onClick={toggleFilter}
                style={{
                  backgroundColor: `${
                    filters['voice'] ? '#918f78' : '#22252d'
                  }`,
                }}
              ></i>
            </a>
          </label>
          <label className={styles.filterResults}>
            loop
            <a
              className={styles.filterIcons}
              name='loop'
            >
              <i
                className='fa-solid fa-record-vinyl'
                onClick={toggleFilter}
                style={{
                  backgroundColor: `${filters['loop'] ? '#918f78' : '#22252d'}`,
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
                onClick={toggleFilter}
                style={{
                  backgroundColor: `${
                    filters['other'] ? '#918f78' : '#22252d'
                  }`,
                }}
              ></i>
            </a>
          </label>
        </div>
      </section>
    </div>
  );
};

export default Searchbar;
