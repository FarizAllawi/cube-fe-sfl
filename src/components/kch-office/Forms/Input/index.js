import { parse } from 'date-fns'
import propTypes from 'prop-types'
import {useEffect, useState} from 'react'

export default function Input(props) {
    const {
        value,
        type, 
        pattern,
        placeholder,
        name,
        append,
        className,
        errorResponse,
        labelName,
        range,
        errorStatus,
        isRequired,
        isDisabled
    } = props

    const [HasError, setHasError] = useState(null)

    let patternValidate = ""
    if (type === "text") patternValidate = pattern !== "" ? new RegExp(pattern) : new RegExp("")
    if (type === "password") patternValidate = pattern !== "" ? new RegExp(pattern) : new RegExp("")
    if (type === "email") patternValidate = pattern === "" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : new RegExp(pattern) 
    if (type === "number") patternValidate = pattern !== "" ? new RegExp(pattern) : "[0-9]*"

    const onChange = (event) => {
        if (!isDisabled) {

            type === 'number' ?  parseInt(value) === 'Nan' ? 0 : parseInt(value) : value
            const target = {
                target: {
                    name: name,
                    value: event.target.value,
                    validation:  event.target.validation
                }
            }
    
            if (type === "text" || type === "email" || type === "password") {
                if (!patternValidate.test(event.target.value)){
                    setHasError(errorResponse)
                    target.target.validation = true
                } 
                else {
                    setHasError(null)
                    target.target.validation = false
                }
            }
    
            if (type === "number") {
                let value = event.target.value
                if (parseInt(value) === 'Nan') value = 0
                else parseInt(value)

                if (!event.target.validity.valid) setHasError(errorResponse)
                else {
                    props.onChange(target)
                    setHasError(null)
                }
                
                if (range) {
                    const rangeNumber = range.split(",")
                    if (!(parseInt(event.target.value) >= parseInt(rangeNumber[0]) && parseInt(event.target.value) <= parseInt(rangeNumber[1]))) {
                        setHasError(`${rangeNumber[0]} - ${rangeNumber[1]}`)
                    }
                    else {
                        props.onChange(target)
                        setHasError(null)
                    }
                }
    
            } else {
                props.onChange(target)
            }
        }
    }

    useEffect(() => {}, [HasError, errorStatus])

    return (
        <div className={`w-full ${ !HasError && !errorStatus ? 'pt-2 pb-2' : 'pt-2 pb-2 '}`}>
            {
                labelName && (
                    <label htmlFor={name} className="text-sm text-gray-500 font-semibold">{labelName}</label>
                )
            }
            <div className={`flex flex-row place-content-start gap-2 items-center py-4 px-4 
                             bg-white rounded-xl
                             text-xs tracking-wide
                            ${
                                (type === 'number' && parseInt(value) !== 'Nan' && parseInt(value) !== 0 && (HasError === null)) ||
                                (type !== 'number' && value !== '' && (HasError === null)) ? (
                                    'outline-none ring-1 border border-emerald-500 ring-emerald-500'
                                ) : (type === 'number' && parseInt(value) !== 'Nan' && parseInt(value) !== 0 && (HasError !== null)) ||
                                    (type !== 'number' && value !== '' && (HasError !== null)) ? (
                                    'outline-none ring-1 border border-amber-400 ring-amber-400'
                                ) : (
                                    'outline-none ring-1 border border-gray-200 ring-gray-200'
                                )
                            }
                            `}>

                <div className={`${append || isRequired ? 'w-full' : 'w-full'}`}>
                    <input  name={name}
                            type={type === 'number' ?  'text' : type === 'email' ?  'email' :  type === 'password' ?  'password' : 'text'}
                            className={[`
                                w-full
                                focus:outline-none
                                placeholder:text-xs placeholder:xl:text-sm placeholder:font-light placeholder:text-gray-300  
                                bg-transparent
                                text-gray-400 font-medium text-xs xl:text-sm tracking-wide
                                `, className].join(" ")}
                            value={type === 'number' ?  value === '' || parseInt(value) === 'Nan' ? 0 : parseInt(value) : value}
                            placeholder={placeholder}
                            onChange={onChange}
                            disabled={isDisabled}
                            />
                </div>
                {
                    (append || isRequired) && (
                        <>
                            <div className="w-6 h-6 ml-2 flex flex-row place-content-end items-center">
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
                    <div className='mt-0.5 ml-3 absolute text-amber-400 font-base' style={{ fontSize: '9px' }}>
                        { HasError ? HasError : errorResponse }
                    </div>
                )
            }
        </div>
    )
}

Input.defaultProps = {
    type: "text",
    placeholder: "Please type here...",
    pattern:"",
    errorResponse: "Please match the requested format.",
    isDisabled: false
}

Input.propTypes = {
    name: propTypes.string.isRequired,
    type: propTypes.oneOf(['password','number','text', 'email']),
    value:  propTypes.oneOfType([propTypes.string, propTypes.number]),
    onChange: propTypes.func.isRequired,
    labelName: propTypes.string,
    range: propTypes.string,
    className: propTypes.string,
    pattern: propTypes.string,
    validation: propTypes.bool,
    errorResponse: propTypes.string,
    errorStatus: propTypes.bool,
    isRequired: propTypes.bool,
    isDisabled: propTypes.bool,
    append: propTypes.object,
}