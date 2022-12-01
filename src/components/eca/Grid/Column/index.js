import propTypes from 'prop-types'
import { useEffect, useState } from 'react'

function getDataColumn(column, data){
    const rowData = Math.ceil(data.length / column)
    let col1 = [], col2 = [], col3 = [], col4 = [] 

    let dataColumn = 0
    data.map (item => {
        if (dataColumn === column) dataColumn = 0
        dataColumn += 1
        switch(dataColumn) {
            case 1 : {
                col1.push(item)
                break
            }
            case 2 : {
                col2.push(item)
                break
            }
            case 3 : {
                col3.push(item)
                break
            }
            case 4 : {
                col4.push(item)
                break
            }

        }
    })

    return  {
        dataCol1: col1, dataCol2: col2, dataCol3: col3, dataCol4: col4,
    }
}

export default function GridColumn(props) {

    const children = props.children
    const [dataColumn, setDataColumn] = useState({})
    const [mounted, setMounted] = useState(false)
    const [gridColumn, setGridColumn] = useState(0)

    useEffect(() => {
        if (!mounted) setMounted(true)

        const handleResize = () => {
            let size = window.innerWidth
            let column = size >=  1300 ? 4 : size >= 1024 ? 3 : size >= 768 ? 2 : 1
            setGridColumn(column)
            setDataColumn(getDataColumn(column, children))
    }
        
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [children, mounted])

    if (!mounted) return null

    return (
        <div className="w-full max-h-full flex flex-row py-4 px-4 gap-2 overflow-y-scroll scroll-display-none">
            {
                gridColumn >= 1 && (
                    <div className={`h-auto ${ gridColumn === 4 ? 'w-1/4' : gridColumn === 3 ? 'w-1/3' : gridColumn === 2 ? 'w-1/2': 'w-full' } pb-2`}>
                        <div className="w-full flex flex-col gap-3 xl:py-3">
                            {
                                dataColumn.dataCol1.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {item}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
            
            {
                gridColumn >= 2 && (
                    <div className={`h-auto ${ gridColumn === 4 ? 'w-1/4' : gridColumn === 3 ? 'w-1/3' : gridColumn === 2 ? 'w-1/2': 'w-full' } pb-2`}>
                        <div className="w-full flex flex-col gap-3 xl:py-3">
                            {
                                dataColumn.dataCol2.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {item}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }

            
            {
                gridColumn >= 3 && (
                    <div className={`h-auto ${ gridColumn === 4 ? 'w-1/4' : gridColumn === 3 ? 'w-1/3' : gridColumn === 2 ? 'w-1/2': 'w-full' } pb-2`}>
                        <div className="w-full flex flex-col gap-3 xl:py-3">
                            {
                                dataColumn.dataCol3.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {item}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }

            {
                gridColumn === 4 && (
                    <div className="h-auto w-1/4 pb-2">
                        <div className="w-full  flex flex-col gap-3 xl:py-3">
                            {
                                dataColumn.dataCol4.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {item}
                                        </div>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                )
            }
            
        </div>
    )
}

GridColumn.propTypes = {
    // children: propTypes.children,
}