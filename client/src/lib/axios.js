import _axios from 'axios'

export const axios = _axios.create()
export const authorizedAxios = _axios.create({
    withCredentials: true,
})
