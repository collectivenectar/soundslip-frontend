import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EditContext } from './partials/profile/ManageSoundslips';
import axios from 'axios';

const baseUrl = 'https://soundslip-server.herokuapp.com/soundslips/'

const Player = (props) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const {soundPlaying, setSoundPlaying, userId} = useContext(EditContext)
    const playerRef = useRef(new Audio())
    playerRef.current.autoplay = true
    const location = useLocation()
    const navigate = useNavigate()
    const noAudioRoutes = ["/", "/library"]

    function togglePlay (e) {
        setSoundPlaying((oldAllSounds) => {
            let reset = {}
            for(let each = 0; each < Object.keys(oldAllSounds); each++){
                reset[Object.keys(oldAllSounds)[each]] = false
            }
            return {
                ...reset,
                [props.soundslip._id]: !isPlaying,
            }
        })
    }
    function requestUrl(){
        let params = {
            id: userId,
            headers: {
              'Content-Type': 'audio/mpeg'
          },
        }
        axios.get(baseUrl + props.soundslip._id, {params})
            .then(response => {
                addPlayer(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function addPlayer(url){
        playerRef.current.src = url
        playerRef.current.load()
        playerRef.current.play()
    }

    function stopPlayer(){
        playerRef.current.pause()
    }

    useEffect(() => {
        if(isPlaying && playerRef.current.src === ""){
            requestUrl()
        }else if(isPlaying){
            if(playerRef?.current.src !== ""){
                playerRef.current.play()
            }
        }else if(!isPlaying){
            if(playerRef?.current.src !== ""){
                stopPlayer()
            }
        }  
    }, [isPlaying])

    useEffect(() => {
        setIsPlaying(() => {
            return soundPlaying[props.soundslip._id]
        })
    }, [soundPlaying])
    useEffect(() => {
        if (isPlaying && noAudioRoutes.includes(location.pathname)) {
            // if the audio is playing and the user is in a route with no audio we will set  
            // the state to false and refresh / reload de current page to not listen to it
            togglePlay()
            playerRef.removeAttribute('src'); // empty source
            playerRef.load()
            navigate(0 , { replace: true });
        }
    }, [location])
    return (
        < div >
            <span className="audio-player" onClick={togglePlay}>{isPlaying? "pause": "play"}</span>
        </div>
    )
}

export default Player