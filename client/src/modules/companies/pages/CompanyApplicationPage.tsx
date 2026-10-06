import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetCompanyApplication } from "../hooks/useCompanies";
import { ArrowLeft, Briefcase, Building2 } from "lucide-react";

export default function CompanyApplicationPage() {
    const {applicationId} = useParams()

    const navigate = useNavigate( )

    const {data, isLoading, isError} = useGetCompanyApplication(applicationId!)

    if(isLoading){
        return(
            <main className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="mx-auto max-w-5xl animate-pulse">
                    <div className="h-4 w-32 rounded bg-gray-200"/>
                    <div className="mt-10 rounded-2xl border bg-white p-8">
                        <div className="h-12 w-12 rounded-xl bg-gray-200"/>
                        <div className="mt-6 h-8 w-2/3 rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-1/3 rounded bg-gray-200" />

                        <div className="mt-10 space-y-3">
                            <div className="h-4 rounded bg-gray-200" />
                            <div className="h-4 rounded bg-gray-200" />
                            <div className="h-4 w-5/6 rounded bg-gray-200" />
                        </div>
                    </div>

                </div>
            </main>
        )
        
    }

    if(isError || !data?.companyApplication) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
                <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
                    <Briefcase className="mx-auto h-10 w-10 text-gray-300" />

                    <h1 className="mt-4 text-xl font-bold text-gray-900">
                        Listing not found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        This applicaiton may no longer exist
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/applications')}
                        className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Back to applications
                    </button>
                </div>
            </main>
        )
    }
    const application = data.companyApplication
    
    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/applications"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to applications
                </Link>

                <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm sm:p-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                <Building2 className="h-6 w-6 text-gray-600" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {application.listingName}
                                </p>

                                <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                                    {application.firstName} {application.lastName}
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                    @{application.username}
                                </p>
                            </div>
                        </div>
                        <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Sent At: {application.createdAt}
                        </span>
                    </div>

                    <div className="my-8 border-t" />

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Cover Letter
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-600">
                            {application.coverLetter}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bild text-gray-900">
                            Resume
                        </h2>
                        <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-600">
                            {application.resume}
                        </p>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            className="inline-flex items-center justify-between gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Approve
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center justify-between gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Reject
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )

}