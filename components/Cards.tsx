import Image from "next/image"

export default function Cards() {
    return (
        <div className="flex flex-col">
            <h2 className="font-black text-[32px] mb-6">Категории</h2>

            <div className="flex flex-col md:flex-row gap-8 md:gap-8">
                <div className="flex flex-col sm:flex-row gap-8 md:gap-8 w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <div
                            className="relative aspect-square bg-black w-full rounded-xl flex items-center justify-center pointer-events-none select-none">
                            <Image style={{ filter: 'brightness(0.65)' }} src='/tea.webp' fill
                                alt="Чаи" className="rounded-xl" style={{ objectFit: 'cover' }} />
                            <p className="text-white text-[30px] z-20 select-none">tea</p>
                        </div>
                        <h2 className="font-black text-[24px]">Чаи</h2>
                        <p className="text-[14px] sm:text-[18px]">Мы сами делаем уникальный чай, наши комбинации трав и
                            ягод удивляют каждого нашего покупателя.</p>
                        <button className="bg-black rounded-full w-full text-white py-4 mt-auto select-none">
                            <div className="flex items-center justify-center gap-2">Посмотреть <div
                                className="w-[24px] h-[24px]">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#ffffff" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round"></path>
                                    </g>
                                </svg>
                            </div></div>
                        </button>

                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <div
                            className="relative aspect-square bg-black w-full rounded-xl flex items-center justify-center pointer-events-none select-none">
                            <Image style={{ filter: 'brightness(0.65)' }} src='/croisant-card.webp' fill
                                alt="Чаи" className="rounded-xl" style={{ objectFit: 'cover' }} />
                            <p className="text-white text-[30px] z-20 select-none">croissant</p>
                        </div>
                        <h2 className="font-black text-[24px]">Круассаны</h2>
                        <p className="text-[14px] sm:text-[18px]">Нет слов одни эмоции... Более 15 разных круасанов</p>
                        <button className="bg-black rounded-full w-full text-white py-4 mt-auto select-none">
                            <div className="flex items-center justify-center gap-2">Посмотреть <div
                                className="w-[24px] h-[24px]">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#ffffff" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round"></path>
                                    </g>
                                </svg>
                            </div></div>
                        </button>

                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 md:gap-8 w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <div
                            className="relative aspect-square bg-black w-full rounded-xl flex items-center justify-center pointer-events-none select-none">
                            <Image style={{ filter: 'brightness(0.65)' }} src='/rahat.webp' fill
                                alt="Чаи" className="rounded-xl" style={{ objectFit: 'cover' }} />
                            <p className="text-white text-[30px] z-20 select-none">unique</p>
                        </div>
                        <h2 className="font-black text-[24px]">Уникальные вкусняхи</h2>
                        <p className="text-[14px] sm:text-[18px]">У нас часто проходят акции и предзаказы на самые
                            неожиданные и неординарные позиции, например 4 литра латте...</p>
                        <button className="bg-black rounded-full w-full text-white py-4 mt-auto select-none">
                            <div className="flex items-center justify-center gap-2">Посмотреть
                                <div className="w-[24px] h-[24px]">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
                                            strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#ffffff" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round"></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </button>

                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <div
                            className="relative aspect-square bg-black w-full rounded-xl flex items-center justify-center pointer-events-none select-none">
                            <Image style={{ filter: 'brightness(0.65)' }} src='/cheese.webp' fill
                                alt="Чаи" className="rounded-xl" style={{ objectFit: 'cover' }} />
                            <p className="text-white text-[30px] z-20 ">secret</p>
                        </div>
                        <h2 className="font-black text-[24px]">Секретное меню</h2>
                        <p className="text-[14px] sm:text-[18px]">Только тсс...</p>
                        <button className="bg-black rounded-full w-full text-white py-4 mt-auto select-none">
                            <div className="flex items-center justify-center gap-2">Тссс... <div
                                className="w-[24px] h-[24px]">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#ffffff" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round"></path>
                                    </g>
                                </svg>
                            </div></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
