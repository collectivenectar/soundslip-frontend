import React, { useContext } from 'react'
import { EditContext } from './ManageSoundslips'
import Edit from './Edit'
import Player from '../../Player'

import axios from 'axios'
const baseUrl = "https://soundslip-server.herokuapp.com"

const UserResults = ({soundslip}) => {
  const {isEditing, setIsEditing, setFormSubmit} = useContext(EditContext)

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
  return (
    <div className="soundslip-container">
      <section className="slip-panel">
        <div>
          <h2 className="soundslip-title">{soundslip && soundslip.title}</h2>
          <h3 className="soundslip-desc">{soundslip && soundslip.body}</h3>
          <h3 className="soundslip-date">{soundslip && soundslip.createdAt}</h3>
          </div>
          <div>
            < Player 
              soundslip={soundslip}
            />
          </div>
          <div>
            <button className="soundslip-edit" onClick={editSoundslip}>Edit Details</button>
            <button className="soundslip-delete" onClick={deleteSoundslip}>Delete</button>
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
