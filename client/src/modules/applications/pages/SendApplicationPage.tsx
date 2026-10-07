import { useState } from "react";
import { useSendApplication } from "../hooks/useApplications";
import { useParams, useNavigate } from "react-router-dom";

export default function SendApplicationPage() {

    const sendApplication = useSendApplication()

    const navigate = useNavigate()

    const {listingId} = useParams()

    const [resume, setResume] = useState('')
    const [coverLetter, setCoverLetter] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(event: React.SyntheticEvent){
        event.preventDefault()
        setError('')

        if(!listingId){
            setError('Listing ID is missing')
            return
        }

        try{
            await sendApplication.mutateAsync({
                listingId,
                resume,
                coverLetter
            })

            navigate('/listings')

        }catch (error){
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to send application'
            )
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Sumbit Your Application 
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Provide your Cover Letter and Resume
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border bg-white p-6 shadow-sm" 
                >
                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Cover Letter
                            </label>

                            <textarea
                                value={coverLetter}
                                onChange={e => setCoverLetter(e.target.value)}
                                rows={7}
                                className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            />

                           
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Resume
                            </label>

                            <textarea
                                value={resume}
                                onChange={e => setResume(e.target.value)}
                                rows={7}
                                className="w-full resize-none  rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/listings')}
                                className="rounded-lg border px-5 py-3 font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={sendApplication.isPending}
                                className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
                            >
                                {sendApplication.isPending 
                                    ? 'Sending...'
                                    : 'Send Application'
                                }
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </main>
    )

    
}