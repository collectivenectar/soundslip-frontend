import React from 'react'
import Player from '../../partials/library/Player'

const Results = ({soundslip}) => {
  return (
    <div className="soundslip-container">
      < Player 
            soundslip={soundslip}
          />
      <div className="pub-results">
        <h2 className="soundslip-belongs">{soundslip && soundslip.userName}</h2>
        <h2 className="soundslip-title">{soundslip && soundslip.title}</h2>
        <h3 className="soundslip-desc">{soundslip && soundslip.body}</h3>
        <h3 className="soundslip-date">{soundslip && soundslip.createdAt}</h3>
        <button className="download">Download</button>
      </div>
    </div>
  )
}

export default Results
