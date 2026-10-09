import {Link} from "react-router-dom"
import { useState } from "react"
import { BriefcaseBusiness, Plus, ArrowRight, PauseCircle, LoaderCircle, PlayCircle, Clock3, Pencil, X, Save } from "lucide-react"

import { useDisableListing, useEditCompanyListing, useEnableListing, useGetCompanyListings } from "../hooks/useCompanies"

export default function CompanyListingsPage() {

    const {data, isLoading, isError} = useGetCompanyListings()
    const disableListing = useDisableListing()
    const enableListing = useEnableListing()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [expiresAt, setExpiresAt] = useState('')

    const [editingListing, setEditingListing] = useState<{
        listingId: string
        name: string
        description: string
        expiresAt: string | null
    } | null>(null)

    const [editError, setEditError] = useState('')

    const editListingMutation = useEditCompanyListing()

    function openEditModal(listing: {
        listingId: string
        name: string
        description: string
        expiresAt: string | null
    }) {
        setEditingListing(listing)
        setName(listing.name)
        setDescription(listing.description)
        setExpiresAt(listing.expiresAt?.slice(0, 10) ?? "")
        setEditError("")
    }

    function handleDisable(listingId: string){
        disableListing.mutate({listingId})
    }

    function handleEnable(listingId: string){
        enableListing.mutate({listingId})
    }

    function handleEditListing(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()

        if(!editingListing) return

        setEditError('')

        editListingMutation.mutate(
            {
                listingId: editingListing.listingId,
                data: {
                    name: name.trim(),
                    description: description.trim(),
                    expiresAt: expiresAt || null
                }
            },

            {
                onSuccess: () => {
                    setEditingListing(null)
                },
                onError: () => {
                    setEditError('Failed to update listing. Please try again')
                }
            }
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                            <BriefcaseBusiness size={24} />
                        </div>

                        <h1 className="text-3xl font-bold">
                            Job listing
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage your company's job opportunities
                        </p>
                    </div>

                    <Link
                        to="/company/listings/create"
                        className="flex items-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                        <Plus size={18}/>
                        Create Listing
                    </Link>
                </div>

                {isLoading && (
                    <div className="rounded-2xl border bg-white p-10 text-center">
                        <p className="text-gray-500">
                            Loading listings...
                        </p>
                    </div>
                )}

                {isError && (
                    <div className="rounded-2xl border bg-white p-10 text-center">
                        <p className="text-red-600">
                            Failed to load listings
                        </p>
                    </div>
                )}

                {!isLoading && !isError && data?.companyListings.length === 0 && (
                    <div className="rounded-2xl border bg-white p-12 text-center">
                        <BriefcaseBusiness size={48} className="mx-auto text-gray-400" />

                        <h2 className="mt-4 text-xl font-semibold">
                            No listings yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Create your first job listing
                        </p>

                        <Link
                            to="/company/listings/create"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 font-semibold text-white"
                        >
                            Create Listing
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}

                {!isLoading && !isError && data?.companyListings && data.companyListings.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.companyListings.map((listing) => (
                            <div
                                key={listing.listingId}
                                className=" flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" 
                            >   

                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                                        <BriefcaseBusiness size={22} />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openEditModal(listing)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200
                                            bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200
                                            hover:border-gray-300 hover:bg-gray-50 hover:shadow active:scale-[0.97]
                                        "
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit

                                    </button>
                                </div>

                                

                                <h2 className="text-xl font-bold">
                                    {listing.name}
                                </h2>

                                <p className="mt-1 text-xs text-gray-400">
                                    Expires At: {listing.expiresAt ?? 'No expiration date'}
                                </p>

                                <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                                    {listing.description}
                                </p>

                                <div className="mt-auto flex items-center justify between gap-3 border-t border-gray-100 pt-4">
                                    {listing.status === 'ACTIVE' ? (
                                        <button
                                            type="button"
                                            disabled={disableListing.isPending || enableListing.isPending}
                                            onClick={() => handleDisable(listing.listingId)}
                                            className="
                                                inline-flex min-w-36 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all duration-200 ease-out hover:border-red-300 hover:bg-red-50 hover:shadow active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
                                            " 
                                        >
                                            {disableListing.isPending ? ( 
                                                <> 
                                                    <LoaderCircle 
                                                        className="h-4 w-4 animate-spin" 
                                                    /> 
                                                    <span>
                                                        Disabling...
                                                    </span> 
                                                </> 
                                            ) : ( 
                                                <> 
                                                    <PauseCircle 
                                                        className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" 
                                                    /> 
                                                    
                                                    <span>Disable listing</span> 
                                                </> 
                                            )}
                                        </button>
                                    ): listing.status === 'DISABLED' ? (
                                        <button 
                                            type="button" 
                                            disabled={enableListing.isPending || disableListing.isPending} 
                                            onClick={() => handleEnable(listing.listingId)} 
                                            className=" inline-flex min-w-36 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200 ease-out hover:border-emerald-300 hover:bg-emerald-50 hover:shadow active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 " 
                                        > 
                                            {enableListing.isPending ? ( 
                                                <> 
                                                    <LoaderCircle className="h-4 w-4 animate-spin" /> 
                                                    <span>Enabling...</span> 
                                                </> 
                                            ) : ( 
                                                <> 
                                                    <PlayCircle 
                                                        className="h-4 w-4 transition-transform duration-200" 
                                                    /> 
                                                        <span>Enable listing</span> 
                                                </> 
                                            )} 
                                        </button>
                                    ): (
                                        <div 
                                            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700"
                                        > 
                                            <Clock3 className="h-4 w-4" /> 
                                            <span>Listing expired</span> 
                                        </div>
                                    )}

                                    


                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {editingListing && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if(event.target === event.currentTarget && !editListingMutation.isPending) {
                            setEditingListing(null)
                        }
                    }}
                >

                    <div
                        role="dialog"
                        aria-modal='true'
                        aria-labelledby="edit-listing-title"
                        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-center justify-between border-b  border-gray-100 px-6 py-5">
                            <div>
                                <h2
                                    id="edit-listing-title"
                                    className="text-xl font-bold text-gray-900"
                                >
                                    Edit job listing
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update the details of your job opportunity
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={editListingMutation.isPending}
                                onClick={() => setEditingListing(null)}
                                aria-label="Close edit modal"
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                            >
                                <X className="h-5 w-5"/>
                            </button>
                        </div>

                        <form
                            onSubmit={handleEditListing}
                        >
                            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
                                {editError && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                    >
                                        {editError}
                                    </div>
                                )}
                                
                                <div>
                                    <label
                                        htmlFor="listing-name"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Job title
                                    </label>

                                    <input
                                        id="listing-name"
                                        type="text"
                                        required
                                        minLength={3}
                                        maxLength={30}
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10" 
                                        placeholder="eg. Frontend Developer"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="listing-description"
                                        className="mb-2 block text-sm font-semibold text-gray-700" 
                                    >
                                        Job description
                                    </label>

                                    <textarea
                                        id="listing-description"
                                        required
                                        minLength={100}
                                        maxLength={1000}
                                        rows={6}
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                                        placeholder="Describe the role, responsibilities, and requirements..."
                                    />
                                    <p className="mt-1 text-right text-xs text-gray-400">
                                        {description.length} / 500 characters
                                    </p>

                                    
                                </div>

                                <div>
                                    <label
                                        htmlFor="listing-expires-at"
                                        className="mb-2 block text-sm font-semibold text-gray-700" 
                                    >
                                        Expiration date
                                    </label>

                                    <input
                                        id="listing-expires-at"
                                        type="date"
                                        value={expiresAt}
                                        onChange={(event) => setExpiresAt(event.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                                    />

                                    <p className="mt-1 text-xs text-gray-500">
                                        Leave blank if the listing has no expiration date
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    disabled={editListingMutation.isPending}
                                    onClick={() => setEditingListing(null)}
                                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={editListingMutation.isPending || !name.trim() || !description.trim()}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {editListingMutation.isPending ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Saving changes...
                                        </>
                                    ):(
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>

                    </div>

                </div>
            )}

        </main>
    )
}