'use client'
import Image from 'next/image'
import { useState, useEffect } from "react"
import { IProduct, useCart } from "@/app/context";
import { sirops } from '@/app/constants/coffe';
import CoffeeConstructor from './CoffeeConstructor';

export default function MiniCartItem(product: IProduct) {
    // const [qty, changeQty] = useState(product.qty)
    const [price, changePrice] = useState(1100)
    const [open, setOpen] = useState(false)
    const updateProduct = useCart((state) => state.updateProduct)
    const handleUpdate = (updatedProduct: any) => {
        updateProduct(updatedProduct)
        setOpen(false)
    }

    const removeFromCart = useCart((state) => state.removeFromCart)
    const handleOpen = () => {
        setOpen(!open)
    }
    // function handleChange(mode: string) {
    //     if (mode === '+') {
    //         if (qty < 100) {
    //             changePrice((price / qty) * (qty + 1))
    //             changeQty(qty + 1)
    //         }
    //     } else {
    //         if (qty > 1) {
    //             changePrice((price / qty) * (qty - 1))
    //             changeQty(qty - 1)
    //         }
    //     }
    // }


    return (
        <div className="flex flex-col rounded-xl border-2 border-black bg-white gap-4">
            <div className="flex flex-row gap-4 p-2 justify-between">
                <div className="flex gap-4">

                    <Image src={product.image_url || '/cup.png'} width={100} height={100} alt="Чаи" className="w-[65px] h-[65px] rounded-xl" style={{ objectFit: 'cover' }} />
                    <div className="flex flex-col">
                        <h3 className="text-[18px]">{product.name}</h3>
                        <p className="text-[14px] font-light line-clamp-3">{product.description}</p>
                        {/* <div className="flex gap-2 mt-4 items-center flex-col">
                        {sirops.map(sirop => {
                            if (sirop.name == product.sirop) {
                                return (
                                    <div
                                    onClick={() => handleOpen()}
                                    key={sirop.name}
                                    className="border-4 text-[14px] px-4 p-2 rounded-full font-black cursor-pointer transition-all"
                                    style={{
                                        borderColor: sirop.color
                                    }}
                                    >
                                    {sirop.name}
                                    </div>
                                    )
                                }
                            })}
                            <div onClick={() => handleOpen()} className="border-4 rounded-full px-4 p-2 cursor-pointer transition-all bg-black text-white border-black text-[14px]">{product.size}</div>
                            
                        </div> */}
                    </div>
                </div>
                <button onClick={() => removeFromCart(product)} className="leading-none h-0 justify-self-end text-black">x</button>
            </div>
            <div className="flex items-center justify-between p-2 border-t-2 border-black">
                <h3 className="text-[18px]">{product.final_price} тг.</h3>

                {/* <div className="flex items-center rounded-full h-[42px] font-bold">
                    <p className="select-none cursor-pointer bg-black text-white flex items-center justify-center m-1 rounded-full w-[30px] h-[30px] text-center leading-none "
                      onClick={() => decreaseQuantity(product)} >-</p>

                    <p className="select-none w-[30px] text-center">{product.qty}</p>
                    <p className="select-none cursor-pointer bg-black text-white flex items-center justify-center m-1 rounded-full w-[30px] h-[30px] text-center leading-none "
                       onClick={() => increaseQuantity(product)}>+</p>
                </div> */}
                <div className="flex items-center gap-2">

                    {sirops.map(sirop => {
                        if (sirop.name == product.sirop) {
                            return (
                                <div
                                    onClick={() => handleOpen()}
                                    key={sirop.name}
                                    className="border-4 sm:text-[14px] text-[12px] sm:px-4 px-2 sm:p-2 p-1 rounded-full font-black cursor-pointer transition-all"
                                    style={{
                                        borderColor: sirop.color
                                    }}
                                >
                                    {sirop.name}
                                </div>
                            )
                        }
                    })}
                    <div onClick={() => handleOpen()} className="border-4 rounded-full sm:text-[14px] text-[12px] sm:px-4 px-2 sm:p-2 p-1  cursor-pointer transition-all bg-black text-white border-black">{product.size}</div>

                    {/* <div onClick={() => handleOpen()} className="border-2 rounded-full p-1 px-2  hover:bg-black cursor-pointer transition-all hover:text-white bg-white text-black border-black text-[14px]">Изменить</div> */}
                </div>
            </div>
            <CoffeeConstructor
                product={product}
                isOpen={open}
                onClose={() => setOpen(false)}
                onUpdate={handleUpdate}
                isEditMode={true}
            />
        </div>
    )
}