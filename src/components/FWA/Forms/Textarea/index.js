import propTypes from 'prop-types'

export default function Textarea(props) {

    const {
        name, 
        value,
        placeholder,
        cols,
        rows,
        labelName,
        className,
        HasError,
        errorResponse,
        errorStatus,
        isRequired,
        isDisabled
    } = props
    

    return (
        <div className={`w-full ${ !HasError && !errorStatus ? 'pt-2 pb-2' : 'pt-2 pb-2 '}`}>
            {
                labelName && (
                    <label htmlFor={name} className="text-sm text-gray-500 dark:text-white font-semibold">{labelName}</label>
                )
            }
            <textarea name={name} 
                      value={value} 
                      cols={cols}
                      rows={rows}
                      onChange={ (event) => !isDisabled && props.onChange({target: {name:name, value: event.target.value}}) }
                      className={` w-full py-4 px-4 
                                   focus:outline-none
                                   placeholder:text-xs placeholder:font-light placeholder:text-gray-300  
                                   bg-white dark:bg-gray-700 rounded-xl  border border-gray-300
                                   text-gray-500 dark:text-white text-xs tracking-wide drop-shadow-md`}
                      placeholder={placeholder}
                      disabled={isDisabled} />
        </div>
    )
}

Textarea.defaultProps = {
    placeholder: "Please type here...",
    errorResponse: "Please match the requested format.",
    isDisabled: false
}

Textarea.propTypes = {
    value: propTypes.string.isRequired,
    placeholder: propTypes.string,
    name: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    className: propTypes.string,
    rows: propTypes.number,
    cols: propTypes.number,
    isRequired: propTypes.bool,
    isDisabled: propTypes.bool,
    errorResponse: propTypes.string,
    errorStatus: propTypes.bool,
}