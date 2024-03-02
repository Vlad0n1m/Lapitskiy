import Link from "next/link";

export default function Footer() {
    return (
        <div className="bg-black py-8 w-full mt-[30px] transition-all">
            <div className="max-w-[1340px] mx-auto px-[10px] text-white flex-col ">
                <div className="flex gap-4 items-end justify-center sm:justify-between">

                    <Link href='/' className="text-[32px] font-black mr-4 leading-none ">Lapitskiy</Link>
                    <div className="flex gap-3 hidden md:flex">

                        <Link href='/'
                              className="text-[18px] hover:opacity-100 opacity-70 transition-all leading-none">Главная</Link>
                        <Link href='/menu'
                              className="text-[18px] hover:opacity-100 opacity-70 transition-all leading-none">Меню</Link>
                        <Link href='/shipping'
                              className="text-[18px] hover:opacity-100 opacity-70 transition-all leading-none">Доставка</Link>
                        <Link href='/about'
                              className="text-[18px] hover:opacity-100 opacity-70 transition-all leading-none">О
                            нас</Link>
                        <Link href='/contacts'
                              className="text-[18px] hover:opacity-100 opacity-70 transition-all leading-none">Контакты</Link>
                        <Link href='/blog'
                              className="text-[18px] hover:opacity-100 opacity-70 transition-all leading-none">Блог</Link>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-stone-500 my-5"></div>
                <div className="flex justify-between flex-col items-center sm:items-start sm:flex-row">
                    <div className="flex gap-2 flex-col mt-8 items-center text-center sm:text-left sm:items-start">
                        <h4>Наши адресса:</h4>
                        <div className="flex flex-col">
                            <h4 className="text-[18px] font-black">ул. Набережная, 25А</h4>
                            <h4 className="text-[18px] font-black">ул. Букетова, 29</h4>
                            <h4 className="text-[18px] font-black">ул. Жамбыла Жабаева, 142Б</h4>
                        </div>

                    </div>
                    <div className="flex gap-2 flex-col mt-8 items-center text-center sm:text-left sm:items-start">
                        <h4>Наши телефоны:</h4>
                        <div className="flex flex-col">
                            <h4 className="text-[18px] font-black">8 (705) 336 59 49</h4>
                            <h4 className="text-[18px] font-black">8 (705) 336 59 49</h4>

                        </div>

                    </div>
                    <div className="flex gap-2 flex-col mt-8 items-center text-center sm:text-left sm:items-start">
                        <h4>Наши Cоцсети:</h4>
                        <div className="flex flex-col">
                            <Link href='https://www.instagram.com/bakehouse_lapitskiy/' rel="nofollow"
                                  className="text-[18px] font-black">Instagram</Link>

                        </div>

                    </div>
                    <div className="flex flex-col mt-8 items-center text-center sm:text-left sm:items-start">
                        <h4>БИН:</h4>
                        <div className="flex flex-col">
                            <h4 className="text-[18px] ">000000001</h4>
                        </div>
                        <h4>ИИН:</h4>
                        <div className="flex flex-col">
                            <h4 className="text-[18px] ">000000001</h4>
                        </div>

                    </div>
                </div>
                <div
                    className="flex justify-between flex-col-reverse  sm:flex-row gap-4 items-center mt-8 items-center text-center sm:text-left sm:items-start">
                    <div className="">
                        <p className="opacity-50 ">© Lapitskiy 2024</p>
                        <Link href='https://t.me/l0xa1ch' rel="nofollow" className="opacity-30 leading-none">made by
                            BUHONIN & KARACHKOV</Link>
                    </div>
                    <div className="flex sm:items-end flex-col">

                        <Link href='/' className="opacity-50">Политика конф.</Link>
                        <p className="opacity-50">Кофе, круассаны, любовь...</p>
                    </div>
                </div>

            </div>
        </div>
    )
}