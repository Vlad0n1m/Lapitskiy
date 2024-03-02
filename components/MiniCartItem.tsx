'use client'
import Image from 'next/image'
import { useState, useEffect } from "react"
import { IProduct, useCart } from "@/app/context";
import { sirops } from '@/app/constants/coffe';
import { createPortal } from 'react-dom';

export default function MiniCartItem(product: IProduct) {
    // const [qty, changeQty] = useState(product.qty)
    const [price, changePrice] = useState(1100)
    const [open, setOpen] = useState(false)
    const updateProduct = useCart((state) => state.updateProduct)
    const handleUpdate =(product:any) => {
        updateProduct(product)
        handleOpen()
    }
    const [chosenSirop, setChosenSirop] = useState("Нет")
    const [chosenSize, setChosenSize] = useState("Маленький");
    const [finalPrice, setFinalPrice] = useState(product.small_price)

    const removeFromCart = useCart((state) => state.removeFromCart)
    // const increaseQuantity = useCart(state => state.increaseQuantity)
    // const decreaseQuantity = useCart(state => state.decreaseQuantity)
    const sizes = ["Маленький", "Средний", "Большой"];
    const handleOpen = () => {
        setChosenSirop(product.sirop)
        setChosenSize(product.size)
        setOpen(open ? false : true)
        console.log(open)
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

                    <Image style={{ filter: '' }} src={`${product.image_url}`} objectFit={"cover"} width={100} height={100} alt="Чаи" className="w-[65px] h-[65px] rounded-xl" />
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
            {createPortal(
                (<div className={`${open ? 'block' : 'hidden'} max-w-[700px] max-h-[800px] sm:h-[90vh] h-[100dvh] min-h-[300px] w-screen fixed flex flex-col justify-between items-center overflow-y-auto gap-2 bg-white z-50 sm:rounded-xl p-4  left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]`}>
                    <div className="flex flex-col items-center">
                        <Image src={`${product.image_url}`} alt={product.name} width={300} height={200} className="rounded-xl mb-4 mt-6" />
                        <p className={`font-black text-[32px] leading-none `}>{product.name}</p>
                        <p className={` text-[16px] text-center max-w-[70%]`}>{product.description}</p>
                        <div className="h-[1px] opacity-20 w-full bg-black my-4"></div>
                        <div className="w-full flex flex-col gap-4 items-center">
                            <p>Размер стаканчика</p>
                            <div className="flex items-center gap-2 flex-wrap justify-center">
                                {sizes.map(size => (
                                    <div
                                        key={size}
                                        className={`border-2 border-black px-4 p-2 rounded-full font-black cursor-pointer ${chosenSize === size ? 'bg-black text-white' : 'bg-white text-black'}`}
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
                    <button onClick={() => handleUpdate({ ...product, final_price: finalPrice, sirop: chosenSirop, size: chosenSize })} className={'w-full bg-black rounded-full font-black p-4 text-white self-end justify-self-end place-self-end'}>Изменить - {finalPrice} тг</button>
                    <div onClick={() => handleOpen()} className={`${open ? 'block' : 'hidden'} absolute text-[20px] top-[10px] right-[20px] cursor-pointer z-50 bg-opacity-40 font-black`}>x</div>
                </div>)
            , document.body
            )}
            <div style={{ position: 'absolute', transform: ' translateX(calc(-100% + 400px))' }} onClick={() => handleOpen()} className={`${open ? 'block' : 'hidden'} absolute bg-black top-0 left-0 w-screen h-full cursor-pointer z-50  bg-opacity-40`}></div>
        </div>
    )
}