import React, {
    Fragment,
    useState,
    Component
} from "react";
import axios from "axios";

function ProgressUp(props: any) {

        let [progFiles, setProg] = useState <Array<any>>([]);
        const url = props.uploadURL;

        const clearAll = () => {
                setProg([]);
		console.log("clear All");
        };

        const uploadForm = async (fname:string , formData:FormData ) => {
            await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progEvent) => {
                    let v:number ;
                    if (progEvent.total) {
                        v = (progEvent.loaded / progEvent.total) * 100;
                        console.log(v);
                    }
                    setProg((upl:any) => {
                        return upl.map((p:any) => {
                            if (p.fileName === fname) {
                                p.progressPercent = v;
                            }
                            return p;
                        });
                    });

                },
            }).then(function() {
                console.log("All files uploaded");
            });
        };

        const onFileUpload = (e:any) => {
            const files = e.target.files;
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const formData = new FormData();
                    const fileName = files[i].name;
                    const size = files[i].size;
                    formData.append(props.filesName, files[i]);
                    progFiles.push({
                        fileName,
                        size,
                        progressPercent: 0
                    });
                    uploadForm(fileName, formData);
                }
                setProg(progFiles);
            }
        };

  return (
  <Fragment>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/girish1729/progress-up/css/progress-up.css" />
  <div className="progress-up-wrapper">
	  <header>Progress.up file upload </header>
	  <div className='text-center'>
		  <button onClick={clearAll} className="clearButton" role="button">Clear all</button>
	  </div>

		  <input id="inputFile" onChange={onFileUpload} className="file-input" type="file" name="myFiles" multiple hidden></input>
	  <form className="progress-up-form">
		  <label htmlFor="inputFile" className="button">
		  <h2>Browse Files to Upload</h2>
	</label>
	  </form>
  </div>

  <div id="prog">
  <section className="progress-up-area">
  {progFiles.length > 0
  ? (
  progFiles.map(({fileName, progressPercent, size}) => (
  <li className="row" key={fileName} >
	  <div className="content">
		  <div className="details">
			  <span className="name">{fileName} </span>
			  <span className="percent">{progressPercent} %</span>
		  </div>
		  <div className="progress-bar">
			  <div  className="progress" style={{width:
				progressPercent + '%'}}></div>
		  </div>
		  <span className="size">{size} Bytes</span>
	  </div>
  </li>
  ))
  )
  : <p>HTML5 Multiple upload progress indicator </p>}
  </section>
  </div>

 </Fragment>
  );
}

export default ProgressUp;