import { isAxiosError } from "axios"

const handleError=(error:unknown)=>{
    if(isAxiosError(error) || error instanceof Error){
        return error.message
    }
    return "Something went wrong"
    
}

export {handleError}