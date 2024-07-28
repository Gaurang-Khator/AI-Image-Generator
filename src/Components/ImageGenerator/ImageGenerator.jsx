import React, { useRef, useState } from 'react'
import './ImageGenerator.css'
import default_image from '../Assets/default_image.svg'
import FormData from 'form-data'
import axios from 'axios'

export const ImageGenerator = () => {

    const [img_url, setImg_url] = useState("/");
    let inputRef = useRef(null);
    const[loading, setLoading] = useState(false);


    const handle = async() => {
        if(inputRef.current.value==="") {
            return ;
        }
        setLoading(true);
        const payload = {
            prompt: inputRef.current.value,
            output_format: 'webp',
        }
        try {
            const response = await axios.post(
                "https://api.stability.ai/v2beta/stable-image/generate/core",
                payload,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":"multipart/form-data",
                        Authorization:
                        "Bearer MYAPI_KEY",
                        Accept: "image/*",
                    },
                    responseType: 'arraybuffer',
                });
                if(response.status === 200) {
                    const blob = new Blob([response.data], { type: 'image/webp' });
                    const url = URL.createObjectURL(blob);
                    setImg_url(url);
                    setLoading(false);
                } else {
                    throw new Error(`${response.status}: ${response.data.toString()}`);
                }
        } catch(error) {
            console.error('Error generating image:', error);
        }
        
    };


  return (
    <div className='ai-image-gen'>
        <div className="header">AI Image <span>Generator</span></div>
        <div className="img-loading">
            <div className="image"><img src={img_url==="/"?default_image:img_url} alt="" /></div>
            <div className="loading">
                <div className={loading?"loading-bar-full":"loading-bar"}></div>
                <div className={loading?"loading-text":"display-none"}>Loading...</div>
            </div>
        </div>
        <div className="search-box">
            <input type="text" ref={inputRef} className='search-input' placeholder='Describe What Image You Want to See ' />
            <div className="btn" onClick={() => {handle()}}>Generate</div>
        </div>
    </div>
  )
}
