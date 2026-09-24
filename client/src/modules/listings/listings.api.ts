import { api } from "../../libs/api";

export type listingType = {
    listingId: string
    companyId: string
    name: string
    description: string
}

export async function getListing(){
    return api<{
        listings: listingType[]
    }>('/listing')
}