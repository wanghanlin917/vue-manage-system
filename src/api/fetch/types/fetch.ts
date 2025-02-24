export interface FetchUserRequestData{
  id?:string,
  
}

export interface FetchRoleRequestData{
  id?:string,
  name:string,
  key:string,
  status:boolean
}


export type FetchUserResponse = ApiResponseData<any>

export type FetchRoleResponse = ApiResponseData<any>