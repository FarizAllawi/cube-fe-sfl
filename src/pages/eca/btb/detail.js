import { toast } from 'react-toastify'
import axios from 'configs/kch-office/axios'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from 'next/link'
import queryString from 'query-string'

import Button from "components/eca/Button"
import LayoutDetail from "components/eca/Layout/Detail"
import Modals from "components/eca/Modals"

import useUser from 'pages/api/eca/user'
import useBTB from 'pages/api/eca/btb'
import useNotification from 'pages/api/eca/notification'

import capitalizeEachWord from 'helpers/capitalizeEachWord'
import formatDate from 'helpers/formatDate'

import PencilDark from '/public/images/svg/eca/pencil-dark.svg'
import TrashDark from '/public/images/svg/eca/trash-dark.svg'
import SearchDark from '/public/images/svg/eca/search-dark.svg'
import errorHandler from 'configs/errorHandler'

const getStatus = (status) => {
    if (status === 0) return {name: 'Paid', color:'bg-green-400'}
    if (status === 1) return {name: 'Approved' ,color:'bg-green-400'}
    if (status === 2) return {name:'On Progress' , color:'bg-yellow-400'}
    if (status === 3) return {name:'Draft', color: 'bg-blue-400'}
    if (status === 4) return {name:'Rejected', color: 'bg-red-400'}
    return {name:'Default', color:'bg-gray-400'}
}

function BadgeStatus(props) {
    return (
        <div className={`px-2 py-1 text-white text-xs font-semibold tracking-wide ${getStatus(props.status).color} rounded-md`}>
            {getStatus(props.status).name}
        </div>
    )
}


