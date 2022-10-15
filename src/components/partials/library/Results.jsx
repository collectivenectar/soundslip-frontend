import React, { useContext, useRef } from 'react'
import Player from '../../partials/library/Player'
import { EditContext } from '../../pages/Library'
import axios from 'axios'
import { toast } from 'react-toastify'

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + "/soundslips/"

const Results = ({soundslip}) => {
  const parsedDate = ("created on " + soundslip.createdAt.split("T")[0] + " at " 
    + soundslip.createdAt.split("T")[1].split(".")[0])

  const tagIcons = {
      "drums": "fa-solid fa-drum",
      "synth": "fa-solid fa-wave-square",
      "bass": "fa-solid fa-house-crack",
      "lead": "fa-solid fa-music",
      "voice": "fa-solid fa-microphone-lines",
      "loop": "fa-solid fa-record-vinyl",
      "other": "fa-solid fa-blender"
  }
  const toastTemplate = (msg) => toast(msg)

  const { userId } = useContext(EditContext)
  const download = useRef(null)
  function goToUsersPage(){
    console.log("redirecting to page at username")
    let userName = soundslip.userName
    let url = baseUrl + "/user/" + userName
  }
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
        toastTemplate("there seems to be something wrong with the audio file or fileURL")
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
        <div className="lib-slip-group">
          <h2 className="lib-slip-title">{soundslip && soundslip.title}</h2>
          <h2 className="lib-slip-belongs">uploaded by <a className="username-link" onClick={goToUsersPage}>{soundslip && soundslip.userName}</a></h2>
          <h3 className="lib-slip-desc">{soundslip && soundslip.body}</h3>
          <div className="lib-slip-last-line">
            <h3 className="lib-slip-date">{soundslip && parsedDate}</h3>
            <div className="lib-slip-tags">
              <i className={tagIcons[soundslip.tag]}></i>
              <h4>{soundslip.tag}</h4>
            </div>
          </div>
          <a ref={download}></a>
        </div>
      </div>
    </div>
  )
}

export default Results
