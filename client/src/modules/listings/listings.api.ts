import { api } from "../../libs/api";

export type listingType = {
    listingId: string
    companyId: string
    name: string
    companyName: string
    description: string
}

export async function getListings(){
    return api<{
        listings: listingType[]
    }>('/listing')
}

export async function  getListing(id: string){
    return api<{
        listing: listingType
    }>(`/listing/${id}`)
}

export async function addListing(
    data:{
        name: string
        description: string
    }
){
    return api<{
        listings: listingType
    }>('/listing', {
        method: 'POST',
        body: data
    })
}