"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
const NavBar = () => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const serpkey = formData.get("serpkey");
    const geminiApikey = formData.get("geminiApi");
  
    localStorage.setItem("serpkey", serpkey);
    localStorage.setItem("geminiApikey", geminiApikey);

    const success =  toast.success('Keys Saved! 📋✨', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });

            try{ success()
             } catch {

            }
           
    }
  
  const [settings, setsettings] = useState(false)

  return (
    <div className='bg-zinc-950/70 backdrop:blur-md h-14 flex items-center'>
      <h1 className='ml-5 text-white text-2xl font-sans font-semibold'>PostPerfect AI</h1>
      <img src='/settings.png' className='h-8 w-8 ml-auto mr-5 cursor-pointer' onClick={()=>{setsettings(!settings)}} />
      {settings && <div className='absolute right-2 top-16 h-44 w-96 rounded-lg bg-zinc-950/70 flex flex-col text-white'>
        <form onSubmit={handleSubmit} className='flex my-auto flex-col items-center justify-center gap-1'>
          <label htmlFor='serpkey' >SerpAPI Key:</label>
          <input type='text' name='serpkey' id='serpkey' className='bg-zinc-800 focus:outline-none rounded-md px-2 py-1 hover:bg-zinc-700' placeholder='SerpAPI Key '></input>
          <label htmlFor='geminiApi' >Gemini API Key:</label>
          <input type='text' name='geminiApi' id='geminiApi' className='bg-zinc-800 focus:outline-none rounded-md px-2 py-1 hover:bg-zinc-700' placeholder='GeminiPI Key '></input>
          <button type='submit' className='bg-zinc-950 text-white px-2 py-1 rounded-md'>Save</button>
        </form>
      </div>}
    </div>
  )
}

export default NavBar