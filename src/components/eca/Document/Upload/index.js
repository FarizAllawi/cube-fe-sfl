import { useState, useCallback, useEffect, useRef} from 'react'
import { useDropzone } from 'react-dropzone'
import propTypes from 'prop-types'
import Image from 'next/image'

import UploadGray from '/public/images/svg/eca/upload-gray.svg'
import TrashDark from '/public/images/svg/eca/trash-dark.svg'
import PDFIcon from '/public/images/svg/eca/pdf-red.svg'
import DocumentIcon from '/public/images/svg/eca/document-icon.svg'
import TextIcon from '/public/images/svg/eca/text-icon.svg'
import VideoIcon from '/public/images/svg/eca/video-icon.svg'
import ReloadIcon from '/public/images/svg/eca/reload-dark.svg'

function CardDocuments(props) {
    const {
        name, data, uploadStatus, uniqueFolder
    } = props

    const cardWrapper = useRef(null)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(false)
    const [cardHover, setCardHover] = useState(false)

    const uploadFiles = async (files, onprogress) => {
        // console.log(files)
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.open('POST', `/api`)
            // xhr.withCredentials = true
            // xhr.setRequestHeader("Cache-Control", "no-cache");
            // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            // xhr.setRequestHeader("X-File-Name", files.name);
            // xhr.setRequestHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_API_STORAGE}`)
            // xhr.setRequestHeader('Accept', files.type)
            // xhr.setRequestHeader('Access-Control-Allow-Method', 'POST, OPTIONS, GET, PUT, DELETE, PATCH')
            // xhr.setRequestHeader('Access-Control-Allow-Headers','Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Accept, Origin, Cache-Control, X-Requested-With, Depth, User-Agent, If-Modified-Since, X-File-Size, X-Requested-With, X-File-Name, If-None-Match')
            // xhr.setRequestHeader('Access-Control-Allow-Headers', "X-Requested-With, X-File-Name, Content-Type, multipart/form-data, Origin, authorization, Accept, SMCHALLENGE")
            
            xhr.onload = () => {
                const resp = JSON.parse(xhr.responseText)
                resolve(resp.data)
            }

            xhr.onerror = (evt) => {
                setError(true)
                reject(evt)
            }

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentage = (event.loaded/event.total) * 100
                    setProgress(Math.round(percentage))
                }
            }

            const formData = new FormData()
            formData.append('Files', files)
            xhr.send(formData)
        })
    }

    const upload = useCallback(async () => {
        let tempData = data
        const url = await uploadFiles(tempData, setProgress)
        if (!tempData.hasOwnProperty('storagePath')) { 
            tempData['storagePath'] = url.filePath
            tempData['storageFileName'] = url.fileName
        }
        props.onChange({target: {name: name, value: tempData}})
    }, [data, name, props])

    useEffect(() => {
        const handleClickOutside = event => {
            if (cardWrapper.current && cardWrapper.current.contains(event.target)) {
                setCardHover(true)
                props.onHover(data.name)
            } else {
                setCardHover('')
                props.onHover('')
            } 
        }

        if (uploadStatus && progress === 0) upload()
        document.addEventListener("mouseover", handleClickOutside)
        return () => {
            document.removeEventListener("mouseover", handleClickOutside)
        }
    }, [uploadStatus, progress, cardHover, upload, props, data.name])

    return (
    <div ref={cardWrapper} className="relative w-10 h-12  bg-gray-300 rounded-lg">
        { 
            data.type.split('/')[0] === 'application' ? (
                <div className="w-full h-full flex place-content-center items-center">
                    <DocumentIcon className="w-10 h-10" />
                </div>
            ) : data.type.split('/')[0] === 'video' ? (
                <div className="w-full h-full flex place-content-center items-center">
                    <VideoIcon className="w-10 h-10 p-1" />
                </div>
            ) : data.type.split('/')[0] === 'text' ? (
                <div className="w-full h-full flex place-content-center items-center">
                    <TextIcon className="w-10 h-10" />
                </div>
            ) : (
                <Image  src={data.url}
                        className="w-full h-full object-cover rounded-lg" 
                        placeholder=''
                        width={10} 
                        height={12} 
                        quality={100} 
                        alt={data.name}  
                        priority 
                        unoptimized={true} />
            )
        
        }

        {
            !uploadStatus ? (
                <>
                    <div onClick={() => props.onDelete(data)} 
                            className={`${cardHover ? 'visible' : 'invisible'}
                                        absolute z-30 top-0 w-full h-full
                                        flex place-content-center items-center 
                                    bg-black bg-opacity-40 rounded-md`}>
                        <div className="w-7 h-7 flex place-content-center items-center bg-red-400 rounded-full">
                            <TrashDark className="p-1.5" />
                        </div>
                    </div>
                </>
            ) : !error ? (
                <>
                    <div className={`absolute z-30 bottom-0 w-full bg-black bg-opacity-60 rounded-b-lg ${progress > 97 ? 'rounded-t-lg' : ''}`} style={{ height: `${progress}%` }}></div>
                    <div className={`absolute z-30 bottom-0 w-full h-full bg-transparent
                                        flex place-content-center items-center rounded-md`}>                                            
                        <div className="w-7 h-7 flex place-content-center items-center bg-white bg-opacity-80 rounded-full">
                            <span className='transition-all delay-150 text-black text-opacity-80' style={{ fontSize: "8px" }}>{progress}%</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div onClick={() => { setError(false); setProgress(0); upload()}} 
                            className={`absolute z-30 top-0 w-full h-full
                                        flex place-content-center items-center 
                                    bg-red-400 bg-opacity-40 rounded-md`}>
                        <div className="w-7 h-7 flex place-content-center items-center bg-red-400 rounded-full">
                            <ReloadIcon className="pt-0.5 pl-1  " />
                        </div>
                    </div>
                </>
            )
        }                        
    </div>
    )
}

