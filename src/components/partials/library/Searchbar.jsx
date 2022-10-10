import {Link} from 'react-router-dom';
import { useState, useContext } from 'react';
import { EditContext } from '../../pages/Library';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + "/soundslips"

const Searchbar = () => {
  const { soundslips, setSoundslips, userId } = useContext(EditContext)
  const [query, setQuery] = useState("")
  // querytype is for expanded search capabilities, choose search by 
  // title, description, length, tag, username, MIME type?
  const [queryType, setQueryType] = useState("Title")

  function updateQuery(value) {
    setQuery(newValue => value)
  }
  function updateType(){
    if(queryType === "Title"){
      setQueryType(oldType => "Username")
    }else{
      setQueryType(oldType => "Title")
    }
  }
  function requestSearch(){
    let queries = {
      Username: "/user/",
      Title: "/",
      description: "/"
    }
    let params = {
      params: {
        queryType: queryType,
        query: query,
      }
    }
    if(queryType === "Username"){
      if(query.includes(" ")){
        console.log("Usernames do not have spaces")
      }else{
        axios.get(baseUrl + queries[queryType] + userId, params)
          .then((response) => {
            setSoundslips(response.data)
            console.log(response.data)
          })
          .catch(err => console.log(err))
      }
    }else{
      // Goes to /soundslips/
      if(query === ""){
        params.queryType = false
      }
      axios.get(baseUrl + queries[queryType], params)
        .then((response) => {
          setSoundslips(response.data)
          console.log(response.data)
        })
        .catch(err => console.log(err))
    }
  }
  return (
    <div className="searchbar-container">
      <section >
      <form className="search-form">
        <label>Search By:</label>
        <a className="search-type" onClick={updateType} >{queryType}</a>
        <input className="search-input" type="text" value={query} onChange={(e) => updateQuery(e.target.value)}></input>
        <a onClick={() => requestSearch()} className="search-button">Search</a>
      </form>
      </section>
      <section>
        <h2 href="">Filters:</h2>
        <div>
          <a className="filter-results"><i></i></a>
          <a className="filter-results"><i></i></a>
          <a className="filter-results"><i></i></a>
          <a className="filter-results"><i></i></a>
        </div>
      </section>
    </div>
  )
}

export default Searchbar

