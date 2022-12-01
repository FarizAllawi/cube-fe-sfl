import propTypes from 'prop-types'
import {useState, useEffect, useRef} from 'react'
import Image from 'next/image'
import { Document, Page, pdfjs } from 'react-pdf'

import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry"

import Modals from 'components/eca/Modals'
import Button from 'components/eca/Button'

import CloseDark from '/public/images/svg/eca/close-dark.svg'
import ArrowLeft from '/public/images/svg/eca/arrow-left-dark.svg'
import ArrowRight from '/public/images/svg/eca/arrow-right-dark.svg'
import TrashRed from '/public/images/svg/eca/trash-red.svg'

export default function ShowDocument(props) {

    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

    const [index, setIndex] = useState(0)

    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scalePDF, setScalePDF] = useState(1.0)
    const [deleteModals, setDeleteModals] = useState(false)
    
    const wrapper = useRef(null)

    const options = {
        cMapUrl: 'cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'standard_fonts/',
    };

    const imageLoader = ({src}) => {
        return src
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    useEffect(() => {

    }, [index])

    return (
        <>
            <div ref={wrapper} className="absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 backdrop-blur-md">
                <div className="cursor-pointer absolute z-30 top-5 right-3 select-none p-3 flex place-icon-center items-center bg-gray-400 bg-opacity-60 hover:bg-opacity-40 rounded-full" onClick={() => props.onClose()}>
                    <CloseDark className="p-0.5" />
                </div>

                {
                    props.data[index].extension  === 'pdf' ? (
                        <div className="absolute w-screen h-full flex place-content-center items-center scroll-display-none overflow-x-scroll overflow-y-scroll">
                            <div className="relative w-auto max-h-screen overflow-x-scroll scroll-display-none overflow-y-scroll flex place-content-center items-center h-screen">
                                <Document file={{
                                                url: `/api/getFile/${props.data[index].path}`,
                                            }}
                                            renderMode='svg'
                                            onLoadSuccess={onDocumentLoadSuccess} 
                                            options={options}
                                            externalLinkRel="_self"
                                            externalLinkTarget="_self">
                                    <Page height={500} scale={scalePDF} pageNumber={pageNumber} />
                                </Document>
                            </div>

                            <div className="absolute z-20 bottom-0 mb-24 xl:mb-24 w-28 h-10 flex flex-row place-content-center items-center">
                                <div className="cursor-pointer w-1/4 flex place-content-center p-2 bg-gray-400 bg-opacity-60 hover:bg-opacity-40 rounded-l-3xl"
                                     onClick={() => setPageNumber(pageNumber !== 1 ? pageNumber - 1 : pageNumber)}>
                                    <ArrowLeft className="w-6/12"/>
                                </div>
                                <div className="cursor-pointer select-none w-2/4 h-full text-white flex place-content-center items-center text-xs p-2 bg-gray-400 bg-opacity-60">
                                    {pageNumber} of {numPages}
                                </div>
                                <div className="cursor-pointer  w-1/4 flex place-content-center p-2 bg-gray-400 bg-opacity-60 hover:bg-opacity-40 rounded-r-3xl"
                                     onClick={() => setPageNumber(pageNumber !== numPages ? pageNumber + 1 : pageNumber)}>
                                    <ArrowRight className="w-6/12"/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Image loader={imageLoader} fill src={`/api/getFile/${props.data[index].path}`} layout="fill" className="object-contain" alt={props.data[index]}/>
                    )
                }
                
                <div className="absolute z-10 w-full h-full flex place-content-center items-center">
                    <div className="w-1/2 ">
                        <div className="w-1/3 flex place-content-center items-center">
                            <div className={`cursor-pointer px-3.5 py-2.5 xl:px-5 xl:py-4 bg-gray-400 bg-opacity-40 rounded-full ${index !== 0 ? ' hover:bg-opacity-80 ' : ''}`} onClick={() => index !== 0 ? setIndex(index-1) : setIndex(index)}>
                                <ArrowLeft className="w-11/12 xl:w-10/12"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex place-content-end items-center">
                        <div className="relative w-1/3 flex place-content-center items-center">
                            <div className={`cursor-pointer px-3.5 py-2.5 xl:px-5 xl:py-4 bg-gray-400 bg-opacity-40 rounded-full ${index+1 !== props.data.length  ? ' hover:bg-opacity-80 ' : ''}`} onClick={() => index+1 !== props.data.length ? setIndex(index+1) : setIndex(index)}>
                                <ArrowRight className="w-11/12 xl:w-10/12"/>
                            </div>

                            {
                                props.data[index].extension === 'pdf' && (
                                    <>
                                        <div className="absolute mt-52 w-10 h-28 flex flex-col place-content-center items-center text-white">
                                            <div className="cursor-pointer w-full h-1/3 flex place-content-center p-2 bg-gray-400 bg-opacity-60 hover:bg-opacity-40 rounded-t-3xl"
                                                onClick={() => scalePDF !== 2.5 ? setScalePDF( scalePDF+0.25) : setScalePDF(scalePDF)}>
                                                +
                                            </div>
                                            <div className="cursor-pointer w-full h-1/3 text-xs flex place-content-center item-center p-3 bg-gray-400 bg-opacity-60 hover:bg-opacity-40">
                                                {scalePDF}X
                                            </div>
                                            <div className="cursor-pointer w-full h-1/3 flex place-content-center p-2 bg-gray-400 bg-opacity-60 hover:bg-opacity-40 rounded-b-3xl"
                                                onClick={() => scalePDF !== 1.0 ? setScalePDF( scalePDF-0.25) : setScalePDF(scalePDF)}>
                                                -
                                            </div>
                                        </div>
                                    </>

                                )
                            }

                            {
                                props.isUpdate && (
                                    <dib className="cursor-pointer absolute w-14 mt-80">
                                        <div className="absolute mt-20 right-2 xl:right-0 px-2 py-2 xl:px-3 xl:py-3 place-content-center items-center bg-gray-400 bg-opacity-60 hover:bg-opacity-40 rounded-full"
                                             onClick={() => setDeleteModals(true) }>
                                            <TrashRed className="p-1" />
                                        </div>
                                    </dib>
                                )
                            }


                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 w-screen flex place-content-center items-center text-white">
                    <div className="flex text-sm px-6 py-2 bg-gray-400 bg-opacity-80 rounded-2xl">
                        {props.data[index].title}
                    </div>
                </div>
                
                {
                    deleteModals && (
                        <div className="absolute w-screen h-screen">
                            <Modals title='Delete Documents'
                                    type='danger'
                                    caption="Are you sure you want delete this document?"
                                    onClose={() => setDeleteModals(false)}>
                                <div className="w-full flex flex-row gap-2 mt-2 mb-5">
                                    <div className="w-1/2">
                                        <Button size="flex" className="select-none bg-green-400 hover:bg-green-500 py-3 text-xs xl:text-sm text-white" onClick={() => setDeleteModals(false)}>NO, CANCEL </Button>
                                    </div>
                                    <div className="w-1/2 ">
                                        <Button size="flex" className="select-none bg-red-400 hover:bg-red-500 py-3 text-xs xl:text-sm text-white" onClick={() => {props.onDeleteDocument(props.data[index].path); setDeleteModals(false)}}>YES, PROCEED!</Button>
                                    </div>
                                </div>
                            </Modals>
                        </div>
                    )
                }


            </div>
        </>
    )
}

ShowDocument.propTypes = {
    index: propTypes.string,
    data: propTypes.array.isRequired,
    title: propTypes.string,
    isUpdate: propTypes.bool,
}