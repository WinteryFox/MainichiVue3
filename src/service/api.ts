import Axios, {AxiosInstance} from "axios";

const apiUri: string = process.env.NODE_ENV === "production" ? "https://penweb.app/api" : "http://localhost:8181/api"
const api: AxiosInstance = Axios.create({
    baseURL: apiUri
})

export {api, apiUri}
