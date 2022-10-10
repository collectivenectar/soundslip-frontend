import React, { useContext, useRef, useState } from 'react'
import { EditContext } from './ManageSoundslips'
import Edit from './Edit'
import Player from '../../Player'

import axios from 'axios'
const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + "/soundslips/"

const UserResults = ({soundslip}) => {
  const parsedTitle = (soundslip.title.slice(0, soundslip.title.length >= 35
        ? 35
        : soundslip.title.length) 
      + 
      (soundslip.title.length > 35
        ? "..."
        : "")
    )
  const parsedDate = ("created on " + soundslip.createdAt.split("T")[0] + " at " 
    + soundslip.createdAt.split("T")[1].split(".")[0])
  const download = useRef(null)
  const {isEditing, setIsEditing, setFormSubmit, userId} = useContext(EditContext)
  const [isDeleting, setIsDeleting] = useState(false)

  function editSoundslip() {
    for(let each = 0; each < Object.keys(isEditing).length; each++){
      let visible = Object.keys(isEditing)[each]
      if(soundslip._id === visible){
        setIsEditing(oldState => ({
          ...oldState,
          [visible]: !oldState[visible]
        }))
      }else if(soundslip._id !== visible && isEditing[visible]){
        setIsEditing(oldState => ({
          ...oldState,
          [visible]: false
        }))
      }
    }
  }
  function toggleConfirmDialog(){
    setIsDeleting(oldState => !oldState)
  }
  function deleteSoundslip(){
    axios.delete(baseUrl + `${soundslip._id}`, {})
      .then(response => {
        if(response.statusText === "OK"){
          setFormSubmit(submitted => submitted + 1)
        }else{
          console.log(response)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  const confirmDelete = (
      <div className="delete-dialog-cont">{soundslip.title}
        <h2 className="delete-dialog-lbl">Are you sure you want to delete this sound?</h2>
        <div className="delete-dialog-buttons">
          <button className="delete-dialog-button" onClick={deleteSoundslip}>
            Yes
          </button>
          <button className="delete-dialog-button"onClick={toggleConfirmDialog}>
            No
          </button>
        </div>
      </div>
  )
  function downloadSound(){
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
    <div className="soundslip-container-user">
      {isDeleting && confirmDelete}
      <section className="slip-panel">
        <div className="user-player-section">
          < Player 
            soundslip={soundslip}
          />
          <a ref={download}></a>
          <a className="user-download" onClick={() => downloadSound()}>
            <i className="fa-solid fa-floppy-disk"></i>
          </a>
        </div>
        <div className="user-slip-details">
          <div className="soundslip-topline">
            <h2 className="soundslip-title" onClick={editSoundslip} >{soundslip && parsedTitle}</h2>
            <div className="soundslip-actions">
              <a className="soundslip-delete" onClick={toggleConfirmDialog}>
                <i className="fa-solid fa-delete-left"></i>
              </a>
            </div>
          </div>
          <h3 className="soundslip-desc" onClick={editSoundslip}>{soundslip && soundslip.body}</h3>
          <h3 className="soundslip-date" onClick={editSoundslip}>{soundslip && parsedDate}</h3>
        </div>
      </section>
      <section>
      {isEditing[soundslip._id] &&
        < Edit
          key={soundslip._id}
          soundslip={soundslip}
          />}
      </section>
    </div>
  )
}

export default UserResults
