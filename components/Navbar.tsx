"use client";

import MiniCartItem from "./MiniCartItem";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sling as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context";
import { Toaster } from 'react-hot-toast';
import Image from "next/image";
export default function Navbar() {
    const [cartIsOpen, cartSetOpen] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        isOpen
            ? document.body.classList.add("overflow-hidden")
            : document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    useEffect(() => {
        cartIsOpen
            ? document.body.classList.add("overflow-hidden")
            : document.body.classList.remove("overflow-hidden");
    }, [cartIsOpen]);

    function handleCartOpen() {
        setOpen(false);
        console.log(products)
        cartIsOpen ? cartSetOpen(false) : cartSetOpen(true);
    }
    
    const variants = {
        open: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        closed: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
    };
    // const {cart, setCart} = useAppContext();
    // useEffect(()=>{
    //   let fetchProducts = async (queryString) => {
    //     try {
    //       let response = await axios.get(queryString);
    //       let fetchedProducts = response.data.data.map(item => ({
    //         id: item.id,
    //         name: item.attributes.name,
    //         description: item.attributes.description,
    //         price: item.attributes.price,
    //         photo_url: item.attributes.image.data.attributes.url,
    //         slug: item.attributes.slug
    //       }));
    //       fetchedProducts.forEach(obj => {
    //         let id = obj.slug.toString();
    //         if (id in cart.cart.products) {
    //           obj.qty = cart.cart.products[id];
    //         } else {
    //           obj.qty = 1;
    //         }
    //       });
    //       setProducts(fetchedProducts);
    //     } catch (error) {
    //       console.error('Ошибка при получении данных о продуктах:', error);
    //     }
    //   };
    //   let resultArray = Object.entries(cart.cart.products).map(([productName, quantity]) => ({ [productName]: quantity }));
    //   let query = resultArray.map(obj => `filters[slug][$eq]=${Object.keys(obj)[0]}&`).join('');
    //   let queryString = `http://localhost:1337/api/products?${query}populate=image`;
    //   fetchProducts(queryString)
    // }, [cart])

    const getTotalPrice = useCart((state) => state.getTotalPrice)
    const cart = useCart((state) => state.cart)
    const [totalPrice, setTotalPrice] = useState(0)
    useEffect(() => {
        setTotalPrice(getTotalPrice())
    }, [cart])
    return (
        <div className={`sticky bg-elbone top-0  z-40`}>
            <Toaster />
            <div className="pt-3 flex mx-auto max-w-[1360px] px-[10px] items-center justify-between sm:justify-between">
                <Link href="/" className="font-black text-2xl pt-3">
                    <Image alt={'Lapitskiy'} width={100} height={50} src={'/logo.png'}></Image>
                </Link>
                <div className="gap-2 lg:gap-4 items-center hidden md:flex">
                    <Link
                        href="/"
                        className="text-[14px] lg:text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                    >
                        Главная
                    </Link>
                    <Link
                        href="/about"
                        className="text-[14px] lg:text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                    >
                        О нас
                    </Link>
                    <Link
                        href="/menu"
                        className="text-[14px] lg:text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                    >
                        Меню
                    </Link>
                    <Link
                        href="/shipping"
                        className="text-[14px] lg:text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                    >
                        Доставка
                    </Link>
                    <Link
                        href="/contacts"
                        className="text-[14px] lg:text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                    >
                        Контакты
                    </Link>
                    <Link
                        href="/blog"
                        className="text-[14px] lg:text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                    >
                        Блог
                    </Link>
                    <form action="" className="group relative hidden lg:block">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className="border-black border-2 bg-transparent rounded-xl p-2 focus:bg-white transition-all "
                        />
                        <button className="absolute h-[20px] w-[20px] top-[50%] right-[10px] -translate-y-[50%] ">
                            <svg
                                fill="#000000"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#000000"
                                stroke-width="2.4"
                            >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M10.035,18.069a7.981,7.981,0,0,0,3.938-1.035l3.332,3.332a2.164,2.164,0,0,0,3.061-3.061l-3.332-3.332A8.032,8.032,0,0,0,4.354,4.354a8.034,8.034,0,0,0,5.681,13.715ZM5.768,5.768A6.033,6.033,0,1,1,4,10.035,5.989,5.989,0,0,1,5.768,5.768Z"></path>
                                </g>
                            </svg>
                        </button>
                    </form>
                    <div className="w-[30px] lg:hidden">
                        <svg
                            fill="#000000"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#000000"
                            stroke-width="2.4"
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M10.035,18.069a7.981,7.981,0,0,0,3.938-1.035l3.332,3.332a2.164,2.164,0,0,0,3.061-3.061l-3.332-3.332A8.032,8.032,0,0,0,4.354,4.354a8.034,8.034,0,0,0,5.681,13.715ZM5.768,5.768A6.033,6.033,0,1,1,4,10.035,5.989,5.989,0,0,1,5.768,5.768Z"></path>
                            </g>
                        </svg>
                    </div>

                    <div
                        className=" mx-1 cursor-pointer"
                        onClick={() => handleCartOpen()}
                    >
                        {/*<svg*/}
                        {/*    viewBox="0 0 24 24"*/}
                        {/*    fill="none"*/}
                        {/*    xmlns="http://www.w3.org/2000/svg"*/}
                        {/*    stroke="#ffffff"*/}
                        {/*    transform="rotate(0)"*/}
                        {/*>*/}
                        {/*    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>*/}
                        {/*    <g*/}
                        {/*        id="SVGRepo_tracerCarrier"*/}
                        {/*        stroke-linecap="round"*/}
                        {/*        stroke-linejoin="round"*/}
                        {/*        stroke="#000000"*/}
                        {/*        stroke-width="0.096"*/}
                        {/*    ></g>*/}
                        {/*    <g id="SVGRepo_iconCarrier">*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M3.86376 16.4552C3.00581 13.0234 2.57684 11.3075 3.47767 10.1538C4.3785 9 6.14721 9 9.68462 9H14.3153C17.8527 9 19.6214 9 20.5222 10.1538C21.4231 11.3075 20.9941 13.0234 20.1362 16.4552C19.5905 18.6379 19.3176 19.7292 18.5039 20.3646C17.6901 21 16.5652 21 14.3153 21H9.68462C7.43476 21 6.30983 21 5.49605 20.3646C4.68227 19.7292 4.40943 18.6379 3.86376 16.4552Z"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M19.5 9.5L18.7896 6.89465C18.5157 5.89005 18.3787 5.38775 18.0978 5.00946C17.818 4.63273 17.4378 4.34234 17.0008 4.17152C16.5619 4 16.0413 4 15 4M4.5 9.5L5.2104 6.89465C5.48432 5.89005 5.62128 5.38775 5.90221 5.00946C6.18199 4.63273 6.56216 4.34234 6.99922 4.17152C7.43808 4 7.95872 4 9 4"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4C15 4.55228 14.5523 5 14 5H10C9.44772 5 9 4.55228 9 4Z"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M8 13V17"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*            stroke-linecap="round"*/}
                        {/*            stroke-linejoin="round"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M16 13V17"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*            stroke-linecap="round"*/}
                        {/*            stroke-linejoin="round"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M12 13V17"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*            stroke-linecap="round"*/}
                        {/*            stroke-linejoin="round"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*    </g>*/}
                        {/*</svg>*/}
                        <h3 className="text-[14px] lg:text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all">{totalPrice} тг</h3>
                    </div>
                </div>
                <div className="flex items-center flex-row-reverse md:hidden">
                    <div
                        className=" mx-1 cursor-pointer"
                        onClick={() => handleCartOpen()}
                    >
                        {/*<svg*/}
                        {/*    viewBox="0 0 24 24"*/}
                        {/*    fill="none"*/}
                        {/*    xmlns="http://www.w3.org/2000/svg"*/}
                        {/*    stroke="#ffffff"*/}
                        {/*    transform="rotate(0)"*/}
                        {/*>*/}
                        {/*    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>*/}
                        {/*    <g*/}
                        {/*        id="SVGRepo_tracerCarrier"*/}
                        {/*        stroke-linecap="round"*/}
                        {/*        stroke-linejoin="round"*/}
                        {/*        stroke="#000000"*/}
                        {/*        stroke-width="0.096"*/}
                        {/*    ></g>*/}
                        {/*    <g id="SVGRepo_iconCarrier">*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M3.86376 16.4552C3.00581 13.0234 2.57684 11.3075 3.47767 10.1538C4.3785 9 6.14721 9 9.68462 9H14.3153C17.8527 9 19.6214 9 20.5222 10.1538C21.4231 11.3075 20.9941 13.0234 20.1362 16.4552C19.5905 18.6379 19.3176 19.7292 18.5039 20.3646C17.6901 21 16.5652 21 14.3153 21H9.68462C7.43476 21 6.30983 21 5.49605 20.3646C4.68227 19.7292 4.40943 18.6379 3.86376 16.4552Z"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M19.5 9.5L18.7896 6.89465C18.5157 5.89005 18.3787 5.38775 18.0978 5.00946C17.818 4.63273 17.4378 4.34234 17.0008 4.17152C16.5619 4 16.0413 4 15 4M4.5 9.5L5.2104 6.89465C5.48432 5.89005 5.62128 5.38775 5.90221 5.00946C6.18199 4.63273 6.56216 4.34234 6.99922 4.17152C7.43808 4 7.95872 4 9 4"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4C15 4.55228 14.5523 5 14 5H10C9.44772 5 9 4.55228 9 4Z"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M8 13V17"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*            stroke-linecap="round"*/}
                        {/*            stroke-linejoin="round"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M16 13V17"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*            stroke-linecap="round"*/}
                        {/*            stroke-linejoin="round"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*        <path*/}
                        {/*            d="M12 13V17"*/}
                        {/*            stroke="#000000"*/}
                        {/*            stroke-width="1.5"*/}
                        {/*            stroke-linecap="round"*/}
                        {/*            stroke-linejoin="round"*/}
                        {/*        ></path>*/}
                        {/*        {" "}*/}
                        {/*    </g>*/}
                        {/*</svg>*/}
                        <h3 className="text-[14px] lg:text-[18px] p-2 bg-black text-white rounded-xl font-bold transition-all">{totalPrice} тг</h3>
                    </div>
                    <Hamburger size={20} toggled={isOpen} onToggle={setOpen} />
                </div>
            </div>
            <motion.div
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                className={`w-full navbar-height absolute flex bg-elbone md:hidden flex-col gap-[20px] items-center justify-between p-[10px] z-30`}
            >
                <div className="flex flex-col gap-[10px] items-center w-full">
                    <form action="" className="group relative w-full">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className="w-full border-black border-2 bg-transparent rounded-xl p-2 focus:bg-white transition-all "
                        />
                        <button className="absolute h-[20px] w-[20px] top-[50%] right-[10px] -translate-y-[50%] ">
                            <svg
                                fill="#000000"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#000000"
                                stroke-width="2.4"
                            >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M10.035,18.069a7.981,7.981,0,0,0,3.938-1.035l3.332,3.332a2.164,2.164,0,0,0,3.061-3.061l-3.332-3.332A8.032,8.032,0,0,0,4.354,4.354a8.034,8.034,0,0,0,5.681,13.715ZM5.768,5.768A6.033,6.033,0,1,1,4,10.035,5.989,5.989,0,0,1,5.768,5.768Z"></path>
                                </g>
                            </svg>
                        </button>
                    </form>
                    <div className="flex w-full text-center">
                        <Link
                            onClick={() => setOpen(false)}
                            href="/"
                            className="w-full text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                        >
                            Главная
                        </Link>
                        <Link
                            onClick={() => setOpen(false)}
                            href="/about"
                            className="w-full text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                        >
                            О нас
                        </Link>
                        <Link
                            onClick={() => setOpen(false)}
                            href="/"
                            className="w-full text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                        >
                            Блог
                        </Link>
                    </div>
                    <div className="flex w-full text-center">
                        <Link
                            onClick={() => setOpen(false)}
                            href="/"
                            className="w-full text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                        >
                            Контакты
                        </Link>
                        <Link
                            onClick={() => setOpen(false)}
                            href="/shipping"
                            className="w-full text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                        >
                            Доставка
                        </Link>
                        <Link
                            onClick={() => setOpen(false)}
                            href="/menu"
                            className="w-full text-[18px] p-2 hover:bg-black hover:text-white rounded-xl font-bold transition-all"
                        >
                            Меню
                        </Link>
                    </div>

                    <div className="flex flex-col gap-[0px] p-[10px] rounded-xl border-black border-2 w-full ">
                        <div className="flex flex-col p-2">
                            <p className="opacity-80 text-[14px] leading-none mb-[10px]">
                                Наш телефон
                            </p>
                            <h3 className="font-black text-[26px] leading-none">
                                8 (705) 336 5949
                            </h3>
                        </div>
                        <div className="flex flex-col p-2">
                            <p className="opacity-80 text-[14px] leading-none mb-[10px]">
                                Наша почта
                            </p>
                            <h3 className="font-black text-[26px] leading-none">
                                lapitskiy@gmail.com
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[0px] p-[10px] rounded-xl border-black border-2 w-full ">
                    <div className="flex flex-col p-2">
                        <p className="opacity-80 text-[14px] leading-none mb-[10px]">
                            Наши адреса{" "}
                        </p>
                        <h3 className="font-black text-[20px] leading-none">
                            ул. Набережная, 25А
                        </h3>
                        <h3 className="font-black text-[20px] leading-none">
                            ул. Букетова, 29
                        </h3>
                        <h3 className="font-black text-[20px] leading-none">
                            ул. Жамбыла Жабаева, 142Б
                        </h3>
                    </div>
                    <div className="flex flex-col p-2">
                        <p className="opacity-80 text-[14px] leading-none mb-[10px]">
                            Наши соцсети
                        </p>
                        <div className="flex gap-4 items-center ">
                            <Link
                                href="https://www.instagram.com/bakehouse_lapitskiy/"
                                rel="nofollow"
                                className="bg-black rounded-full w-[40px] h-[40px] p-2"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                                            fill="#ffffff"
                                        ></path>
                                        {" "}
                                        <path
                                            d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                                            fill="#ffffff"
                                        ></path>
                                        {" "}
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                                            fill="#ffffff"
                                        ></path>
                                        {" "}
                                    </g>
                                </svg>
                            </Link>
                            <Link
                                href="/"
                                rel="nofollow"
                                className="bg-black rounded-full w-[40px] h-[40px] p-2"
                            >
                                <svg
                                    fill="#ffffff"
                                    viewBox="-2.5 0 32 32"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    stroke="#ffffff"
                                >
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <title>vk</title>{" "}
                                        <path
                                            d="M16.563 15.75c-0.5-0.188-0.5-0.906-0.531-1.406-0.125-1.781 0.5-4.5-0.25-5.656-0.531-0.688-3.094-0.625-4.656-0.531-0.438 0.063-0.969 0.156-1.344 0.344s-0.75 0.5-0.75 0.781c0 0.406 0.938 0.344 1.281 0.875 0.375 0.563 0.375 1.781 0.375 2.781 0 1.156-0.188 2.688-0.656 2.75-0.719 0.031-1.125-0.688-1.5-1.219-0.75-1.031-1.5-2.313-2.063-3.563-0.281-0.656-0.438-1.375-0.844-1.656-0.625-0.438-1.75-0.469-2.844-0.438-1 0.031-2.438-0.094-2.719 0.5-0.219 0.656 0.25 1.281 0.5 1.813 1.281 2.781 2.656 5.219 4.344 7.531 1.563 2.156 3.031 3.875 5.906 4.781 0.813 0.25 4.375 0.969 5.094 0 0.25-0.375 0.188-1.219 0.313-1.844s0.281-1.25 0.875-1.281c0.5-0.031 0.781 0.406 1.094 0.719 0.344 0.344 0.625 0.625 0.875 0.938 0.594 0.594 1.219 1.406 1.969 1.719 1.031 0.438 2.625 0.313 4.125 0.25 1.219-0.031 2.094-0.281 2.188-1 0.063-0.563-0.563-1.375-0.938-1.844-0.938-1.156-1.375-1.5-2.438-2.563-0.469-0.469-1.063-0.969-1.063-1.531-0.031-0.344 0.25-0.656 0.5-1 1.094-1.625 2.188-2.781 3.188-4.469 0.281-0.5 0.938-1.656 0.688-2.219-0.281-0.625-1.844-0.438-2.813-0.438-1.25 0-2.875-0.094-3.188 0.156-0.594 0.406-0.844 1.063-1.125 1.688-0.625 1.438-1.469 2.906-2.344 4-0.313 0.375-0.906 1.156-1.25 1.031z"></path>
                                        {" "}
                                    </g>
                                </svg>
                            </Link>
                            <Link
                                href="/"
                                rel="nofollow"
                                className="bg-black rounded-full w-[40px] h-[40px] p-2"
                            >
                                <svg
                                    viewBox="0 -3 20 20"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#000000"
                                >
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <title>youtube [#ffffff]</title>{" "}
                                        <desc>Created with Sketch.</desc>
                                        <defs></defs>
                                        {" "}
                                        <g
                                            id="Page-1"
                                            stroke="none"
                                            stroke-width="1"
                                            fill="none"
                                            fill-rule="evenodd"
                                        >
                                            {" "}
                                            <g
                                                id="Dribbble-Light-Preview"
                                                transform="translate(-300.000000, -7442.000000)"
                                                fill="#ffffff"
                                            >
                                                {" "}
                                                <g
                                                    id="icons"
                                                    transform="translate(56.000000, 160.000000)"
                                                >
                                                    {" "}
                                                    <path
                                                        d="M251.988432,7291.58588 L251.988432,7285.97425 C253.980638,7286.91168 255.523602,7287.8172 257.348463,7288.79353 C255.843351,7289.62824 253.980638,7290.56468 251.988432,7291.58588 M263.090998,7283.18289 C262.747343,7282.73013 262.161634,7282.37809 261.538073,7282.26141 C259.705243,7281.91336 248.270974,7281.91237 246.439141,7282.26141 C245.939097,7282.35515 245.493839,7282.58153 245.111335,7282.93357 C243.49964,7284.42947 244.004664,7292.45151 244.393145,7293.75096 C244.556505,7294.31342 244.767679,7294.71931 245.033639,7294.98558 C245.376298,7295.33761 245.845463,7295.57995 246.384355,7295.68865 C247.893451,7296.0008 255.668037,7296.17532 261.506198,7295.73552 C262.044094,7295.64178 262.520231,7295.39147 262.895762,7295.02447 C264.385932,7293.53455 264.28433,7285.06174 263.090998,7283.18289"
                                                        id="youtube-[#ffffff]"
                                                    >
                                                        {" "}
                                                    </path>
                                                    {" "}
                                                </g>
                                                {" "}
                                            </g>
                                            {" "}
                                        </g>
                                        {" "}
                                    </g>
                                </svg>
                            </Link>
                            <Link
                                href="/"
                                rel="nofollow"
                                className="bg-black rounded-full w-[40px] h-[40px] p-2"
                            >
                                <svg
                                    fill="#ffffff"
                                    viewBox="-5.5 0 32 32"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    stroke="#ffffff"
                                >
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <title>facebook</title>{" "}
                                        <path
                                            d="M1.188 5.594h18.438c0.625 0 1.188 0.563 1.188 1.188v18.438c0 0.625-0.563 1.188-1.188 1.188h-18.438c-0.625 0-1.188-0.563-1.188-1.188v-18.438c0-0.625 0.563-1.188 1.188-1.188zM14.781 17.281h2.875l0.125-2.75h-3v-2.031c0-0.781 0.156-1.219 1.156-1.219h1.75l0.063-2.563s-0.781-0.125-1.906-0.125c-2.75 0-3.969 1.719-3.969 3.563v2.375h-2.031v2.75h2.031v7.625h2.906v-7.625z"></path>
                                        {" "}
                                    </g>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
            <div
                className={`${cartIsOpen ? "block" : "hidden"
                    } absolute cursor-pointer bg-black opacity-50 w-screen h-screen z-40 top-0 left-0`}
                onClick={() => handleCartOpen()}
            ></div>

            <div
                className={`fixed ${cartIsOpen ? "right-[0px]" : "sm:-right-[400px] -right-[100vw]"
                    } flex-col transition-all select-none h-[100dvh] w-screen sm:w-[400px] top-0 bg-elbone shadow-xl flex justify-between  font-black text-[24px] z-40`}
            >
                <div className="flex justify-between items-center p-5">
                    <h3>Корзина</h3>
                    <button onClick={() => handleCartOpen()}>X</button>
                </div>
                <div className="overflow-y-auto">
                    <div className="flex flex-col gap-4 p-5"> 
                        {cart.length > 0 ? (
                            cart.map(product => (
                                <MiniCartItem key={product.uid} uid={product.uid} qty={product.qty} name={product.name}
                                    image_url={product.image_url} size={product.size} slug={product.slug} description={product.description} small_price={product.small_price} medium_price={product.medium_price} big_price={product.big_price} final_price={product.final_price} sirop={product.sirop} sirop_price={product.sirop_price} />
                            ))
                        ) : (
                            <p>Корзина пуста</p>
                        )}
                    </div>
                </div>
                {cart.length > 0 ? (
                    <div
                        className="bg-white p-5 h-[200px] shadow-xl border-t-black border-2 flex flex-col gap-4 justify-between">
                        <p className="font-light text-[14px]">Общая сумма заказа - {totalPrice} тг</p>
                        <button className="bg-black w-full rounded-full text-white p-3 text-[18px]">
                            Оформить заказ
                        </button>
                    </div>) : <div></div>}
            </div>
        </div>
    );
}
