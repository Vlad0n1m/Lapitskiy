import Image from "next/image"

export default function Taplink() {
    return (
        <div
            className="relative bg-cover bg-center rounded-xl p-4 sm:p-8 flex flex-col justify-between gap-16 sm:min-h-max max-h-[700px] sm:h-max h-[85dvh]">
            <Image style={{filter: 'brightness(0.3)'}} src='/herobg.webp' objectFit={"cover"} layout={"fill"} alt="Чаи"
                   className="rounded-xl z-0 "/>
            <div className="flex flex-between">
                <div className="flex flex-col text-white text-[50px] leading-none font-black z-20">
                    <h1>Кофе</h1>
                    <h1>Круассаны</h1>
                    <h1>Любовь</h1>
                </div>
            </div>
            <div className="flex-row flex justify-between h-full items-end ">
                <div className="hidden sm:block"></div>
                <div
                    className="flex flex-col md:flex-row gap-2 sm:gap-4 w-full sm:w-max h-full justify-between sm:justify-end">
                    <div className="flex gap-2 sm:gap-4 h-full sm:h-max">
                        <div
                            className="shadow-xl h-full  shadow-white/20 transition-all hover:rotate-6 relative flex cursor-pointer flex-col p-2 rounded-xl text-white w-full h-[120px] sm:h-[100px] sm:w-[100px] lg:w-[120px] lg:h-[120px] justify-end font-black">
                            <Image style={{filter: 'brightness(0.65)'}} src='/coffe.webp' objectFit={"cover"}
                                   layout={"fill"} alt="Чаи" className="rounded-xl"/>

                            <p className="z-20">Кофе</p></div>
                        <div
                            className="shadow-xl h-full shadow-white/20 transition-all hover:rotate-6 relative flex cursor-pointer flex-col p-2 rounded-xl text-white w-full h-[120px] sm:h-[100px] sm:w-[100px] lg:w-[120px] lg:h-[120px] justify-end font-black">
                            <Image style={{filter: 'brightness(0.65)'}} src='/macaroon-mini.webp' objectFit={"cover"}
                                   layout={"fill"} alt="Чаи" className="rounded-xl"/>

                            <p className="z-20">Выпечка</p></div>
                    </div>
                    <div className="flex gap-2 sm:gap-4 h-full sm:h-max">

                        <div
                            className="shadow-xl h-full shadow-white/20 transition-all hover:-rotate-6 relative flex cursor-pointer flex-col p-2 rounded-xl text-white w-full h-[120px] sm:h-[100px] sm:w-[100px]  lg:w-[120px] lg:h-[120px] justify-end font-black">
                            <Image style={{filter: 'brightness(0.65)'}} src='/milkshake.webp' objectFit={"cover"}
                                   layout={"fill"} alt="Чаи" className="rounded-xl"/>

                            <p className="z-20">Напитки</p></div>
                        <div
                            className="shadow-xl h-full shadow-white/20 transition-all hover:rotate-6 relative flex cursor-pointer flex-col p-2 rounded-xl text-white w-full h-[120px] sm:h-[100px] sm:w-[100px] lg:w-[120px] lg:h-[120px] justify-end font-black">
                            <Image style={{filter: 'brightness(0.65)'}} src='/tea.webp' objectFit={"cover"}
                                   layout={"fill"} alt="Чаи" className="rounded-xl"/>

                            <p className="z-20">Чаи</p></div>
                    </div>
                    <div className="flex gap-2 sm:gap-4 h-full sm:h-max">

                        <div
                            className="shadow-xl h-full shadow-white/20 transition-all hover:-rotate-6 relative flex cursor-pointer flex-col p-2 rounded-xl text-white w-full h-[120px] sm:h-[100px] sm:w-[100px] lg:w-[120px] lg:h-[120px] justify-end font-black">
                            <Image style={{filter: 'brightness(0.65)'}} src='/rahat.webp' objectFit={"cover"}
                                   layout={"fill"} alt="Чаи" className="rounded-xl"/>

                            <p className="z-20 leading-none">Уник<br/>альное</p></div>
                        <div
                            className="shadow-xl h-full shadow-white/20 transition-all hover:rotate-6 relative flex cursor-pointer flex-col p-2 rounded-xl text-white w-full h-[120px] sm:h-[100px] sm:w-[100px]  lg:w-[120px] lg:h-[120px] justify-end font-black">
                            <Image style={{filter: 'brightness(0.65)'}} src='/shipping.webp' objectFit={"cover"}
                                   layout={"fill"} alt="Чаи" className="rounded-xl"/>

                            <p className="z-20">Доставка</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}