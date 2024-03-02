export default function ShippingInfo() {
    return (
        <div className="flex flex-col gap-16">
            <h1 className="text-[52px] uppercase font-black text-center mt-4">Доставка</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-[#f7f7fa] p-8 rounded-xl w-full flex flex-col gap-2">
                    <h3 className="text-[28px] font-black">Доставка по городу</h3>
                    <p className="text-[18px]">Бесплатно при сумме заказа от 4000 тг</p>
                </div>
                <div className="bg-[#f7f7fa] p-8 rounded-xl w-full flex flex-col gap-2 ">
                    <h3 className="text-[28px] font-black">Доставка<br/>в отдаленные районы</h3>
                    <p className="text-[18px]">+400 тг к сумме заказа</p>
                    <div className="flex flex-wrap">
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white  rounded-full py-2 px-4 text-[16px] ">
                                Рабочий поселок
                            </div>
                        </div>
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white rounded-full py-2 px-4 text-[16px] ">
                                Береке
                            </div>
                        </div>
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white rounded-full py-2 px-4 text-[16px] ">
                                Тепличное
                            </div>
                        </div>
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white rounded-full py-2 px-4 text-[16px] ">
                                Заречный
                            </div>
                        </div>
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white rounded-full py-2 px-4 text-[16px] ">
                                Борки
                            </div>
                        </div>
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white rounded-full py-2 px-4 text-[16px] ">
                                Хромзавод
                            </div>
                        </div>
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white rounded-full py-2 px-4 text-[16px] ">
                                Грин парк
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#f7f7fa] p-8 rounded-xl w-full flex flex-col gap-2">
                    <h3 className="text-[28px] font-black">Доставка<br/>в дальние районы</h3>
                    <p className="text-[18px]">+800 тг к сумме заказа</p>
                    <div className="flex flex-wrap">
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white  rounded-full py-2 px-4 text-[16px] ">
                                Бесколь
                            </div>
                        </div>
                        <div className="p-1 ">
                            <div className="bg-black text-center text-white rounded-full py-2 px-4 text-[16px] ">
                                Солнечный
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-[28px] font-bold">Оплата</h2>
                <p className="text-[18px] font-light">Оплату за заказ можно сделать тремя способами</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="bg-black text-center text-white  rounded-full py-3 px-4 text-[16px] ">
                        Наличными
                    </div>
                    <div className="bg-black text-center text-white  rounded-full py-3 px-4 text-[16px] ">
                        Картой на сайте
                    </div>
                    <div className="bg-black text-center text-white  rounded-full py-3 px-4 text-[16px] ">
                        Переводом на Kaspi
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 md:w-[70%]">
                <h2 className="text-[28px] font-bold">Примечание</h2>
                <p className="text-[18px]">Мы принимаем заказы на доставку ежедневно и без выходных <span
                    className="whitespace-nowrap bg-rose-600 py-1 px-3 text-white font-light text-[16px] w-max rounded-full">с 11:00 до 23:40</span>
                </p>
                <p className="text-[18px]">Из-за непредвиденных обстоятельств<span className="text-rose-600 font-bold"> график работы может меняться</span>.
                    Информацию об изменениях режима работы мы публикуем у нас в <span
                        className="text-rose-600 font-bold"> Stories </span> на странице в Instagram.</p>
            </div>
        </div>
    )
}