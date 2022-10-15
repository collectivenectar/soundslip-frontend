import React, { useState, useContext } from 'react'
import { EditContext } from './ManageSoundslips'
import { toast } from 'react-toastify'

import axios from 'axios'
const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL

const Edit = (props) => {
  const [editForm, setEditForm] = useState(props.soundslip)
  const {setFormSubmit} = useContext(EditContext)
  const toastTemplate = (msg) => toast(msg)

  function handleSubmit(e){
    e.preventDefault()
    // could add logic here to prevent unnecessary crud operations if editForm is unchanged 
    // compared to different soundslip.properties. If same, do nothing, if changed, axios.put()
    axios.put(baseUrl + `/soundslips/${editForm._id}`, {...editForm})
      .then(response => {
        if(response.statusText === "OK"){
          setFormSubmit(submitted => submitted + 1)
        }else{
          console.log(response)
        }
      })
      .catch(err => {
        toastTemplate("there was an error submitting your edits")
        console.log(err)
      })
  }
  function handleChange(e){
    const {name, value, type, checked} = e.target
    setEditForm(oldValues => {
        return {
        ...oldValues,
        [name]: type === "checkbox" ? checked: value
      }
      })
  }

  return(
    <div className="edit-container">
      <form className="edit-form">
        <label>Title
          <input type="text" name="title" value={editForm.title} onChange={handleChange} placeholder={editForm.title}></input>
        </label>
        <label>Description
          <textarea type="textarea" name="body" value={editForm.body} onChange={handleChange}></textarea>
          </label>
        <label>Public
          <input className="edit-public" type="checkbox" name="public" checked={editForm.public} onChange={handleChange}></input>
          </label>
        <input className="edit-submit" type="submit" onClick={e => handleSubmit(e)} value="save changes"></input>
      </form>
    </div>
  )
}
export default Edit
