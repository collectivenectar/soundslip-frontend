import React, { useContext } from 'react'
import { EditContext } from './ManageSoundslips'
import Edit from './Edit'
import Player from '../../Player'

import axios from 'axios'
const baseUrl = "https://soundslip-server.herokuapp.com"
const deleteUrl = "https://soundslip-server.herokuapp.com/soundslips/"

const UserResults = ({soundslip}) => {
  const {isEditing, setIsEditing, setFormSubmit, userId} = useContext(EditContext)

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
  function deleteSoundslip(){
    axios.delete(baseUrl + `/soundslips/${soundslip._id}`, {})
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
  function downloadSound(){
    let soundslipId = soundslip._id
    let params = {
      id: userId,
      headers: {
        'Content-Type': 'audio/mpeg'
      },
    }
    axios.get(deleteUrl + userId + "/" + soundslipId, {params})
      .then(response => {
        console.log(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <div className="soundslip-container-user">
      <section className="slip-panel">
      <div className="player-section">
        < Player 
          soundslip={soundslip}
        />
        </div>
        <div>
          <div className="soundslip-topline">
            <h2 className="soundslip-title">{soundslip && soundslip.title}</h2>
            <div className="soundslip-actions">
            < a className="download" onClick={() => downloadSound()}><i className="fa-solid fa-floppy-disk"></i></a>
            < a className="soundslip-edit" onClick={editSoundslip}><i className="fa-solid fa-sliders"></i></a>
            < a className="soundslip-delete" onClick={deleteSoundslip}><i className="fa-solid fa-delete-left"></i></a>
            </div>
          </div>
          <h3 className="soundslip-desc">{soundslip && soundslip.body}</h3>
          <h3 className="soundslip-date">{soundslip && soundslip.createdAt}</h3>
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
