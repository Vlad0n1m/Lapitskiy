import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding categories...')

    // Используем строковые значения напрямую, Prisma автоматически приведет их к enum
    const categories = [
        { name: 'Кофе', slug: 'coffe' as const },
        { name: 'Чаи', slug: 'tea' as const },
        { name: 'Круассаны', slug: 'croisant' as const },
        { name: 'Выпечка', slug: 'macaroon' as const },
        { name: 'Печенье', slug: 'rahat' as const },
        { name: 'Секретное меню', slug: 'cheese' as const },
    ]

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
        console.log(`✓ Category "${category.name}" (${category.slug})`)
    }

    console.log('Seeding syrups...')
    const syrups = [
        { name: 'Клубника', price: 200 },
        { name: 'Мята', price: 150 },
        { name: 'Ваниль', price: 180 },
        { name: 'Карамель', price: 200 },
        { name: 'Шоколад', price: 200 },
        { name: 'Лесные ягоды', price: 220 },
        { name: 'Кокос', price: 180 },
    ]

    for (const syrup of syrups) {
        await prisma.syrup.upsert({
            where: { name: syrup.name },
            update: {},
            create: syrup,
        })
        console.log(`✓ Syrup "${syrup.name}" (+${syrup.price}₸)`)
    }

    console.log('Seeding milks...')
    const milks = [
        { name: 'Коровье молоко', price: 0 },
        { name: 'Миндальное молоко', price: 300 },
        { name: 'Овсяное молоко', price: 300 },
        { name: 'Кокосовое молоко', price: 350 },
        { name: 'Соевое молоко', price: 250 },
    ]

    for (const milk of milks) {
        await prisma.milk.upsert({
            where: { name: milk.name },
            update: {},
            create: milk,
        })
        console.log(`✓ Milk "${milk.name}" ${milk.price > 0 ? `(+${milk.price}₸)` : '(бесплатно)'}`)
    }

    console.log('Seeding extras...')
    const extras = [
        { name: 'Дополнительный эспрессо', price: 200 },
        { name: 'Взбитые сливки', price: 150 },
        { name: 'Корица', price: 100 },
        { name: 'Какао', price: 100 },
    ]

    for (const extra of extras) {
        await prisma.extra.upsert({
            where: { name: extra.name },
            update: {},
            create: extra,
        })
        console.log(`✓ Extra "${extra.name}" (+${extra.price}₸)`)
    }

    console.log('Seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

