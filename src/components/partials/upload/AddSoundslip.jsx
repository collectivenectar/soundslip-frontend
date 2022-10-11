import {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL

import {isLoaded, isSignedIn, useUser} from '@clerk/clerk-react'

const AddSoundslip = () => {
  const navigate = useNavigate()

  const tagsGrid = useRef(null)
  const [tag, setTag] = useState("")

  const { isLoaded, isSignedIn, user } = useUser()
  const userInfo = !isLoaded || !isSignedIn ? null : {userId: user.id, userName: user.username}

  const [soundslipForm, setSoundslipForm] = useState({
    file: "",
    title: "",
    body: "",
    tag: tag,
    public: false,
    userId: userInfo.userId,
    userName: userInfo.userName,
  })

  function toggleTag(e){
    setTag(oldState => e.target.parentElement.name)
    setSoundslipForm(oldForm => {
      return {
        ...oldForm,
        tag: e.target.parentElement.name
      }
    })
  }

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

  function inputCheck(){
    let keys = Object.keys(soundslipForm)
    for(let key = 0; key < keys.length - 2; key++){
      if(soundslipForm[keys[key]] === ""){
        return false
      }
    }
    return true
  }

  function handleSubmit(e){
    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    e.preventDefault()
    if(inputCheck()){
      axios.post(baseUrl + '/soundslips/', soundslipForm, config)
      .then(function(response) {
        if(response.status === 200){
          navigate('/')
        }else{
          console.log("upload failed")
        }
      })
    }else{
      console.log("form incomplete, please finish filling it out")
    }
  }

  return (
    <form className="create-new" encType='multipart/form-data'>
      <label className="file-upload-text" htmlFor="upload">Choose a file to upload</label>
      <input className="file-upload" type="file" name="upload" onChange={(e) => updateForm(e)}></input>
      <label className="title-label" htmlFor="title">Sample Title:</label>
      <input className="upload-text" type="text" name="title" value={soundslipForm.title} onChange={(e) => updateForm(e)}></input>
      <label className="body-label" htmlFor="textarea">description</label>
      <textarea className="upload-text" type="textarea" name="body" value={soundslipForm.body} onChange={(e) => updateForm(e)}></textarea>
      <div className="public-label">
        <label>public
          <input type="checkbox" name="public" value={soundslipForm.public} onChange={(e) => updateForm(e)}></input>
        </label>
        <section>
        <h2 href="" className="filters-title">Select your sample type:</h2>
        <div className="upload-tags-grid" ref={tagsGrid}>
          <label className="filter-results">drums
            <a className="filter-icons" name="drums">
              <i className="fa-solid fa-drum" onClick={toggleTag} style={{backgroundColor: 
                `${tag === "drums"? "#918f78": "#22252d"}`}}></i>
            </a>
          </label>
          <label className="filter-results">synth
            <a className="filter-icons" name="synth">
              <i className="fa-solid fa-wave-square" onClick={toggleTag} style={{backgroundColor: 
                `${tag === "synth"? "#918f78": "#22252d"}`}}></i>
            </a>
          </label>
          <label className="filter-results">bass
          <a className="filter-icons" name="bass">
            <i className="fa-solid fa-house-crack" onClick={toggleTag}style={{backgroundColor: 
              `${tag === "bass"? "#918f78": "#22252d"}`}}></i>
            </a>
            </label>
          <label className="filter-results">lead
          <a className="filter-icons" name="lead">
            <i className="fa-solid fa-music" onClick={toggleTag} style={{backgroundColor: 
              `${tag === "lead"? "#918f78": "#22252d"}`}}></i>
            </a>
            </label>
          <label className="filter-results">voice
          <a className="filter-icons" name="voice">
            <i className="fa-solid fa-microphone-lines" onClick={toggleTag} style={{backgroundColor: 
              `${tag === "voice"? "#918f78": "#22252d"}`}}></i>
            </a>
            </label>
          <label className="filter-results">loop
          <a className="filter-icons" name="loop">
            <i className="fa-solid fa-record-vinyl" onClick={toggleTag} style={{backgroundColor: 
              `${tag === "loop"? "#918f78": "#22252d"}`}}></i>
            </a>
            </label>
          <label className="filter-results">other
          <a className="filter-icons" name="other">
            <i className="fa-solid fa-blender" onClick={toggleTag} style={{backgroundColor: 
              `${tag === "other"? "#918f78": "#22252d"}`}}></i>
            </a>
            </label>
        </div>
      </section>
      </div>
      <button className="upload-button" onClick={handleSubmit}>upload</button>
    </form>
  )
}
export default AddSoundslip
