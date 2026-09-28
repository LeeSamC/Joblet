import { useGetCompanyMembers } from "../hooks/useCompanies";

export default function CompanyMembersPage() {
    const {data, isLoading, isError} = useGetCompanyMembers()

    if(isLoading){
        return(
            <main className="p-6">
                Loading members
            </main>
        )
    }

    if(isError){
        return(
            <main className="p-6">
                Failed to load members
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Company Members
                    </h1>

                    <p className="mt-2 text-gray-500">
                        People who are members of your company
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    {data?.companyMembers.map(
                        member => (
                            <div
                                key={member.userId}
                                className="flex items-center gap-4 border-b p-5 last:border-b-0"
                            >

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 font-semibold text-white">
                                    {member.firstName.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        {member.firstName} {" "}
                                        {member.lastName}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        @{member.username}
                                    </p>
                                </div>


                            </div>
                        )
                    )}
                </div>
            </div>
        </main>
    )
}