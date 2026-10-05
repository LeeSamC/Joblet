import { ChevronRight } from "lucide-react"

export default function ApplicationCard({
    application
}: {
    application: {
        applicationId: string
        applicantId: string
        firstName: string
        lastName: string
        username: string
        listingId: string
        listingName: string
        coverLetter: string 
        resume: string 
        status: string
        createdAt: string
    }
}) {
    const fullName = `${application.firstName} ${application.lastName}`

    return (
        <article className="group rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        {application.firstName.charAt(0)}
                        {application.lastName.charAt(0)}
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                            {fullName}
                        </h3>

                        <p className="truncate text-sm text-gray-500">
                            @{application.username}
                        </p>
                    </div>
                </div>

                <div className="min-w-0 lg:w-64">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Applied for
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-gray-900">
                        {application.listingName}
                    </p>

                </div>

                <div className="hidden lg:block">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Applied
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                        {new Date(
                            application.createdAt
                        ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                        })}
                    </p>
                </div>

                <div>
                    <StatusBadge status={application.status} />
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                    View
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4 text-xs text-gray-500 lg:hidden">
                <span>
                    Applied{" "}
                    {new Date(
                        application.createdAt
                    ).toLocaleTimeString()}
                </span>

                <span className="text-gray-300">
                    •
                </span>

                <StatusBadge status={application.status} />
 
            </div>

        </article>
    )
}

function StatusBadge({
    status,
}: {
    status: string
}) {
    const styles = {
        PENDING:
            "bg-amber-50 text-amber-700 border-amber-200",

        APPROVED:
            "bg-green-50 text-green-700 border-green-200",

        DECLINED:
            "bg-red-50 text-red-700 border-red-200",
    }

    const labels = {
        PENDING: "Pending",
        APPROVED: "Approved",
        DECLINED: "Declined",
    }

    const style =
        styles[status as keyof typeof styles] ??
        "bg-gray-50 text-gray-600 border-gray-200";

    const label =
        labels[status as keyof typeof labels] ??
        status;

    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}>
            {label}
        </span>
    )
}