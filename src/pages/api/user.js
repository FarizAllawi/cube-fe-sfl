import useSWR from 'swr'
import CryptoJS from 'crypto-js'
import axios from 'configs/kch-office/axios'
import { useRouter } from 'next/router'
import { useState , useEffect } from 'react'
import errorHandler from 'configs/errorHandler'

export default function useUser() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState({})
    const [isFetch, setIsFetch] = useState(false)

    const { updateUserSession } = useSWR( 
        user?.isLogin !== undefined ? 
            '/api/auth/user'
        : null,

        async (url) => {
            let user = await fetch(url).then(res => {return res.json()})
            setUser(user.data)
        },

        { revalidateOnFocus: false, refreshWhenHidden: false, refreshWhenOffline: false, refreshInterval: 60000 }
    )

    const getUser = async () => {
        let user = await fetch('/api/auth/user').then(res => {
            return res.json()
        }).catch(err => {})
        setUser(user.data)
        return user.data
    }

    const getUserByNik = async (nik) => {
        let userSession = await getUser()

        setIsLoading(true)
        // await axios.post(`api/User/login?getEmail=${userSession.email}&getPassword=${userSession.password}`)
        const response = await axios.get(`api/user/nik/${nik}`, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            return res.data
        })
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        return response
    }
    
    const getDetailUser = async (email) => {email
        let userSession = await getUser()

        setIsLoading(true)
        // await axios.post(`api/User/login?getEmail=${userSession.email}&getPassword=${userSession.password}`)
        const response = await axios.get(`api/user?email=${userSession?.email}`, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            setUser(res.data)
            return res.data
        })
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        return response
    }

    const login = async ({setErrors, ...props}) => {
        let user = {}
        setIsLoading(true)
        setErrors([])

        let isDefaultPassword = props.password === '20221205' ? true : false
        let key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_HASH_KEY)
        let iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_IV_KEY)

        let encryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(props.password), key, {iv:iv, mode:CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
        props['password'] = encryptedPassword.ciphertext.toString(CryptoJS.enc.Base64)
		// Request login and get user credential
		const response = await axios.post(`api/auth/login`, props)
                                    .then(res => {
                                        console.log(res)
                                        user = {
                                            nik: res.data.user.nik,
                                            name: res.data.user.name,
                                            email: res.data.user.email,
                                            password: props.password,
                                            photo_profile: res.data.user.photo_profile,
                                            golongan: res.data.user.golongan,
                                            token: res.data.token,
                                            uid_user: res.data.user.uid_user,
                                            defaultPassword: isDefaultPassword
                                        }
                                        setIsLoading(false)
                                        return {
                                            status: res.status,
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        setIsLoading(false)
                                        if (err.response.status >= 400 && err.response.data.errors === undefined) errorHandler(err.response.data.message)
                                        setErrors(err.response.data.errors)
                                    })
                                    
        if (response?.status === 200) {
            await fetch('/api/auth/login', {
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST'
            })

            if (isDefaultPassword) router.push('/change-password')
            else router.push('/');
        }
    }

    const logout = async () => {
        await fetch('/api/auth/logout')
        router.push('/login')
    }

    const updateUser = async ({...props}) => {
        let userSession = await getUser()
        setIsLoading(true)
        const response = await axios.put('/api/user', props, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            return res.status
        })
        .catch(err => {
            setIsLoading(false)
            errorHandler("Failed to update user")
            return err.response.status
        })

        return response
    }

    useEffect(() => {

        if (user?.isLogin === undefined && !isFetch) {
            getUser()
            setIsFetch(true)
        } 
        // else setIsFetch(false)

    }, [router, user, setUser, isFetch])

    return {
        isLoading, user, setUser, getUser,  getDetailUser, getUserByNik, logout, login, updateUser
    }
}