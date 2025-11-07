import DateFilters from './DateFilters'
import AnalyticsClient from './AnalyticsClient'

export default function DashboardPage({ searchParams }: { searchParams?: { from?: string; to?: string } }) {
    const search = searchParams?.from
        ? `from=${encodeURIComponent(searchParams.from)}${searchParams.to ? `&to=${encodeURIComponent(searchParams.to)}` : ''}`
        : ''

    return (
        <div className="space-y-4">
            <DateFilters />
            <AnalyticsClient search={search} />
        </div>
    )
}


