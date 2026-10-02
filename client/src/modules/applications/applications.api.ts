import { api } from "../../libs/api";

export type Application = {
    applicationId: string
    applicantId: string
    firstName: string
    lastName: string
    username: string
    listingId: string
    listingName: string
    companyId: string
    companyName: string
    coverLetter: string
    resume: string
    status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED"
    createdAt: string
}

export function getApplications() {
    return api<{
        applications: Application[]
    }>('/application')
}