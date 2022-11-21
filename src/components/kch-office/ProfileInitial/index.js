import propTypes from 'prop-types'

export default function ProfileInitial(props) {
    const { name, width, height, className } = props

    const GetInitialName = (fullname) => {
        let initialName = fullname?.split(" ")
        
        if (initialName?.length === 1) {
            return (
                <div className={`font-medium  ${className ? className : 'text-lg'} text-white`}>{initialName[0][0]}</div>
            )
        }
        else if (initialName?.length === 2) {
            return (
                <div className={`font-medium ${className ? className : 'text-base'} text-white`}>{initialName[0][0]}{initialName[1][0]}</div>
            )
        }
        else {
            return (
                <div className={`font-medium ${className ? className : 'text-sm'} text-white`}>{initialName[0][0]}{initialName[1][0]}{initialName[2][0]}</div>
            )
        }
    }

    return (
        <>
            <div className={`flex place-content-center items-center w-${width} h-${height} rounded-full bg-green-500`}>
                {
                    name !== undefined && (
                        GetInitialName(name)
                    )
                }
            </div>
        </>
    )

}

ProfileInitial.propTypes = {
    name: propTypes.string,
    width: propTypes.oneOfType([propTypes.string, propTypes.number]),
    height:  propTypes.oneOfType([propTypes.string, propTypes.number]),
    className:propTypes.string,
}