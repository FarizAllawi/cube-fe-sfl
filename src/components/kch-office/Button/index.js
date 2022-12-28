import { useEffect } from 'react'
import proptTypes from 'prop-types'
import Link from 'next/link'

export default function Button(props) {

    const {
        type,
        href,
        target,
        color,
        size,
        appendIcon,
        prependIcon,
        isDisabled,
        isLoading,
    } = props
    

    const className = [props.className]

    if (type === 'primary') className.push('border-2 border-opacity-0 hover:bg-opacity-90 text-white')
    if (type === 'secondary') className.push('bg-transparent text-green-900 border-2 border-green-900')

    if (size === 'small') className.push(` text-xs sm:text-sm inline-block py-1.5 ${isLoading || appendIcon ? 'px-1.5' : 'px-3'}`)
    if (size === 'medium') className.push(`inline-block py-2 ${isLoading || appendIcon ? 'px-5' : 'px-7'}`)



    const onClick = () => {
        if (props.onClick && !isLoading) props.onClick()
    }

    return (
        <div className={`select-none rounded-full font-semibold cursor-pointer ${ className !== undefined ? className.join(" ") : 'bg-green-900'}`} disabled={isDisabled} onClick={onClick}>
            <div className='flex flex-row place-content-center items-center gap-2 '>
                { 
                    prependIcon && (<div>{prependIcon}</div>)
                }
                <div>{props.children}</div>
                { 
                    isLoading ? (
                        <div className='transition-all duration-300'>
                            <svg className="animate-spin w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        appendIcon && (<div>{appendIcon}</div>)
                    )
                }
            </div>
        </div>
    )

}

Button.defaultProps = {
    type: 'primary',
    size: 'small',
    isDisabled: false,
    // className: 'bg-gray-400 hover:bg-gray-300'

}

Button.propTypes = {
    type: proptTypes.oneOf(['primary','secondary']),
    href: proptTypes.string,
    onClick: proptTypes.func,
    target: proptTypes.string,
    className: proptTypes.string,
    prependIcon: proptTypes.object,
    appendIcon: proptTypes.object,
    size: proptTypes.oneOf(['small','medium','large','flex']),
    isDisabled: proptTypes.bool,
    isLoading: proptTypes.bool

}