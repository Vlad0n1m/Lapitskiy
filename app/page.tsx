'use client'
import React, { useEffect, useState } from "react";
import MenuCard from "@/components/MenuCard";
import { uid } from "uid";
import MenuLink from "@/components/MenuLink";
import { IProduct } from "@/app/context";

export default function Home() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch('/api/products?categorySlug=coffe');
                const data = await response.json();
                if (data.success && data.items) {
                    // Преобразуем продукты из API в формат IProduct
                    const formattedProducts: IProduct[] = data.items.map((item: any) => {
                        // Находим минимальную цену из размеров или используем базовую цену
                        const minPrice = item.sizes && item.sizes.length > 0
                            ? Math.min(...item.sizes.map((s: any) => s.price))
                            : item.price;

                        return {
                            uid: uid(),
                            id: item.id,
                            name: item.name,
                            description: '',
                            small_price: minPrice,
                            medium_price: minPrice,
                            big_price: minPrice,
                            sirop_price: 0,
                            final_price: minPrice,
                            size: item.sizes && item.sizes.length > 0 ? item.sizes[0].name : 'Маленький',
                            image_url: item.imageUrl || '/cup.png',
                            slug: item.category?.slug || 'coffe',
                            qty: 1,
                            // Новые поля для конструктора
                            sizes: item.sizes?.map((s: any) => ({
                                id: s.id,
                                name: s.name,
                                volumeMl: s.volumeMl,
                                price: s.price,
                            })),
                            availableSyrups: item.syrups?.filter((ps: any) => ps.syrup).map((ps: any) => ({
                                id: ps.syrup.id,
                                name: ps.syrup.name,
                                price: ps.syrup.price,
                            })),
                            availableMilks: item.milks?.filter((pm: any) => pm.milk).map((pm: any) => ({
                                id: pm.milk.id,
                                name: pm.milk.name,
                                price: pm.milk.price,
                            })),
                            availableExtras: item.extras?.filter((pe: any) => pe.extra).map((pe: any) => ({
                                id: pe.extra.id,
                                name: pe.extra.name,
                                price: pe.extra.price,
                            })),
                            allowHot: item.allowHot,
                            allowCold: item.allowCold,
                            hotSurcharge: item.hotSurcharge,
                            coldSurcharge: item.coldSurcharge,
                        };
                    });
                    setProducts(formattedProducts);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
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

            {loading ? (
                <div className="text-center text-white py-8">Загрузка...</div>
            ) : products.length === 0 ? (
                <div className="text-center text-white py-8">Нет доступных продуктов</div>
            ) : (
                <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
                    {products.map(product => (
                        <MenuCard
                            key={product.id || product.uid}
                            {...product}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
