import React, { useContext, useRef } from 'react'
import Player from '../../partials/library/Player'
import { EditContext } from '../../pages/Library'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + "/soundslips/"

const Results = ({soundslip}) => {
  const parsedDate = ("created on " + soundslip.createdAt.split("T")[0] + " at " 
    + soundslip.createdAt.split("T")[1].split(".")[0])
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
    <div className="lib-slip-cell">
      <div className="lib-slip-links-cont">
        < Player 
            soundslip={soundslip}
          />
        <a className="lib-download" onClick={() => downloadSound()}><i className="fa-solid fa-floppy-disk"></i></a>
      </div>
      <div className="lib-slip-cell-data">
        <div>
          <h2 className="lib-slip-title">{soundslip && soundslip.title}</h2>
          <h2 className="lib-slip-belongs">uploaded by {soundslip && soundslip.userName}</h2>
          <h3 className="lib-slip-desc">{soundslip && soundslip.body}</h3>
          <h3 className="lib-slip-date">{soundslip && parsedDate}</h3>
          <a ref={download}></a>
        </div>
      </div>
    </div>
  )
}

export default Results
