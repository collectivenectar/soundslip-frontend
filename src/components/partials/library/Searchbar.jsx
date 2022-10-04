import {Link} from 'react-router-dom'
import {useState} from 'react'

const Searchbar = () => {
  const [query, setQuery] = useState("")
  function updateQuery(value) {
    setQuery(newValue => value)
  }

  return (
    <div className="searchbar-container">
      <section>
      <form className="search-form">
        <label></label>
        <input className="search-input" type="text" value={query} onChange={(e) => updateQuery(e.target.value)}></input>
        <button className="search-button" type="submit">Search</button>
      </form>
      </section>
    </div>
  )
}

export default Searchbar

