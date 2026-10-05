export default function StatCard({
    label,
    value,
    icon: Icon
}: {
    label:string
    value: number
    icon: React.ElementType
}) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className='h-5 w-5 text-gray-600' />
                </div>
            </div>
        </div>
    )
}