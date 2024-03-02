'use client'
import Image from 'next/image'
import { useEffect, useState } from "react"
import { IProduct, useCart } from "@/app/context";
import { uid } from 'uid';
import Link from 'next/link';

export default function MenuCard(product: IProduct) {

    const [qty, changeQty] = useState(1)
    const [open, setOpen] = useState(false)
    const [chosenSirop, setChosenSirop] = useState("Нет")
    const [chosenSize, setChosenSize] = useState("Маленький");
    const [finalPrice, setFinalPrice] = useState(product.small_price)
    const sizes = ["Маленький", "Средний", "Большой"];
    const handleAddToCart = (product:any) => {
        addToCart(product);
        handleOpen();
        setChosenSirop("Нет");
        setChosenSize("Маленький");

    }
    useEffect(() => {
        let price = 0;
        if (chosenSize == "Маленький") {
            price = product.small_price;
        } else if (chosenSize == "Средний") {
            price = product.medium_price
        } else if (chosenSize == "Большой") {
            price = product.big_price
        }
        if (chosenSirop != "Нет") {
            price += product.sirop_price
        }
        setFinalPrice(price)
    }, [chosenSirop, chosenSize])
    useEffect(() => {
        open
            ? document.body.classList.add("overflow-hidden")
            : document.body.classList.remove("overflow-hidden");
    }, [open]);
    const handleOpen = () => {
        setOpen(open ? false : true)
    }
    function handleChange(mode: string) {
        if (mode === '+') {
            if (qty < 100) {
                changeQty(qty + 1)
            }
        } else {
            if (qty > 1) {
                changeQty(qty - 1)
            }
        }
    }

    const addToCart = useCart((state) => state.addToCart)

    const sirops = [
        { name: 'Нет', color: '#000000' },
        { name: 'Клубника', color: '#dc2626' },
        { name: 'Мята', color: '#4ade80' },
        { name: 'Ваниль', color: '#f59e0b' },
        { name: 'Карамель', color: '#ed8936' },
        { name: 'Шоколад', color: '#4b5563' },
        { name: 'Лесные ягоды', color: '#7c3aed' },
        { name: 'Кокос', color: '#d97706' },
        // Дополнительные сиропы могут быть добавлены по мере необходимости
    ];

    return (
        <>
            <div onClick={() => handleOpen()} className="sm:p-4 pb-4 md:pb-0 basis-full lg:basis-1/2 xl:basis-1/3 transition-all cursor-pointer">
                <div className="bg-black bg-opacity-40 flex-col shadow-xl rounded-xl flex gap-2 p-4 items-center">
                    <Image src={`${product.image_url}`} alt={product.name} objectFit='cover' width={300} height={300} className="rounded-xl h-[200px]" />
                    <p className='text-white font-black  text-[32px] w-full leading-none'>{product.name}</p>
                    <div className="flex justify-between items-center w-full">
                        <p className='text-white font-black  text-[24px]'>{finalPrice} тг</p>
                        <p className='text-white font-black w-[32px] text-[32px]'><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 16L15 12M15 12L11 8M15 12H3M4.51555 17C6.13007 19.412 8.87958 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C8.87958 3 6.13007 4.58803 4.51555 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></p>
                    </div>
                </div>
            </div>
            <div className={`${open ? 'block' : 'hidden'} max-w-[700px] max-h-[800px] sm:h-[90vh] h-[100dvh] min-h-[300px] w-screen fixed flex flex-col justify-between items-center overflow-y-auto gap-2 bg-white z-50 sm:rounded-xl p-4  left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]`}>
                <div className="flex flex-col items-center">
                    <Image src={`${product.image_url}`} alt={product.name} width={300} height={200} className="rounded-xl mb-4 mt-6" />
                    <Link href={`menu/${product.slug}`} className={`font-black text-[32px]`}>{product.name}</Link>
                    <p className={` text-[16px] text-center max-w-[70%]`}>{product.description}</p>
                    <div className="h-[1px] opacity-20 w-full bg-black my-4"></div>
                    <div className="w-full flex flex-col gap-4 items-center">
                        <p>Размер стаканчика</p>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            {sizes.map(size => (
                                <div
                                    key={size}
                                    className={`border-2 border-black px-4 p-2 rounded-full font-black cursor-pointer transition-all ${chosenSize === size ? 'bg-black text-white' : 'bg-white text-black'}`}
                                    onClick={() => setChosenSize(size)}
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4 mt-4 items-center">
                        <p>Сироп</p>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            {sirops.map(sirop => (
                                <div
                                    onClick={() => setChosenSirop(sirop.name)}
                                    key={sirop.name}
                                    className="border-2 px-4 p-2 rounded-full font-black cursor-pointer transition-all"
                                    style={{
                                        backgroundColor: chosenSirop === sirop.name ? sirop.color : '#ffffff',
                                        color: chosenSirop === sirop.name ? '#ffffff' : '#000000',
                                        borderColor: sirop.color
                                    }}
                                >
                                    {sirop.name}
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            <div onClick={() => handleOpen()} className={`${open ? 'block' : 'hidden'} absolute text-[20px] top-[10px] right-[20px] cursor-pointer z-50 bg-opacity-40 font-black`}>x</div>

                <button onClick={() => handleAddToCart({...product, uid: uid(), final_price: finalPrice, sirop: chosenSirop, size: chosenSize}) } className={'w-full bg-black rounded-full font-black p-4 text-white self-end justify-self-end place-self-end'}>Добавить в корзину - {finalPrice} тг</button>
            </div>
            <div onClick={() => handleOpen()} className={`${open ? 'block' : 'hidden'} absolute bg-black top-0 left-0 w-screen h-[200vh] cursor-pointer z-40 bg-opacity-40`}></div>

        </>
    )
}