'use client'
import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuCard from "@/components/MenuCard";
import { uid } from "uid";
import Image from "next/image";
import MenuLink from "@/components/MenuLink";
export default function MenuPage() {
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
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products?populate=image`)
            .then(response => {
                // console.log(response.data.data);
                setProducts(response.data.data); // Устанавливаем полученные товары
            })
            .catch(error => {
                // console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div className="flex flex-col gap-6 item">
            <h1 className="text-[52px] uppercase font-black text-center mt-4">Меню</h1>
            <div className="flex flex-wrap md:w-[60%] self-center">
                <MenuLink name="Кофе" image_url="/coffe.webp" id="coffe" />
                <MenuLink name="Чаи" image_url="/tea.webp" id="coffe" />
                <MenuLink name="Круассаны" image_url="/croisant-card.webp" id="coffe" />
                <MenuLink name="Выпечка" image_url="/macaroon.webp" id="coffe" />
                <MenuLink name="Печенье" image_url="/rahat.webp" id="coffe" />
                <MenuLink name="Секретное меню" image_url="/cheese.webp" id="coffe" />
            </div>
            <h1 className="text-[52px] uppercase font-black text-center mt-4">Кофе</h1>

            <div className="flex flex-wrap">
                {products.map(product => (
                    <MenuCard
                        uid={uid()}
                        sirop="Нет"
                        final_price={product.attributes.small_price}
                        size="Маленький"
                        key={product.id}
                        name={product.attributes.name}
                        description={product.attributes.description}
                        small_price={product.attributes.small_price}
                        medium_price={product.attributes.medium_price}
                        big_price={product.attributes.big_price}
                        sirop_price={product.attributes.sirop_price}
                        image_url={`${product.attributes.image.data.attributes.url}`}
                        slug={product.attributes.slug}
                        qty={1}
                    />
                ))}
            </div>
        </div>
    );
}
