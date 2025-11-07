import { prisma } from '@/lib/prisma'

export default async function OrdersPage({ searchParams }: { searchParams?: { [k: string]: string | string[] | undefined } }) {
    const take = Number((searchParams?.take as string) || 20)
    const page = Number((searchParams?.page as string) || 1)
    const skip = (page - 1) * take

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take,
            skip,
            select: { id: true, orderNumber: true, phone: true, totalPrice: true, status: true, createdAt: true }
        }),
        prisma.order.count()
    ])

    const totalPages = Math.max(1, Math.ceil(total / take))

    return (
        <div className="space-y-4">
            <div className="w-full overflow-x-auto">
                <table className="min-w-[640px] w-full text-sm border">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-2 text-left">Время</th>
                            <th className="p-2 text-left">Номер</th>
                            <th className="p-2 text-left">Телефон</th>
                            <th className="p-2 text-right">Сумма</th>
                            <th className="p-2 text-left">Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-t">
                                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                                <td className="p-2">{o.orderNumber}</td>
                                <td className="p-2">{o.phone}</td>
                                <td className="p-2 text-right">{o.totalPrice}</td>
                                <td className="p-2">{o.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-2 text-sm">
                <a className="px-3 py-2 border rounded disabled:opacity-50" aria-disabled={page <= 1} href={page <= 1 ? `?page=1&take=${take}` : `?page=${page - 1}&take=${take}`}>Назад</a>
                <span>
                    Стр. {page} / {totalPages}
                </span>
                <a className="px-3 py-2 border rounded disabled:opacity-50" aria-disabled={page >= totalPages} href={page >= totalPages ? `?page=${totalPages}&take=${take}` : `?page=${page + 1}&take=${take}`}>Вперед</a>
            </div>
        </div>
    )
}


