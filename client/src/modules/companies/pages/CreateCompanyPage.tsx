import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

import { useAddCompany } from '../hooks/useCompanies'

export default function CreateCompanyPage() {
    const navigate = useNavigate()

    const addCompany = useAddCompany()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(event: React.SyntheticEvent){
        event.preventDefault();
        setError('')


        try{
            await addCompany.mutateAsync({
                name,
                description
            })

            navigate('/companyDash');
        }catch (error){
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to create company'
            )
        }
    }

    return (
        <main className='min-h-screen bg-gray-50 p-6'>
            <div className='mx-auto max-w-2xl'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold'>
                        Create your company
                    </h1>

                    <p className='mt-2 text-gray-500'>
                        Create your company profile 
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
                    <div className='space-y-6'>
                        <div>
                            <label className='mb-2 block text-sm font-medium'>
                                Company Name
                            </label>

                            <input
                                value={name}
                                onChange={e =>
                                    setName(e.target.value)
                                }
                                placeholder='Acme Technologies'
                                className='w-full rounded-lg border px-4 py-3 outline-none focus:ring-2'
                            />
                        </div>

                        <div>
                            <label className='mb-2 block text-sm font-medium'>
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={e => 
                                    setDescription(e.target.value)
                                }
                                placeholder='Tell people about your company...'
                                rows={7}
                                className='w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2'
                            />
                                <p className='mt-2 text-xs text-gray-400'>
                                    200-500 characters
                                </p>

                        </div>

                        <div className='flex justify-end gap-3'>
                            <button
                                type='button'
                                onClick={() => 
                                    navigate('/companyDash')
                                }
                                className='rounded-lg border px-5 py-3 font-medium'
                            >
                                Cancel
                            </button>

                            <button
                                type='submit'
                                disabled={addCompany.isPending}
                                className='rounded-lg bg-gray-900 px-5 py-3 font-semibold  text-white disabled:opacity-50'  
                            >
                                {addCompany.isPending
                                    ? 'Creating...'
                                    : 'Create Company'
                                }

                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </main>
    )
}