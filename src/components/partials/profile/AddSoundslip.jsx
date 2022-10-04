import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
const baseUrl = "https://soundslip-server.herokuapp.com"

import {isLoaded, isSignedIn, useUser} from '@clerk/clerk-react'

const AddSoundslip = () => {
  const navigate = useNavigate()

  const { isLoaded, isSignedIn, user } = useUser()
  const userInfo = !isLoaded || !isSignedIn ? null : {userId: user.id, userName: user.username}

  const [soundslipForm, setSoundslipForm] = useState({
    file: null,
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
        return {
          ...prevForm,
          file: e.target.files[0]
        }
      })
    }
    else{
      setSoundslipForm(prevForm => {
        return {
          ...prevForm,
          [e.target.name]: e.target.value
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
      <label htmlFor="upload">Choose a file to upload</label>
      <input type="file" name="upload" onChange={(e) => updateForm(e)}></input>
      <label htmlFor="title">Sample Title:</label>
      <input className="upload-text" type="text" name="title" onChange={(e) => updateForm(e)}></input>
      <label htmlFor="textarea">description</label>
      <input className="upload-text" type="textarea" name="body" onChange={(e) => updateForm(e)}></input>
      <label htmlFor="public">public</label>
      <input type="checkbox" name="public" onChange={(e) => updateForm(e)}></input>
      <button onClick={handleSubmit}>upload</button>
      <div>{}</div>
    </form>
  )
}
export default AddSoundslip
