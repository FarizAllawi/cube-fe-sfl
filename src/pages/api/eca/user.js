import axios from 'configs/eca/axios'
import { useRouter } from 'next/router'
import { useState , useEffect} from 'react'
import errorHandler from 'configs/errorHandler'

export default function useUser() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState({})
    const [isFetch, setIsFetch] = useState(false)

    const getUser = async () => {
        let user = await fetch('/api/auth/user').then(res => {return res.json()}).catch(err => {})
        setUser(user.data)
        return user.data
    }

    const getUserByNik = async (nik) => {
        let user = {}
        setIsLoading(true)
        await axios.get(`api/User/get/byNik?getNik=${nik}`)
                    .then(res => {
                        user = res.data[0]
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                        setIsLoading(false)
                    })
        return user
    }
    
    const getDetailUser = async (id) => {
        let user = {}
        let userSession = await getUser()

        setIsLoading(true)
        // await axios.post(`api/User/login?getEmail=${userSession.email}&getPassword=${userSession.password}`)
        await axios.get(`api/User/get/byEmail?getEmail=${userSession.email}`)
        // await axios.get(`api/User/get?getId=${userSession.id}`)
                    .then(res => {
                        user = res.data[0]
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                        setIsLoading(false)
                    })
        return user
    }

    const login = async ({setErrors, ...props}) => {
        let user = {}
        setIsLoading(true)

		// Request login and get user credential
		const response = await axios.post(`api/User/login`, props)
        .then(res => {
            return true
            setIsLoading(false)
        })
        .catch(err => {
            setIsLoading(false)
            return false
        })

        return response
    }

    const loginTesting = async ({setErrors, ...props}) => {
        let user = {}
        setIsLoading(true)

		// Request login and get user credential
		const response = await axios.post(`api/User/get/byEmail?getEmail=${props.email}`)
                                    .then(res => {
                                        user = {
                                            id: res.data[0].id,
                                            nik: res.data[0].nik,
                                            name: res.data[0].name,
                                            email: props.email,
                                            password: props.password,
                                        }
                                        setIsLoading(false)
                                        return {
                                            status: res.status,
                                            data: {
                                                nama_rekening: res.data[0].nama_rekening,
                                                no_rekening: res.data[0].no_rekening
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        setIsLoading(false)
                                    })
                                    
        if (response?.status === 200) {
            await fetch('/api/auth/login', {
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST'
            })

            if ((response.data.nama_rekening === null || response.data.nama_rekening === undefined) &&
                (response.data.no_rekening === null || response.data.no_rekening === undefined)) {
                    router.push('/profile')
            }
            else router.push('/')
        }
        else errorHandler('Wrong email or password')
    }

    const logout = async () => {
        await fetch('/api/auth/logout')
        router.push('/login')
    }

    const updateUser = async ({setErrors, ...props}) => {
        let status = false
        setIsLoading(true)
        await axios.put('/api/User/update', props)
                   .then(res => {
                        status = true
                        setIsLoading(false)
                   })
                   .catch(err => {
                        status = false
                        setIsLoading(false)
                   })

        return status
    }

    useEffect(() => {

        if (user?.isLogin === undefined && !isFetch) {
            getUser()
            setIsFetch(true)
        } 
        else setIsFetch(false)


    }, [isFetch, router, user?.isLogin])

    return {
        isLoading, user, loginTesting,getUserByNik, getDetailUser, logout, login, updateUser
    }
}