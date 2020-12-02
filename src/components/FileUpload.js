import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import { storage } from "../firebase/Firebase";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const defaultImg = 'https://firebasestorage.googleapis.com/v0/b/image-uploader-aab31.appspot.com/o/images%2Fdefault.png?alt=media&token=e08a4c1c-7979-4988-8b2e-f1e47cd2ee00';
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState('');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadTask = storage.ref(`/images/${filename}`).put(file)
      //initiates the firebase side uploading 
      uploadTask.on('state_changed',
        (snapShot) => {
          //takes a snap shot of the process as it is happening
          console.log(snapShot)
          setUploadPercentage(
            parseInt(
              Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }, (err) => {
          //catches the errors
          console.log(err)
        }, () => {
          storage.ref('images').child(filename).getDownloadURL()
            .then(fireBaseUrl => {
              setUploadedFile(fireBaseUrl)
              console.log(fireBaseUrl)
              setMessage('File Uploaded');
            })
        })

    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5 mb-5'>
          <div className='col-lg-6 col-md-10 col-sm-12 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile} alt='' />
            <form className="form-inline row col-12 mt-5">
              <div className="form-group mx-sm-3 mb-2">
                <label for="input2" className="sr-only">Url</label>
                <input type="text" className="form-control" id="input2" value={uploadedFile} />
              </div>
              <div className="form-group mx-sm-3 mb-2">
                <CopyToClipboard text={uploadedFile}>
                  <div className="btn btn-primary">Copy to clipboard</div>
                </CopyToClipboard>
              </div>
            </form>
          </div>
        </div>
      ) :
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <img style={{ width: '100%', height: '70%' }} src={defaultImg} alt='' />
          </div>
        </div>
      }
    </Fragment>
  );
};

export default FileUpload;