function CardClaims(props) {

    const { data } = props
    const [deleteClicked, setDeleteClicked] = useState('')

    return (
        <div className="w-full py-4 px-3 flex flex-row gap-1 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
            <div className="w-9/12 h-full flex flex-col gap-2">
                <div className="w-full flex flex-row uppercase font-light tracking-wide text-blue-300 divide-x-2" style={{ fontSize: '10px' }}>
                        <BadgeStatus type='badge' status={data.status_approval} feature={props.type}/>
                </div>  
                <div className="w-full pl-1 mt-2 text-sm font-semibold text-black dark:text-white leading-4">{data.bc_type.split('-')[1]}</div>
                <div className="w-full pl-1 text-xs text-gray-400 font-light dark:text-gray-300">
                    <div className="w-full text-xs flex flex-row gap-2" style={{ fontSize: '12px'}}>
                        <div>{data.activity_dt !== undefined && data.activity_dt !== null ? formatDate(new Date(Date.parse(data.activity_dt))) : '-'}</div>
                    </div>
                </div>
                <div className="w-full pl-1 text-sm font-normal text-black dark:text-white" style={{ fontSize: '12px'}}>IDR {new Intl.NumberFormat('de-DE').format(data.amount)}</div>
                { data.reject_desc && (<div className="w-full pl-1 text-xs font-medium text-black dark:text-gray-300">Reason: <span className="text-red-400">{data.reject_desc}</span></div>)}
                <div className="w-full flex flex-row place-content-start items-center mt-2 tracking-wide font-normal text-gray-400" style={{ fontSize: '10px'}}>
                    <div className="w-full flex flex-row gap-2">
                        <div>SUPERIOR APPROVAL:</div>
                        <div>{data.superior_dt !== undefined  && data.superior_dt !== null ? formatDate(new Date(Date.parse(data.superior_dt))) : '-'}</div>
                    </div>
                </div>
            </div>
            <div className="w-3/12 h-full flex flex-row gap-1 place-content-end items-center">
                {
                    data.status_approval === 3 ? (
                        <>
                            <div className="w-8 h-8">
                                <Link href={`/eca/btb/action?bcid=${data.bcid}&bhid=${props.bhid}&status=update`}>
                                    <div className="w-full h-full flex place-content-center items-center bg-yellow-400 hover:bg-yellow-500 rounded-full">
                                        <PencilDark className="p-1"/>
                                    </div>
                                </Link>
                            </div>
                            <div className="w-8 h-8 ">
                                <div className="w-full h-full flex place-content-center items-center bg-red-400 hover:bg-red-500 rounded-full" onClick={() => props.deleteClicked(`delete-${data.bcid}`)}>
                                    <TrashDark className="p-1" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-8 h-8">
                            <Link href={`/eca/btb/action?bcid=${data.bcid}&bhid=${props.bhid}&status=view`}>
                                <div className="w-full h-full flex place-content-center items-center bg-blue-400 hover:bg-blue-500 rounded-full">
                                    <SearchDark className="p-1" />
                                </div>
                            </Link>
                        </div>
                    )
                }
                
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {

    return {
         props: { 
        } 
    }
}

export default function BTB(props) {
    const router = useRouter()
    const {bhid} = router.query

    const { insertNotification, sendEmail } = useNotification()
    const { getBTBChildByHeader, getBTBHeadDetail, updateBTBHeader, updateBTBChild, deleteBTBChild, deleteBTBHeader,  isLoading } = useBTB()
    const { getDetailUser, getUserByNik } = useUser()

    const [isFetch, setIsFetch] = useState(false)
    const [user, setUser] = useState({})
    // const [btbHead, setBTBHead] = useState(props.btbHead)
    // const [dataBTB, setDataBTB] = useState(props.childData)
    const [btbHead, setBTBHead] = useState([])
    const [dataBTB, setDataBTB] = useState([])
    const [deleteClicked, setDeleteClicked] = useState('')

    const deleteBTB = async (deleteClicked) => {
        let id = deleteClicked.split('-')[1]
        await deleteBTBChild(id)

        if (dataBTB.length <= 1) {
            await deleteBTBHeader(btbHead.bhid)
            setTimeout(() => router.push('/eca/btb'), 500)
        }
        else setTimeout(() => router.reload(), 500)

    }

    const submitBTBHeader = async (bhid) => {
        let detailUser = await getDetailUser()
        let detailSuperior = await getUserByNik(detailUser.superiorNik)

        if (detailUser.superiorNIK !== undefined) {
            await Promise.all([
                updateBTBHeader({
                    bhid: bhid, uid_user: user.id, status: 2, rating: 0,is_active:1 
                }),
                dataBTB.map( async (item) => {
                    await updateBTBChild({
                        bhid: bhid,
                        bcid: item.bcid,
                        bc_type: item.bc_type,
                        bc_desc: item.bc_desc,
                        amount: parseInt(item.amount),
                        status_approval: 2,
                        superior_approval: 2,
                        superiorName: item.superiorName,
                        reject_desc: "",
                        activity_dt: item.activity_dt,
                        activity_location_name: item.activity_location_name,
                        activity_location_address: item.activity_location_address,
                        business_partner: item.business_partner,
                        business_partner_job_position: item.business_partner_job_position,
                        business_partner_company: item.business_partner_company,
                        business_partner_type: item.business_partner_type,
                        is_active: item.is_active,
                    })
                }),
                insertNotification({
                    nik: detailUser.superiorNIK,
                    header: 'btb-BTB Need Approval',
                    description: `BTB ${bhid} from ${capitalizeEachWord(detailUser.name)} needs your approval`
                }),
                sendEmail({
                    email: detailSuperior.email,
                    header: 'BTB Need Approval',
                    description: `BTB ${bhid} from ${capitalizeEachWord(detailUser.name)} needs your approval`
                })

            ])

            setTimeout(() => {
                toast.success("BTB header submited successfully")
                router.push('/eca/btb')
            }, 500)
        }
        else errorHandler("An Error when submit BTB header")
        
        // setTimeout(() => {  router.push('/btb') }, 350)
    }

    // Backup fetch data if getServerSideProps not working

    useEffect(() => {
        const getDataBTB = async () => {
            let { bhid } = router.query
            let btbHeader = await getBTBHeadDetail(bhid) 
            
            if (btbHeader.length !== 0) {
                let btbChild = await getBTBChildByHeader(bhid)
                let userData = await getDetailUser()
    
                if (userData.id !== undefined) {
                    setUser(userData)
                }
                else errorHandler("There is an error when retrieving user data")
                setBTBHead(btbHeader)
                setDataBTB(btbChild)
            } 
            else router.push('404')
            
        }


        if (btbHead.length === 0 && !isFetch) {
            getDataBTB()
            setIsFetch(true)
        }
    }, [btbHead, dataBTB, getBTBChildByHeader, getBTBHeadDetail, getDetailUser, isFetch, router, router.query])

    return (
        <LayoutDetail title="Detail of BTB" 
                      detailId={router.query.id} 
                      status={btbHead[0]?.status !== undefined  && btbHead[0]?.status === 3 ? 'draft' : 'view'}
                      detailFeature="btb"
                      defaultBackPage='/eca/btb'
                      isSubmitLoading={isLoading}
                      onSubmitClick={() => user.id !== undefined ? submitBTBHeader(bhid) : false}>

            <div className="w-full px-4 mt-20 select-none">
                <p className="font-bold text-base md:text-lg text-center">BTB : {bhid}</p>
            </div>

            <div className="select-none w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max px-4 gap-2 pb-4 overflow-y-scroll scroll-display-none">

                {
                    dataBTB.map((item, index) => {
                        return (
                            <CardClaims key={index} bhid={bhid} deleteClicked={ deleteClicked => setDeleteClicked(deleteClicked)} data={item}/>
                        )
                    })
                }
            </div>  
            {
                (deleteClicked !== '') && (
                    <Modals type='danger' 
                            size='small' 
                            title="Delete BTB"
                            caption="Are you sure you want to delete this BTB?"
                            onClose={() => setDeleteClicked('')}>
                            <div className="w-full flex flex-row gap-2 mt-5 mb-5">
                                <div className="w-1/2 ">
                                    <Button size="flex" className="select-none bg-red-400 hover:bg-red-500 py-3 text-xs xl:text-sm text-white" onClick={() => setDeleteClicked('')}>NO, CANCEL</Button>
                                </div>
                                <div className="w-1/2">
                                    <Button size="flex" className="select-none bg-green-400 hover:bg-green-500 py-3 text-xs xl:text-sm text-white" isLoading={isLoading} onClick={() => deleteBTB(deleteClicked)}>YES, PROCEED!</Button>
                                </div>
                            </div>
                    </Modals>
                )
            }
        </LayoutDetail>
    )
}