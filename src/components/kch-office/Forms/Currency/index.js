import propTypes from 'prop-types'
import {useEffect, useState} from 'react'

export default function Currency(props) {
    const {
        value,
        placeholder,
        name,
        append,
        className,
        errorResponse,
        labelName,
        errorStatus,
        isRequired,
        isDisabled, 
        currency
    } = props

    const [HasError, setHasError] = useState(null)
    const [inputValue, setInputValue] = useState(0)

    const onChange = (event) => {
        if (!isDisabled) {
            let stateNumber = inputValue
            let number = event.target.value

            if (number !== "") {
                if (number?.indexOf(".") !== -1) {
                    number = number.split(".")
                    number = number.join("")
                }
            }
            else number = 0
            
            setInputValue(number)
            const target = {
                target: {
                    name: name,
                    value: parseInt(number),
                    validation: event.target.validation
                }
            }
            props.onChange(target)
        }
    }

    useEffect(() => {
        if (value !== undefined && value !== 0) setInputValue(value)
    },[value])
    
    return (
        <div className={`w-full ${ !HasError && !errorStatus ? 'pt-2 pb-2' : 'pt-2 pb-2 '}`}>
            {
                labelName && (
                    <label htmlFor={name} className="text-sm text-gray-500 dark:text-white font-semibold">{labelName}</label>
                )
            }
            <div className={`flex flex-row place-content-start gap-2 items-center py-4 px-4 
                            bg-white dark:bg-gray-700 rounded-xl  border border-gray-300 ${ HasError || errorStatus ? 'outline-none ring-1 border-orange-300 ring-orange-300 ' : ''} 
                             text-xs tracking-wide drop-shadow-md`}>

                <div className={`w-full flex flex-row`}>
                    <div className="w-auto mr-1 text-gray-500 dark:text-white font-normal text-xs tracking-wide">
                        {currency}
                    </div>
                    <div className="w-full">
                        <input  name={name}
                                    type='text'
                                    className={[`
                                        w-full
                                        focus:outline-none
                                        placeholder:text-xs placeholder:font-light placeholder:text-gray-300  
                                        bg-transparent 
                                        text-gray-500 dark:text-white font-normal text-xs tracking-wide
                                        `, className].join(" ")}
                                    value={`${ new Intl.NumberFormat('de-DE').format(parseInt(value) === 'Nan' ? 0 : parseInt(value)) }`}
                                    placeholder={placeholder}
                                    onChange={onChange}
                                    disabled={isDisabled}
                                    />
                    </div>
                </div>
                {
                    (append || isRequired) && (
                        <>
                            <div className="w-6 h-6 ml-2 h-full flex flex-row place-content-end items-center">
                                {
                                    isRequired && (
                                        <div className={`ml-1 flex place-content-end items-center`}>
                                            <p className='text-gray-500 '>required</p>
                                        </div>
                                    )
                                }
                                {
                                    append && (
                                        <div className={`w-6 h-6 flex place-content-end items-center`}>
                                            {append}
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    )
                }
            </div>
            {
                ( HasError || errorStatus) && (
                    <div className='mt-0.5 ml-3 absolute text-orange-300 font-base text-xs'>
                        { HasError ? HasError : errorResponse }
                    </div>
                )
            }
        </div>
    )
}

Currency.defaultProps = {
    currency: "IDR",
    placeholder: "Please type here...",
    errorResponse: "Please match the requested format.",
    isDisabled: false
}

Currency.propTypes = {
    name: propTypes.string.isRequired,
    currency: propTypes.string.isRequired,
    value:  propTypes.number,
    onChange: propTypes.func.isRequired,
    labelName: propTypes.string,
    className: propTypes.string,
    validation: propTypes.bool,
    errorResponse: propTypes.string,
    errorStatus: propTypes.bool,
    isRequired: propTypes.bool,
    isDisabled: propTypes.bool,
    append: propTypes.object,
}