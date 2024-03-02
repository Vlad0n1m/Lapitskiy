'use client'
import BlogCard from "./BlogCard"
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {Navigation} from "swiper/modules";

export default function Blog() {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h2 className="font-black text-[32px]">Блог</h2>
                <div className="flex gap-2 items-center">
                    <div className="cursor-pointer swiper-button-prev w-[35px] h-[35px]">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="#000000" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                            </g>
                        </svg>
                    </div>
                    <div className="cursor-pointer swiper-button-next w-[35px] h-[35px]">

                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="#000000" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                            </g>
                        </svg>
                    </div>

                </div>
            </div>
            <div className="flex gap-4">
                <Swiper
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    spaceBetween={25}
                    slidesPerView={1}
                    modules={[Navigation]}
                    breakpoints={{
                        500: {
                            slidesPerView: 2,
                            spaceBetween: 25,
                        },
                        800: {
                            slidesPerView: 3,
                            spaceBetween: 25,
                        },
                        1060: {
                            slidesPerView: 4,
                            spaceBetween: 25,
                        },
                    }}
                >
                    <SwiperSlide>
                        <BlogCard article_url="/" image_url="/coffe.webp" title="Как правильно варить кофе?"
                                  description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi aspernatur libero consequuntur expedita repellendus impedit culpa facere ipsum soluta ea voluptates esse eos molestiae, voluptas quos illo, eum magnam. Ullam!"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <BlogCard article_url="/" image_url="/croisant-card.webp" title="Как мы печем такие круассаны?"
                                  description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi aspernatur libero consequuntur expedita repellendus impedit culpa facere ipsum soluta ea voluptates esse eos molestiae, voluptas quos illo, eum magnam. Ullam!"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <BlogCard article_url="/" image_url="/macaroon.webp" title="Че такое макарУны?"
                                  description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi aspernatur libero consequuntur expedita repellendus impedit culpa facere ipsum soluta ea voluptates esse eos molestiae, voluptas quos illo, eum magnam. Ullam!"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <BlogCard article_url="/" image_url="/milkshake.webp"
                                  title="Что лучше турка или турк при варке кофе?"
                                  description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi aspernatur libero consequuntur expedita repellendus impedit culpa facere ipsum soluta ea voluptates esse eos molestiae, voluptas quos illo, eum magnam. Ullam!"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <BlogCard article_url="/" image_url="/coffe.webp" title="Как правильно варить кофе"
                                  description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi aspernatur libero consequuntur expedita repellendus impedit culpa facere ipsum soluta ea voluptates esse eos molestiae, voluptas quos illo, eum magnam. Ullam!"/>
                    </SwiperSlide>


                </Swiper>
            </div>
        </div>
    )
}