import axios from "configs/kch-office/axios"
import { useEffect } from "react"
import useForm from "helpers/useForm"

import Layout from "components/eca/Layout/List"
import Dropdown from "components/eca/Dropdown"
import GridColumn from "components/eca/Grid/Column"
import Input from 'components/eca/Forms/Input'

import SearchGray from '/public/images/svg/eca/search-gray.svg'



export const getServerSideProps = async (context) => {
    // const {users} = store.getState()

    const response = await axios.get(`api/Faq/getAll`)
                          .then(res => {
                             return res
                          })
                          .catch(err => {
                             console.log(err)
                          })

    // Pass data to the page via props
    if (response?.status >= 400 || response?.status === undefined) return { props: { data: [] } }
    return { props: { data: response.data} }
}


export default function Faq(props) {

    const [state, setState, newState] = useForm({
        faq: props.data,
        search: '',
        keyClicked: ''
    })

    // Backup fetch if serverside not working
    const getFaq = async() => {
        let response = await axios.get(`api/Faq/getAll`)
                                        .then(res => {
                                            return res
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })

        if (response !== undefined) {
            newState({
                faq: response.data
            })
        }
    }

    const searchFaq = () => {
        
    }

    useEffect(() => {
        if (state.faq.length === 0) getFaq()

    }, [state.faq])

    return (
        <Layout title="FAQ's" defaultBackPage="/eca">
            <div className="w-full px-4 mt-20 select-none flex flex-col place-content-center items-center">
                <p className="font-semibold text-center text-base md:text-xl">Top Questions</p>
                <p className="font-light text-center text-sm text-blue-400">Frequents Question we Get</p>
                <p className="w-72 text-sm text-center text-gray-300 mt-3">
                    If we skipped a question be sure to send us a support question, we are always here to answer your questions.
                </p>

                <div className="w-full xl:w-1/3 mt-4">
                    <Input type="text" 
                            name='search' 
                            value={state.search} 
                            placeholder="what are you looking for?"
                            onChange={value => serachFaq(value)}
                            append={<SearchGray/>}
                            isLoading={props.isLoading}/>
                </div>
            </div>
            
            <GridColumn>
                {
                    state.faq?.map((item, index) => {
                        return (
                            <Dropdown key={index} 
                                        title={item.title} 
                                        name={`col1-${item.title}`} 
                                        clicked={state.keyClicked} 
                                        onClick={click => newState({ keyClicked: click }) }>
                                <div className="w-full px-4 flex flex-col gap-2">
                                    <div className="w-full py-4 px-5 bg-blue-400 rounded-3xl mb-10 text-white text-sm font-normal leading-normal tracking-wide">
                                        {item.detail}
                                    </div>
                                </div>
                            </Dropdown>
                        )
                    })
                }
            </GridColumn>
        </Layout>
    )
}