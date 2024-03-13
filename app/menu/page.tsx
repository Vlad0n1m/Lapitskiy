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
        // axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products?populate=image`)
        //     .then(response => {
        //         console.log(response.data.data);
        //         setProducts(response.data.data); // Устанавливаем полученные товары
        //     })
        //     .catch(error => {
        //         // console.error('Error fetching products:', error);
        //     });
        setProducts([
            {
                "id": 1,
                "attributes": {
                    "name": "Coffe",
                    "description": "description",
                    "slug": "coffe",
                    "createdAt": "2024-02-27T10:36:29.914Z",
                    "updatedAt": "2024-03-13T11:17:40.086Z",
                    "publishedAt": "2024-02-27T10:36:30.627Z",
                    "sirop_price": 100,
                    "small_price": 1100,
                    "medium_price": 1300,
                    "big_price": 1500,
                    "image": {
                        "data": {
                            "id": 2,
                            "attributes": {
                                "name": "cup.png",
                                "alternativeText": null,
                                "caption": null,
                                "width": 500,
                                "height": 454,
                                "formats": {
                                    "thumbnail": {
                                        "name": "cup.png",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 172,
                                        "height": 156,
                                        "size": 20.66,
                                        "url": "/cup.png"
                                    }
                                },
                                "hash": "image_removebg_preview_374291a18b",
                                "ext": ".png",
                                "mime": "image/png",
                                "size": 32.04,
                                "url": "/cup.png",
                                "previewUrl": null,
                                "provider": "local",
                                "provider_metadata": null,
                                "createdAt": "2024-02-27T10:55:29.945Z",
                                "updatedAt": "2024-03-13T11:17:38.604Z"
                            }
                        }
                    }
                }
            },
            {
                "id": 2,
                "attributes": {
                    "name": "tea",
                    "description": "desc",
                    "slug": "tea",
                    "createdAt": "2024-03-02T13:27:46.291Z",
                    "updatedAt": "2024-03-02T13:27:58.071Z",
                    "publishedAt": "2024-03-02T13:27:58.068Z",
                    "sirop_price": 100,
                    "small_price": 1000,
                    "medium_price": 1400,
                    "big_price": 1500,
                    "image": {
                        "data": {
                            "id": 1,
                            "attributes": {
                                "name": "cup.png",
                                "alternativeText": null,
                                "caption": null,
                                "width": 204,
                                "height": 192,
                                "formats": {
                                    "thumbnail": {
                                        "name": "cup.png",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 166,
                                        "height": 156,
                                        "size": 4.69,
                                        "url": "/cup.png"
                                    }
                                },
                                "ext": ".png",
                                "mime": "image/png",
                                "size": 5.08,
                                "url": "/cup.png",
                                "previewUrl": null,
                                "provider": "local",
                                "provider_metadata": null,
                                "createdAt": "2024-02-27T10:36:27.248Z",
                                "updatedAt": "2024-03-02T13:27:27.383Z"
                            }
                        }
                    }
                }
            }
        ])
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
                        // image_url={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.attributes.image.data.attributes.url}`}
                        image_url={`${product.attributes.image.data.attributes.url}`}
                        slug={product.attributes.slug}
                        qty={1}
                    />
                ))}
            </div>
        </div>
    );
}
