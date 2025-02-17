export interface LoginRequestData{
  username:string,
  password:string
}


export type LoginResponseData = ApiResponseData<{
  id:string 
  token:string 
  username:string
}>