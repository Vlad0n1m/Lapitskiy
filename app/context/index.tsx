import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware'
import toast from "react-hot-toast";

interface IProduct {
    uid: string;
    name: string;
    description: string;
    small_price: number;
    medium_price: number;
    big_price: number;
    sirop_price: number;
    sirop: string;
    final_price: number;
    size: string;
    image_url: string;
    slug: string;
    qty: number;
}

interface ICartStore {
    cart: IProduct[];
    addToCart: (arg: IProduct) => void;
    updateProduct: (arg: IProduct) => void;
    removeFromCart: (arg: IProduct) => void;
    increaseQuantity: (arg: IProduct) => void;
    decreaseQuantity: (arg: IProduct) => void;
    getTotalPrice: () => number;
}

const useCart = create<ICartStore>()(
    persist(
        (set, get) => ({
            cart: [],
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
            }

        }),
        {
            name: 'cart-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    )
)


export { useCart };
export type { IProduct }
