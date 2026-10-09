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
    status: 'ACTIVE' | 'EXPIRED' | 'DISABLED'
    createdAt: string
    expiresAt: string | null
}

type Application = {
    applicationId: string
    applicantId: string
    firstName: string
    lastName: string
    username: string
    listingId: string
    listingName: string
    coverLetter: string
    resume: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
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

export async function getCompanyApplications(){
    return api<{
        companyApplications: Application[]
    }>('/company/applications')
}

export function getCompanyApplication(id: string) {
    return api<{
        companyApplication: Application
    }>(`/company/${id}/application`)
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

export async function approveApplication(id: string){
    return api<{
        approvedApplication: Application
    }>(`/application/${id}/approve`, {
        method: 'PATCH'
    })
}

export async function rejectApplication(id: string){
    return api<{
        rejectedApplication: Application
    }>(`/application/${id}/reject`, {
        method: 'PATCH'
    })
}

