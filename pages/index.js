import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.scss'

export default function Home() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  const [tags, setTags] = useState();

  const [activeTag, setActiveTag] = useState();



  useEffect(()=>{
    (async function run(){
      const data = await fetch("/api/tags").then(r => r.json());
      setTags(data.tags);
    })()
  }, [])

  const [images, setImages] = useState();

  // These is where the image url will be after  clicking on a tag and console logging. (i console.logged all the image info from search text)
  console.log("images", images)

  useEffect(()=>{
    (async function run(){
      if ( !activeTag) return;
      const data = await fetch("/api/images", {
        method: "POST",
        body: JSON.stringify({
          tag: activeTag
        })
      }).then(r => r.json());
      setImages(data.resources);   //sets to resources(images in API database)
    })()
  }, [activeTag])

  /**
   * handleOnChange
   * @description Triggers when the file input changes (ex: when a file is selected)
   */

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function(onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    }

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */

  

  async function handleOnSubmit(event) {
    var imageSection = document.getElementById("imageSection");
    imageSection.style.display = "none";
    event.preventDefault();
    const data = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        image: imageSrc
      })
    }).then(r=> r.json());

    setImageSrc(data.secure_url);
    setUploadData(data);

    alert("Uploaded")
    
    // console.log("data:", data)
  }

  useEffect(()=>{

  var searchBox = document.getElementById("searchBox")
  var searchBtn = document.getElementById("searchButton");
  var imageSection = document.getElementById("imageSection");
  searchBtn.addEventListener("click", ()=>{
    imageSection.style.display = "none";
  })
  searchBox.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
      event.preventDefault();
      // var imageSection = document.getElementById("imageSection");
    imageSection.style.display = "none";
      document.getElementById("searchButton").click()
    }
  })
})

  return (
    <div className={styles.container}>
      <Head>
        <title>Pic detective</title>
        <meta name="description" content="Upload your image to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pic Detective <img className={styles.detectiveIcon} src={"/d111.png"}alt="image not found" />
        </h1>

       
        <div className={styles.searchDiv}>
          <input id='searchBox' className={styles.searchBox} type='text' ></input>          
          <button onClick={()=>setActiveTag(searchBox.value) } className={styles.searchButton} id='searchButton'><img src={"/icons8-search-white.svg"}/></button>
        </div>

            <div className={styles.uploadSection}>

        <p className={styles.description}>
          Upload<br/> images
        </p>
        

        <form className={styles.form} method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          <p>
          <label className={styles.customFileUpload}><img className={styles.uploadIcon} src={"/icons8-upload-64.png"}alt="image not found" />
          
            <input type="file" name="file" />
            </label>
          </p>
          
          
          
          {imageSrc && !uploadData && (
            <p>
              <button>Upload Images</button>
            </p>
          )}
          <img src={imageSrc} />

          {/* {uploadData && (
            <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
          )} */}
        </form>
        </div>
        <div className={styles.imageSection} id='imageSection'>
          <h2>Your images appear here</h2>
        </div>


        {/* creating unordered list with image results */}
      {Array.isArray(images) && (
          <ul style={{
            display: 'grid',
            gridGap: '1em',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            { images.map(image => {
              return (
                <li key={image.asset_id} style={{ margin: '1em' }}>
                  <img src={image.secure_url} width={image.width} height={image.height} alt="" />
                </li>
              )
            })}
          </ul>
        )}

      </main>

     
    </div>
  )
}
