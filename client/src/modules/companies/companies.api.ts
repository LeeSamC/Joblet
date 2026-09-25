import { api } from "../../libs/api";

type Company = {
    companyId: string
    ownerId: string
    name: string
    description: string
    createdAt: string
}


type Member = {
    userId: string
    firstName: string
    lastName: string
    username: string
}

export async function getCompanies(){
    return api<{
        companies: Company[]
    }>('/company')
}


export async function getCompanyMembers() {
    return api<{
        companyMembers: Member[]
    }>('/company/companyMembers')
}

export async function getUserCompany(){
    return api<{
        company: Company
    }>('/company/userCompany')
}

export async function addCompany(
    data: {
        ownerId: string
        name: string
        description: string
    }
){
    return api<{
        newCompany: Company
    }>('/company', {
        method: 'POST',
        body: data
    })
}

