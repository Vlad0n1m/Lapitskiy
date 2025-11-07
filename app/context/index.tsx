import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware'
import toast from "react-hot-toast";

interface IProduct {
    uid: string;
    id?: string; // Product ID from DB
    name: string;
    description?: string;
    // Legacy fields (for backward compatibility)
    small_price?: number;
    medium_price?: number;
    big_price?: number;
    sirop_price?: number;
    sirop?: string;
    final_price: number;
    size: string;
    volumeMl?: number; // Volume in ml for selected size
    image_url: string;
    slug?: string;
    qty: number;
    // New fields for extended constructor
    temperature?: 'hot' | 'cold';
    syrupId?: string;
    syrupName?: string;
    milkId?: string;
    milkName?: string;
    extraIds?: string[]; // Array of extra IDs
    extraNames?: string[]; // Array of extra names
    // Product configuration (from API)
    sizes?: Array<{ id: string; name: string; volumeMl: number; price: number }>;
    availableSyrups?: Array<{ id: string; name: string; price: number }>;
    availableMilks?: Array<{ id: string; name: string; price: number }>;
    availableExtras?: Array<{ id: string; name: string; price: number }>;
    allowHot?: boolean;
    allowCold?: boolean;
    hotSurcharge?: number;
    coldSurcharge?: number;
}

interface IOrder {
    id: string;
    date: string;
    totalPrice: number;
    products: IProduct[];
    orderData: {
        paymentMethod: string;
        deliveryMethod: string;
        address?: string;
        phone: string;
        comment?: string;
    };
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
}

interface ICartStore {
    cart: IProduct[];
    orders: IOrder[];
    addToCart: (arg: IProduct) => void;
    updateProduct: (arg: IProduct) => void;
    removeFromCart: (arg: IProduct) => void;
    increaseQuantity: (arg: IProduct) => void;
    decreaseQuantity: (arg: IProduct) => void;
    getTotalPrice: () => number;
    clearCart: () => void;
    addOrder: (orderData: any) => Promise<void>;
    getOrders: () => IOrder[];
}

const useCart = create<ICartStore>()(
    persist(
        (set, get) => ({
            cart: [],
            orders: [],
            addToCart: (newProduct) => set((state) => {
                // const existingProductIndex = state.cart.findIndex(item => item === newProduct);
                // if (existingProductIndex !== -1) {
                //     // If the product already exists in the cart, update its quantity
                //     const updatedCart = [...state.cart];
                //     updatedCart[existingProductIndex].qty += newProduct.qty;

                //     return { cart: updatedCart };
                // } else {
                //     // If the product is not in the cart, add it
                toast.success(`${newProduct.name} x ${newProduct.qty} - добавленно в корзину`);
                return { cart: [...state.cart, newProduct] };

                // }
            }),
            removeFromCart: (Product) => set((state) => ({ cart: state.cart.filter((el) => el.uid != Product.uid) })),
            increaseQuantity: (product: IProduct) => set((state) => ({
                cart: state.cart.map((item) => {
                    if (item === product && item.qty < 100) {
                        return { ...item, qty: item.qty + 1 };
                    }
                    return item;
                })
            })),
            updateProduct: (product: IProduct) => set((state) => ({
                cart: state.cart.map((item) => {
                    if (item.uid === product.uid) {
                        if (item !== product) {
                            toast.success(`Изменен ${product.name}`);
                        }
                        return product;
                    }
                    return item;
                })
            })),
            decreaseQuantity: (product: IProduct) => set((state) => ({
                cart: state.cart.map((item) => {
                    if (item === product && item.qty > 1) {
                        return { ...item, qty: item.qty - 1 };
                    }
                    return item;
                })
            })),
            getTotalPrice: () => {
                const totalPrice = get().cart.reduce((total, item) => {
                    return total + (item.final_price * item.qty);
                }, 0);
                return totalPrice;
            },
            clearCart: () => set(() => ({ cart: [] })),
            addOrder: async (orderData) => {
                const cart = get().cart;
                const totalPrice = get().getTotalPrice();

                // Отправка заказа через новый API
                try {
                    const response = await fetch('/api/orders/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            phone: orderData.phone,
                            totalPrice: totalPrice,
                            paymentMethod: orderData.paymentMethod,
                            deliveryMethod: orderData.deliveryMethod,
                            deliveryAddress: orderData.address,
                            comment: orderData.comment,
                            products: cart.map(item => ({
                                name: item.name,
                                size: item.size,
                                volumeMl: item.volumeMl,
                                sirop: item.sirop,
                                syrupId: item.syrupId,
                                milkId: item.milkId,
                                extraIds: item.extraIds,
                                temperature: item.temperature,
                                qty: item.qty,
                                final_price: item.final_price
                            }))
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        // Создаем заказ с ID из Supabase
                        const newOrder: IOrder = {
                            id: result.order.id,
                            date: new Date().toISOString(),
                            totalPrice: totalPrice,
                            products: [...cart],
                            orderData: orderData,
                            status: 'pending' // Будет обновлен через realtime
                        };

                        set((state) => ({
                            orders: [newOrder, ...state.orders],
                            cart: []
                        }));

                        toast.success('Заказ успешно оформлен! Ожидайте подтверждения.');
                    } else {
                        console.error('Failed to create order:', result);
                        toast.error('Ошибка при создании заказа. Попробуйте снова.');
                    }
                } catch (error) {
                    console.error('Error creating order:', error);
                    toast.error('Ошибка при создании заказа. Попробуйте снова.');
                }
            },
            getOrders: () => get().orders

        }),
        {
            name: 'cart-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    )
)


export { useCart };
export type { IProduct, IOrder }
