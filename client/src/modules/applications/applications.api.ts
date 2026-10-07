import { api } from "../../libs/api";

export type CreatedApplication = {
    applicationId: string
    applicantId: string
    listingId: string
    coverLetter: string
    resume: string
    status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED'
    createdAt: string
}

export type SendApplicationData ={
    listingId: string
    coverLetter: string
    resume: string
}

export function sendApplication(
    data: SendApplicationData
){
    return api<{
        application: CreatedApplication
    }>(`/application/${data.listingId}/apply`, {
        method: 'POST',
        body: data
    })
}