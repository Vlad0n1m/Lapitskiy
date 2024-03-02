'use client'
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { IProduct, useCart } from "@/app/context";
import { sirops, sizes } from "@/app/constants/coffe";
import { uid } from "uid";
export default function ProductPage() {
    interface Product {
        id: number;
        attributes: {
            name: string;
            description: string;
            small_price: number;
            medium_price: number;
            big_price: number;
            sirop_price: number;
            image: {
                data: {
                    attributes: {
                        url: string;
                    };
                };
            };
            slug: string;
        };
    }
    const [finalPrice, setFinalPrice] = useState(0)
    const [chosenSize, setChosenSize] = useState('Маленький')
    const [chosenSirop, setChosenSirop] = useState("Нет")
    const addToCart = useCart((state) => (state.addToCart))

    const handleAddToCart = (product: IProduct) => {
        addToCart(product);
        setChosenSirop("Нет");
        setChosenSize("Маленький");
    }

    const productSlug = usePathname().split('/').pop()
    console.log(productSlug)
    const [product, setProduct] = useState<Product>()
    useEffect(() => {
        console.log(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products?filters[slug][$eq]=${productSlug}&populate=image`)
        axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products?filters[slug][$eq]=${productSlug}&populate=image`)
            .then(response => {
                console.log(response.data.data[0])
                setProduct(response.data.data[0]); // Устанавливаем полученные товары
                setFinalPrice(response.data.data[0].attributes.small_price)
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    useEffect(() => {
        let price = 0;
        if (product) {
            if (chosenSize == "Маленький") {
                price = product.attributes.small_price;
            } else if (chosenSize == "Средний") {
                price = product.attributes.medium_price
            } else if (chosenSize == "Большой") {
                price = product.attributes.big_price
            }
            if (chosenSirop != "Нет") {
                price += product.attributes.sirop_price
            }
        }
        setFinalPrice(price)
    }, [chosenSirop, chosenSize])
    useEffect(() => {
        console.log(product)
    }, [product])
    return product ? (
        <div className="flex flex-col md:flex-row items-center gap-0 sm:gap-16">
            <div className="flex flex-col items-center md:max-w-[30%] text-center">
                <Image src={`${product.attributes.image.data.attributes.url}`} alt={product.attributes.name} width={300} height={200} className="rounded-xl mb-4 mt-6" />
                <p className={`font-black text-[32px]`}>{product.attributes.name}</p>
                <p className={`text-[16px] text-center max-w-[70%]`}>{product.attributes.description}</p>
                <div className="h-[1px] block sm:hidden opacity-20 w-full bg-black my-4"></div>
            </div>
            <div className="flex flex-col items-start w-full max-w-full lg:max-w-[40%]">
                <div className="w-full flex flex-col gap-4 items-start">
                    <p>Размер стаканчика</p>
                    <div className="flex items-center gap-2 flex-wrap justify-start">
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
                <div className="w-full flex flex-col gap-4 mt-4 items-start">
                    <p>Сироп</p>
                    <div className="flex items-start gap-2 flex-wrap justify-start">
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
                <button className="font-black bg-black text-white mt-4 rounded-full p-4 w-full" onClick={() => handleAddToCart({ name: product.attributes.name, uid: uid(), small_price: product.attributes.small_price, medium_price: product.attributes.medium_price, big_price: product.attributes.big_price, description: product.attributes.description, sirop_price: product.attributes.sirop_price, size: chosenSize, sirop: chosenSirop, final_price: finalPrice, qty: 1, image_url: product.attributes.image.data.attributes.url, slug: product.attributes.slug })}>
                    Добавить - {finalPrice}тг
                </button>
            </div>
        </div>
    ) : (<p>Загрузка...</p>)
}