export default function BadgeStatus(props) {

    const getMileageStatus = (status) => {
        if (status === 0) return {name: 'Paid' ,color:'bg-green-400'}
        if (status === 1) return {name: 'Approved' ,color:'bg-green-400'}
        if (status === 2) return {name:'Progress' , color:'bg-yellow-400'}
        if (status === 3) return {name:'Progress' , color:'bg-yellow-400'}
        if (status === 4) return {name:'Draft', color: 'bg-gray-400'}
        if (status === 5) return {name:'Rejected', color: 'bg-red-400'}
        return {name:'Default', color:'bg-gray-400'}
    }
    
    const getOtherStatus = (status) => {
        if (status === 0) return {name: 'Paid' ,color:'bg-green-400'}
        if (status === 1) return {name: 'Approved' ,color:'bg-green-400'}
        if (status === 2) return {name:'Progress' , color:'bg-yellow-400'}
        if (status === 3) return {name:'Draft', color: 'bg-gray-400'}
        if (status === 4) return {name:'Rejected', color: 'bg-red-400'}
        return {name:'Default', color:'bg-gray-400'}
    }
    
    const getPaymentApprovalStatus = (status) => {
        if (status === 1) return {name: 'Paid' ,color:'bg-green-400'}
        if (status === 2) return {name: 'Approved' ,color:'bg-green-400'}
        if (status === 3) return {name:'Progress' , color:'bg-yellow-400'}
        if (status === 5) return {name:'Rejected', color: 'bg-red-400'}
        if (status === 5) return {name:'Pending', color: 'bg-gray-400'}
    }

    return (
        <>
        {
            props.type === 'badge' ? (
                <div style={{ fontSize: "10px" }} className={`px-2 py-1 text-white text-xs font-medium tracking-wide ${props.feature === 'other' || props.feature === 'header' || props.feature === 'btb' ? getOtherStatus(props.status).color : getMileageStatus(props.status).color} rounded-md`}>
                    {props.feature === 'other' || props.feature === 'header' || props.feature === 'btb' ? getOtherStatus(props.status).name : getMileageStatus(props.status).name}
                </div>
            ) : props.type === 'status' && (
                <>
                    {props.feature === 'other' || props.feature === 'header' || props.feature === 'btb' ? getOtherStatus(props.status).name : props.feature === 'payment' ? getPaymentApprovalStatus(props.status) : getMileageStatus(props.status).name}
                </>
            )
        }
        </>
        
    )
}
