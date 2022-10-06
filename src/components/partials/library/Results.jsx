import React, { useContext, useRef } from 'react'
import Player from '../../partials/library/Player'
import { EditContext } from '../../pages/Library'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + "/soundslips/"

const Results = ({soundslip}) => {
  const { userId } = useContext(EditContext)
  const download = useRef(null)
  
  function downloadSound() {
    let soundslipId = soundslip._id
    let fullUrl = baseUrl + "download/" + soundslipId
    axios({
      method: 'get',
      url: fullUrl,
      data: {userId: userId},
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(response => {
        download.current.href = response.data
        download.current.click()
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <div className="soundslip-container">
      < Player 
            soundslip={soundslip}
          />
      <div className="pub-results">
        <div>
          <h2 className="soundslip-belongs">uploaded by {soundslip && soundslip.userName}</h2>
          <h2 className="soundslip-title">{soundslip && soundslip.title}</h2>
          <h3 className="soundslip-desc">{soundslip && soundslip.body}</h3>
          <h3 className="soundslip-date">{soundslip && soundslip.createdAt}</h3>
          <a ref={download}></a>
        </div>
        <a className="download" onClick={() => downloadSound()}><i className="fa-solid fa-floppy-disk"></i></a>
      </div>
    </div>
  )
}

export default Results
