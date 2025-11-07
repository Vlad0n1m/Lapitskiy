import Link from "next/link";

export default function PrivacyPage() {
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Политика конфиденциальности</h1>
                        <p className="text-gray-600">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Общие положения</h2>
                            <p className="text-gray-700 mb-6">
                                Настоящая Политика конфиденциальности определяет порядок обработки персональных данных
                                пользователей сайта URPAQ (далее — «Сайт»). Используя Сайт, вы соглашаетесь с условиями
                                настоящей Политики конфиденциальности.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Сбор персональных данных</h2>
                            <p className="text-gray-700 mb-4">
                                Мы собираем следующие типы персональных данных:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                                <li>Имя и контактная информация (телефон, адрес доставки)</li>
                                <li>Информация о заказах и предпочтениях</li>
                                <li>Данные о посещении сайта (IP-адрес, браузер, время посещения)</li>
                                <li>Комментарии и отзывы</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Цели обработки данных</h2>
                            <p className="text-gray-700 mb-4">
                                Персональные данные используются для:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                                <li>Обработки и выполнения заказов</li>
                                <li>Связи с клиентами по вопросам заказов</li>
                                <li>Улучшения качества обслуживания</li>
                                <li>Информирования о новых продуктах и акциях</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Защита данных</h2>
                            <p className="text-gray-700 mb-6">
                                Мы принимаем все необходимые меры для защиты ваших персональных данных от
                                несанкционированного доступа, изменения, раскрытия или уничтожения. Ваши данные
                                хранятся в защищенных системах и доступны только авторизованному персоналу.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Передача данных третьим лицам</h2>
                            <p className="text-gray-700 mb-6">
                                Мы не продаем, не обмениваем и не передаем ваши персональные данные третьим лицам,
                                за исключением случаев, когда это необходимо для выполнения заказа (например,
                                службам доставки) или требуется по закону.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                            <p className="text-gray-700 mb-6">
                                Наш сайт использует файлы cookies для улучшения пользовательского опыта.
                                Вы можете отключить cookies в настройках вашего браузера, однако это может
                                повлиять на функциональность сайта.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Права пользователей</h2>
                            <p className="text-gray-700 mb-4">
                                Вы имеете право:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                                <li>Получать информацию о ваших персональных данных</li>
                                <li>Требовать исправления неточных данных</li>
                                <li>Требовать удаления ваших данных</li>
                                <li>Отозвать согласие на обработку данных</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Контактная информация</h2>
                            <p className="text-gray-700 mb-4">
                                По вопросам обработки персональных данных обращайтесь:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@urpaq.kz</p>
                                <p className="text-gray-700 mb-2"><strong>Телефон:</strong> +7 (777) 123-45-67</p>
                                <p className="text-gray-700"><strong>Адрес:</strong> г. Астана, ул. Примерная, 123</p>
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Изменения в политике</h2>
                            <p className="text-gray-700 mb-6">
                                Мы оставляем за собой право изменять настоящую Политику конфиденциальности.
                                О любых изменениях мы уведомим пользователей через сайт или по электронной почте.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
