import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-elbone py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back to menu button */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Вернуться в меню
                    </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-100 to-green-200 p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Публичная оферта</h1>
                        <p className="text-gray-600">Действует с: {new Date().toLocaleDateString('ru-RU')}</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Общие положения</h2>
                            <p className="text-gray-700 mb-6">
                                Настоящая публичная оферта (далее — «Оферта») определяет условия предоставления
                                услуг кафе URPAQ (далее — «Исполнитель») по заказу и доставке продуктов питания.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Предмет договора</h2>
                            <p className="text-gray-700 mb-6">
                                Исполнитель обязуется предоставить услуги по приготовлению и доставке заказанных
                                продуктов питания, а Заказчик обязуется оплатить указанные услуги в размере и
                                порядке, установленных настоящей Офертой.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Порядок оформления заказа</h2>
                            <p className="text-gray-700 mb-4">
                                Заказ оформляется через сайт или мобильное приложение путем:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                                <li>Выбора товаров из меню</li>
                                <li>Указания способа оплаты и доставки</li>
                                <li>Предоставления контактных данных</li>
                                <li>Подтверждения заказа</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Способы оплаты</h2>
                            <p className="text-gray-700 mb-4">
                                Оплата заказа может производиться следующими способами:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                                <li>Наличными при получении</li>
                                <li>Банковской картой</li>
                                <li>Через Kaspi Pay</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Доставка</h2>
                            <p className="text-gray-700 mb-4">
                                Доставка осуществляется в пределах города Астана. Сроки доставки:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                                <li>Самовывоз: готовность заказа через 15-30 минут</li>
                                <li>Доставка: 30-60 минут в зависимости от района</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Цены и оплата</h2>
                            <p className="text-gray-700 mb-6">
                                Цены на товары указаны в тенге и включают НДС. Стоимость доставки рассчитывается
                                отдельно и указывается при оформлении заказа. Оплата производится в полном объеме
                                при получении заказа.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Качество и безопасность</h2>
                            <p className="text-gray-700 mb-6">
                                Мы гарантируем высокое качество всех продуктов и соблюдение санитарных норм при
                                приготовлении. В случае недовольства качеством, мы готовы заменить товар или
                                вернуть деньги.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Отмена и возврат</h2>
                            <p className="text-gray-700 mb-6">
                                Заказ может быть отменен до начала приготовления. В случае отмены после начала
                                приготовления, возврат средств осуществляется в размере 50% от стоимости заказа.
                                Возврат денежных средств производится тем же способом, которым была произведена оплата.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Ответственность сторон</h2>
                            <p className="text-gray-700 mb-6">
                                Исполнитель несет ответственность за качество предоставляемых услуг. Заказчик
                                несет ответственность за достоверность предоставленной информации и своевременную
                                оплату заказа.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Форс-мажор</h2>
                            <p className="text-gray-700 mb-6">
                                Стороны освобождаются от ответственности за неисполнение или ненадлежащее исполнение
                                обязательств по настоящей Оферте, если это явилось следствием обстоятельств
                                непреодолимой силы.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Разрешение споров</h2>
                            <p className="text-gray-700 mb-6">
                                Все споры и разногласия решаются путем переговоров. В случае невозможности
                                достижения соглашения, споры подлежат рассмотрению в суде по месту нахождения
                                Исполнителя.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Контактная информация</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2"><strong>Кафе URPAQ</strong></p>
                                <p className="text-gray-700 mb-2"><strong>Адрес:</strong> г. Астана, ул. Примерная, 123</p>
                                <p className="text-gray-700 mb-2"><strong>Телефон:</strong> +7 (777) 123-45-67</p>
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> info@urpaq.kz</p>
                                <p className="text-gray-700"><strong>Режим работы:</strong> 08:00 - 22:00, ежедневно</p>
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Изменения в оферте</h2>
                            <p className="text-gray-700 mb-6">
                                Исполнитель оставляет за собой право изменять условия настоящей Оферты.
                                Изменения вступают в силу с момента их опубликования на сайте.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
