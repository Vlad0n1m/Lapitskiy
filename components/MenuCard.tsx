'use client'
import Image from 'next/image'
import { useEffect, useState } from "react"
import { IProduct, useCart } from "@/app/context";
import { uid } from 'uid';
import Link from 'next/link';
import CoffeeConstructor from './CoffeeConstructor';

export default function MenuCard(product: IProduct) {

    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <>
            <div onClick={() => handleOpen()} className="transition-all cursor-pointer">
                <div className="bg-black bg-opacity-40 flex-col shadow-xl rounded-xl flex gap-2 p-4 items-center">
                    <div className="relative w-full h-[150px] md:h-[200px] rounded-xl overflow-hidden">
                        <Image src={product.image_url || '/cup.png'} alt={product.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <p className='text-white font-black text-[20px] md:text-[32px] w-full leading-none'>{product.name}</p>
                    <div className="flex justify-between items-center w-full">
                        <p className='text-white font-black text-[16px] md:text-[24px]'>{product.small_price} тг</p>
                        <p className='text-white font-black w-[32px] text-[32px]'><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 16L15 12M15 12L11 8M15 12H3M4.51555 17C6.13007 19.412 8.87958 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C8.87958 3 6.13007 4.58803 4.51555 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg></p>
                    </div>
                </div>
            </div>
            <CoffeeConstructor
                product={product}
                isOpen={open}
                onClose={handleOpen}
            />

        </>
    )
}