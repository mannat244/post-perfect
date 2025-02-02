"use client"

import { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import { toast } from 'react-toastify';
import Hero from "./components/Hero";

export default function Home() {

     const canvasRef = useRef()
     const [image, setimage] = useState("")
     const [topic, settopic] = useState()
     const [serpapi, setserpapi] = useState()
     const [gemini, setgemini] = useState()
     const [gen, setgen] = useState(false)
     const [text, settext] = useState("Best AI Generator")
     const [caption, setcaption] = useState("Let the AI cook... your post is on the way! 🍳🤖")
     const [show, setshow] = useState(false)
     const btnRef = useRef()
     const capRef = useRef()
     const imgRef = useRef()
     const notify = () => toast("Request Failed! Refresh & Retry!");
     const key = () => toast("Keys Missing Failed! Click Settings & Update Key!");
     const copy = () => toast.success('Caption copied! 📋✨', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });

      const downloadTaintedCanvas = () => {
        if (!canvasRef.current) {
          console.error("Canvas not found!");
          return;
        }
    
        try {
          const dataUrl = canvasRef.current.toDataURL("image/png"); // Convert to Data URL
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <head><title>Long-press to Save</title></head>
              <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;">
                <img src="${dataUrl}" style="max-width:100%;height:auto;">
              </body>
            </html>
          `);
        } catch (error) {
          console.error("Error opening image:", error);
        }
      };
  
    useEffect(() => {

      const serpkey = localStorage.getItem("serpkey");
      const geminiApikey = localStorage.getItem("geminiApikey");

      setserpapi(serpkey)
      setgemini(geminiApikey)
  
      console.log("loaded keys", serpapi, gemini)

      if (!serpkey || !geminiApikey) {
          toast.error("API keys missing! Please enter and save them first.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
          });
          return;
      }

      if(!gen){
      capRef.current.style.display = "none";
      imgRef.current.style.display = "none";
      }
    const ImageCanvas = canvasRef.current
    const captionText = capRef.current
    const context = ImageCanvas.getContext("2d")
    const img = new Image()
    img.setAttribute('crossorigin', 'anonymous')
    img.src = image
    const logo = new Image()
    logo .src = '/tbc-logo.png'
   
    
    img.onload = () => {
      const canvasWidth = 1080;
      const canvasHeight = 1080;
    
      context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      
    
      const grad = context.createLinearGradient(0, canvasHeight, 0, canvasHeight - 350); 
      grad.addColorStop(0, "rgba(0, 0, 0, 1)");
      grad.addColorStop(0.3, "rgba(0, 0, 0, 1)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.8)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    
      context.fillStyle = grad;
      context.fillRect(0, canvasHeight - 350, canvasWidth, 350); 
      context.fillStyle = "white"; 
      context.font = "bold 40px Arial"; 
      context.textAlign = "center";
      context.textBaseline = "top";
    
      const lines = text.split("\n");
      let y = canvasHeight - 250; // 
      lines.forEach((line, index) => {
        context.fillText(line, canvasWidth / 2, y + index * 60); 
      });
      
    };
    
  }, [gen,text, image , caption])
   
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    btnRef.current.style.display = "none";
    capRef.current.style.display = "block";
    imgRef.current.style.display = "block";
 
   

    try{

      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic , serpapi:serpapi , gemini:gemini }),
      });
  
      const data = await response.json();
      if (data.imageUrl) {
        setimage(data.imageUrl);
        settext(data.read.text);
        setcaption(data.read.caption);
        setshow(true)
        setgen(!gen); 
        btnRef.current.style.display = "block";
        imgRef.current.style.display = "none";
      }
      console.log(data)

    } catch (error) {
      console.error("Error opening image:", error);
      
      notify()
      btnRef.current.style.display = "block";
      capRef.current.style.display = "none";
      imgRef.current.style.display = "none";
    }
  };
  

  return (
   <div>
    <NavBar/>
    <Hero/>
    <div className="prompt w-[80%] md:w-[50%] mt-10 mx-auto flex justify-center items-center flex-col">
     <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
     <input  type="text" className="w-full bg-zinc-950/50 py-2 rounded-xl pl-5 font-medium text-white text-lg focus:outline-none hover:shadow-2xl hover:shadow-blue-400/50 hover:ring-1 focus:shadow-2xl focus:shadow-blue-400/50 focus:ring-1 ring-blue-500/70" placeholder="What Do You Want To Create?" onChange={(e)=>{
      settopic(e.target.value)
     }}></input>
     <p className="text-white/60 mt-8 ">To get the best results from PostPerfect AI, try prompts like: "Write a post about RRR, telling how it’s a powerful mix of action, drama, and patriotic spirit." Or you can ask for a news event, such as: "Write a post about the Indian government's new startup scheme, telling how it will provide fresh opportunities for young entrepreneurs in India.</p>
     <button ref={btnRef} type="submit" className="bg-green-700 font-sans font-semibold text-lg hover:text-white hover:w-60 hover:bg-blue-700 duration-500 hover:shadow-2xl shadow-blue-400/50 text-white/80 rounded-md mx-auto mt-10 p-2 ">Generate</button>
     </form>
    </div>
    <div className="generation">
    <canvas ref={canvasRef} height={show ? 1080 : 0} width={1080}  style={{ height: show ? "400px" : "0px", transition: "height 0.3s ease-in-out" }} className="h-[400px] w-[400px] mx-auto mt-10 rounded-md"></canvas>
    </div>
     <img ref={imgRef} className="h-36 mx-auto"  src="/transparent-food.gif" />
    <p ref={capRef} onClick={()=>{
       navigator.clipboard.writeText(caption);
       copy()
    }} className="mx-auto cursor-pointer px-3 mb-10 py-2 text-center rounded-md shadow-2xl font-medium text-white w-96 bg-gradient-to-r from-zinc-700/70 to-zinc-900/70 mt-8">{caption}</p>

{show && <button onClick={downloadTaintedCanvas} className="bg-blue-600 text-white block w-36 mx-auto py-2 px-4 rounded-lg mt-4">
        Save Image 📷</button>}

  <FAQ 
  ques="How do I download the image?" 
  ans="On Android, simply take a screenshot. 📱 On PC, right-click the image and select 'Save As'. 💾" 
/> 

    <FAQ 
    ques={"How to get the API keys?"}
    ans="To use PostPerfect AI, you need two API keys: SerpAPI Key for fetching relevant images and Gemini API Key for generating captions. Get your SerpAPI Key by signing up at [serpapi.com](https://serpapi.com/) and copying your API key from the dashboard. For the Gemini API Key visit [Google AI Studio](https://aistudio.google.com/), create a project, and generate an API key under API & Services. Once you have both keys, enter them in the settings and save to start generating posts seamlessly! 🚀"/>

 <FAQ 
  ques="Is Post Perfect AI free to use?" 
  ans="Yup, it is! You can use your own keys and generate upto 100 posts/month or more! 🚀" 
/>

<FAQ 
  ques="What does Post Perfect AI do?" 
  ans="It lets you generate ready-to-upload Instagram posts with a single click! Just enter a topic, and boom—image, caption, and design are all set. No editing, no hassle. 📸✨" 
/>
<FAQ 
  ques="Why is the image not showing, but the caption is?" 
  ans="Sometimes, the server might not fetch the image properly. This can happen due to temporary issues. Just refresh and try again—if it still doesn’t work, wait 120 seconds and retry. ⏳🔄" 
/>

<div className="h-40"></div>
      </div>
  );
}
