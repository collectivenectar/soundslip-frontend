import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL

import {isLoaded, isSignedIn, useUser} from '@clerk/clerk-react'

const AddSoundslip = () => {
  const navigate = useNavigate()

  const { isLoaded, isSignedIn, user } = useUser()
  const userInfo = !isLoaded || !isSignedIn ? null : {userId: user.id, userName: user.username}

  const [soundslipForm, setSoundslipForm] = useState({
    file: "",
    title: "",
    body: "",
    public: false,
    userId: userInfo.userId,
    userName: userInfo.userName,
  })

  function updateForm(e){
    if(e.target.name === "public"){
      setSoundslipForm(prevForm => {
        return {
          ...prevForm,
          public: !prevForm.public
        }
      })
    }else if(e.target.name === "upload"){
      setSoundslipForm(prevForm => {
        console.log(e.target.files[0])
        return {
          ...prevForm,
          file: e.target.files[0]
        }
      })
    }
    else{
      setSoundslipForm(prevForm => {
        let inputValidation = ""
        if(e.target.name === "title"){
          if(e.target.value.length <= 50){
            inputValidation = e.target.value
          }else{
            inputValidation = prevForm.title.slice(0, prevForm.title.length)
            console.log("max character limit reached for description title")
          }
        }else{
          if(e.target.value.length <= 100){
            inputValidation = e.target.value
          }else{
            inputValidation = prevForm.body.slice(0, prevForm.body.length)
            console.log("max character limit reached for description body")
          }
        }
        return {
          ...prevForm,
          [e.target.name]: inputValidation,
        }
      })
    }
  }

  function handleSubmit(e){
    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    e.preventDefault()
    axios.post(baseUrl + '/soundslips/', soundslipForm, config)
      .then(function(response) {
        if(response.status === 200){
          navigate('/')
        }else{
          console.log("upload failed")
        }
      })
  }

  return (
    <form className="create-new" encType='multipart/form-data'>
      <label className="file-upload-text" htmlFor="upload">Choose a file to upload</label>
      <input className="file-upload" type="file" name="upload" onChange={(e) => updateForm(e)}></input>
      <label className="title-label" htmlFor="title">Sample Title:</label>
      <input className="upload-text" type="text" name="title" value={soundslipForm.title} onChange={(e) => updateForm(e)}></input>
      <label className="body-label" htmlFor="textarea">description</label>
      <textarea className="upload-text" type="textarea" name="body" value={soundslipForm.body} onChange={(e) => updateForm(e)}></textarea>
      <label className="public-label" htmlFor="public">public</label>
      <input className="upload-checkbox" type="checkbox" name="public" value={soundslipForm.public} onChange={(e) => updateForm(e)}></input>
      <button className="upload-button" onClick={handleSubmit}>upload</button>
      <div>{}</div>
    </form>
  )
}
export default AddSoundslip
