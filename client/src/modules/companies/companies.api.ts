import { api } from "../../libs/api";

type Company = {
    companyId: string
    ownerId: string
    name: string
    description: string
    createdAt: string
}

type Listing = {
    listingId: string
    companyId: string
    name: string
    description: string
    createdAt: string
    expiresAt: string | null
}


type Member = {
    userId: string
    firstName: string
    lastName: string
    username: string
}

export type requestStatus = 
    | 'PENDING'
    | 'APPROVED'
    | 'DECLINED'

type Request = {
    requestId: string
    userId: string
    firstName: string
    lastName: string
    username: string
    companyId: string
    status: requestStatus
    createdAt: string
    updatedAt: string
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
        company: Company | null
    }>('/company/userCompany')
}

export async function addCompany(
    data: {
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

export async function addRequest(id: string){
    return api<{
        request: Request
    }>(`/company/${id}/request`, {
        method: 'POST'
    })
}

export async function getRequest(){
    return api<{
        requests: Request[]
    }>(`/company/joinRequest`)
}

export async function getCompanyListings(){
    return api<{
        companyListings: Listing[]
    }>('/company/listings')
}

export async function approveRequest(id: string, requestId: string){
    return api<{
        member: {
            companyId: string;
            userId: string
        }
        request: Request
    }>(`/company/${id}/joinRequest/${requestId}/approve`, {
        method: 'POST'
    })
}

export async function declineRequest(id: string, requestId: string){
    return api<{
        result: Request
    }>(`/company/${id}/joinRequest/${requestId}/decline`, {
        method: 'POST'
    })
}

