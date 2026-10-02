import { api } from "../../libs/api";

export type listingType = {
    listingId: string
    companyId: string
    name: string
    companyName: string
    description: string
    expiresAt: string | null
    createdAt: string
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
        expiresAt: string | null
    }
){
    return api<{
        listings: listingType
    }>('/listing', {
        method: 'POST',
        body: data
    })
}

export async function editListing(
    data: {
        name: string
        description: string
        expiresAt: string | null
    },
    id: string
){
    return api<{
        listing: listingType
    }>(`/${id}/edit`, {
        method: 'PATCH',
        body: data
    })
}

export async function disableListing(id: string){
    return api<{
        listing: listingType
    }>(`/${id}/disable`, {
        method: 'PATCH'
    })
}

export async function enableListing(id: string){
    return api<{
        listing: listingType
    }>(`/${id}/enable`,{
        method: 'PATCH'
    })
}