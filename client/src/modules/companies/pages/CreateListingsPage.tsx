import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

import { useAddListing } from '../../listings/hooks/useListing'
import { BriefcaseBusiness } from 'lucide-react'

export default function CreateListingsPage() {
    const navigate = useNavigate()

    const addListing = useAddListing()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const [error, setError] = useState('')

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>){
        event.preventDefault()
        setError('')

        try{
            await addListing.mutateAsync({
                name, description
            })

            navigate("/company/listings")
        }catch (error){
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to add listing'
            )
        }
    }

    return (
        <main className='min-h-screen bg-gray-50 p-6'>
            <div className='mx-auto max-w-3xl'>
                <div className='mb-8'>
                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white'>
                        <BriefcaseBusiness size={24} />
                    </div>
                    <h1 className='text-3xl font-bold'>
                        Create Job Listing
                    </h1>
                    <p className='mt-2 text-gray-500'>
                        Create a new opportunity for candidates
                    </p>
                </div>

                {error && (
                    <div className='mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700'>
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className='rounded-2xl border bg-white p-6 shadow-sm'
                >

                    <div className='mb-6'>
                        <label className='mb-2 block text-sm font-medium'>
                            Job Title
                        </label>

                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder='Frontend Developer'
                            className='w-full rounded-lg border px-4 py-3 outline-none focus:ring-2'
                            required
                            minLength={3}
                            maxLength={30} 
                        />
                        <p className='mt-1 text-xs text-gray-400'>
                            3-30 characters
                        </p>
                    </div>

                    <div className='mb-6'>
                        <label className='mb-2 block text-sm font-medium'>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder='Describe role, responsbilities, requirements, and expectations ...'
                            rows={10}
                            className='w-full resize-non rounded-lg border px-4 py-3 outline-none focus:ring-2'
                            required
                            minLength={100}
                            maxLength={1000}
                        />

                        <p className='mt-1 text-xs text-gray-400'>
                            {description.length}/1000 characters
                        </p>
                    </div>

                    <div className='flex justify-end gap-3'>
                        <button
                            type="button"
                            onClick={() => navigate("/company/listings")}
                            className='rounded-lg border px-5 py-3 font-medium hover:bg-gray-50'
                        >
                            Cancel
                        </button>

                        <button
                            type='submit'
                            disabled={addListing.isPending}
                            className='rounded-lg bg-black px-5 py-3 font-semibold text-white disabled:opacity-50'
                        >
                            {addListing.isPending
                                ? 'Creating...'
                                : 'Create listing'
                            }

                        </button>
                    </div>

                </form>
            </div>
        </main>
    )
}