export default function Upload(props) {

    const {
        name, value, labelName, placeholder, maxFiles, uploadStatus
    } = props

    const [dataUpload, setDataUpload] = useState(value)
    const [errorMessage, setErrorMessage] = useState('')
    const [onCardHover, setOnCardHover] = useState('')

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        // setErrorMessage('')
        let tempFiles = dataUpload
        let dataLength = dataUpload.length !== 0 ? dataUpload.length - 1 : 0

        // if ()
        if (dataUpload.length !== 0 && tempFiles.length + acceptedFiles.length > maxFiles) setErrorMessage(`You can only upload ${maxFiles} files!`)
        if(tempFiles.length > maxFiles) setErrorMessage(`You can only upload ${maxFiles} files!`)

        for (let index = dataLength; index < maxFiles; index++) {
            
            let documentExists = false
            let file = acceptedFiles[index]
            
            value.map(document => {
                if (file.name  === document.name) documentExists = true
            })

            if (!documentExists) {
                tempFiles.push(file)
                setErrorMessage('')
            }
            else setErrorMessage(`You have already uploaded ${acceptedFiles[index].name}`)
        }

        if (acceptedFiles.length > maxFiles) setErrorMessage(`You can only upload ${maxFiles} files!`)


        props.onChange({
            target: {
                name: name,
                value: tempFiles
            }
        })
        
    }, [dataUpload, maxFiles, name, props, value])

    const deleteFile = (file) => {
        let tempData = value
        let index = tempData.indexOf(file)
        if (index > -1) tempData.splice(index, 1)
        setOnCardHover('')
        props.onChange({target: {name: name, value: tempData}})
    }
    
    const {getRootProps, getInputProps, fileRejections, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            // 'video/*': [],
            // 'text/*': [],
            'application/*': ['.pdf']
        }
    })

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map(e => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      ));

    const onChange = ({target}, index) => {
        let tempData = dataUpload
        tempData[index] = target.value 
        props.onChange({
            target:{
                name: name,
                value: tempData
            }
        })
    }

    useEffect(() => {
    }, [errorMessage ,value, uploadStatus, onCardHover])

    return (
        <div className="relative cursor-pointer w-full pt-2 pb-2">
            {
                labelName && (
                    <label htmlFor={name} className="text-sm text-gray-500 dark:text-white font-semibold">{labelName}</label>
                )
            }

            <div className="relative w-full h-48 px-4
                            border border-dashed border-gray-300 bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm 
                            flex flex-col place-content-center items-center gap-1 rounded-2xl divide-y-2 divide-dashed">
                <div className="relative w-full h-2/3 flex" {...getRootProps()}>
                    <div className="w-full flex flex-col place-content-center items-center pt-12">
                        <div className="w-full h-8 flex place-content-center ">
                            
                            <UploadGray className="w-full h-full" />
                        </div>
                        <div className="w-10/12 h-4 flex place-content-center text-xs text-gray-300">
                            {
                                onCardHover !== '' ? onCardHover : placeholder
                            }
                        </div>
                    </div> 

                    <input className="absolute w-full h-full" {...getInputProps()}/>
                </div>
                
                <div className="w-full h-1/3 py-1 grid grid-flow-col auto-cols-max place-content-start gap-1 overflow-x-scroll overflow-y-hidden ">
                {
                    dataUpload?.map((item, index) => {
                        item['url'] = URL.createObjectURL(item)
                        item['extension'] = item.name.split('.').pop()
                        return (
                            <CardDocuments key={index} 
                                           name={name} 
                                           data={item} 
                                           uniqueFolder={props.uniqueFolder}
                                           uploadStatus={uploadStatus}
                                           onDelete={files => deleteFile(files)} 
                                           onHover={fileName => setOnCardHover(fileName)}
                                           onChange={target => onChange(target, index)}/>
                        )
                    })
                }
                </div>
            </div>
            {
                errorMessage !== '' && (
                    <div className='mt-0.5 absolute w-full text-center text-red-500 font-base text-xs'>
                        { errorMessage }
                    </div>
                )
            }
        </div>
    )
}

Upload.defaultProps = {
    placeholder: 'Chose or drag and drop your file here',
    maxFiles: 5
}

Upload.propTypes = {
    labelName: propTypes.string,
    placeholder: propTypes.string,
    uploadUrl: propTypes.string,
    uploadStatus: propTypes.bool,
    uniqueFolder: propTypes.string,
    maxFiles: propTypes.number,
    name: propTypes.string,
    value:propTypes.array.isRequired,
    onChange: propTypes.func.isRequired
}