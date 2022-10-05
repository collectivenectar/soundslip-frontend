import React, { useContext, useRef } from 'react'
import Player from '../../partials/library/Player'
import { EditContext } from '../../pages/Library'

const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + "/soundslips/"

// NOTES:

// Looks like I need to get access to the dom, and possible the window?
// I need to trigger an actual download of the file to the 
// client server/file storage as a blob? Then create a url
// from the local blob. Then place it in the DOM using
// React.createElement() or something and trigger
// a click() event?


const Results = ({soundslip}) => {
  const { userId } = useContext(EditContext)
  const download = useRef(null)
  
  function downloadSound() {
    const soundslipId = soundslip._id
    let params = {
      id: userId,
      headers: {
        'Content-Type': 'audio/mpeg'
      },
    }
    axios.get(baseUrl + userId + "/" + soundslipId, {params})
      .then(response => {
        console.log(response.data)
        // response.blob()?
        // download.current.href = url;
        // download.current.setAttribute(
        //   'download',
        //   ``,
        // );
        // download.current.click();
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
