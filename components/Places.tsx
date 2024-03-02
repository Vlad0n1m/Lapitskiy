'use client'
import {useState} from "react"

export default function Places() {
    const [chosenCity, setChosenCity] = useState(1)
    const handleCityChoosing = (cityID: any) => {
        setChosenCity(cityID)
    }
    return (
        <div className="flex flex-col md:gap-4">
            <div className="flex justify-between items-center flex-col md:flex-row gap-3">
                <h2 className="text-[52px] font-black leading-none">Наши места</h2>
                <p>Постоянно открываем новые горизонты</p>
                <div className="flex gap-4 mb-3 md:mb-0">
                    <div onClick={() => handleCityChoosing(1)}
                         className={`${chosenCity == 1 ? 'text-white bg-black' : 'text-black bg-transparent'} p-2 transition-all border-black border-2 rounded-full cursor-pointer flex items-center justify-center font-bold px-4 select-none`}>
                        <p>Петропавловск</p></div>
                    {/* <div onClick={() => handleCityChoosing(2)} className={`${chosenCity == 2 ? 'text-white bg-black' : 'text-black bg-transparent'} p-2 transition-all border-black border-2 rounded-full cursor-pointer flex items-center justify-center font-bold px-4 select-none`}><p>Астана</p></div> */}
                </div>
            </div>
            <div className="flex gap-4 flex-col md:flex-row">
                <div className="relative bg-black rounded-xl h-[400px] w-full md:w-[80%] ">
                    <iframe
                        src="https://yandex.com/map-widget/v1/?um=constructor%3A45bd2bd967adcddd2115e3c6c5ada64e0ab2934e0c2501e9041e44bf280016ff&amp;source=constructor"
                        width="100%"
                        height="100%"
                        className="absolute inset-0 w-full h-full rounded-xl"
                        allowFullScreen
                    ></iframe>
                </div>
                <div
                    className={`${chosenCity == 1 ? 'flex' : 'hidden'} bg-black rounded-xl w-full md:w-[30%] text-white flex flex-col p-4 gap-2`}>
                    <p>ул. Набережная, 25А</p>
                    <p>ул. Букетова, 29</p>
                    <p>ул. Жамбыла Жабаева, 142Б</p>
                </div>
                <div
                    className={`${chosenCity == 2 ? 'flex' : 'hidden'} bg-black rounded-xl w-full md:w-[30%] text-white flex flex-col p-4 gap-2`}>
                    <p>Скоро открываемся!</p>

                </div>
            </div>
        </div>
    )
}