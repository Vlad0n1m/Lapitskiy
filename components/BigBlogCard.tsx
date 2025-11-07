import Link from "next/link"

export default function BigBlogCard() {
    return (
        <div className="p-4 basis-full sm:basis-1/2 md:basis-1/3 transition-all">
            <div className="flex flex-col gap-4 text-center rounded-xl bg-[#f7f7fa] shadow-xl">
                <div className="bg-black rounded-xl w-full aspect-video rounded-b-none"></div>
                <div className="flex flex-col gap-2 p-4">
                    <h2 className="text-[20px] font-black ">Как правильно варить кофе?</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam doloremque repudiandae est quae
                        explicabo delectus iure fuga eveniet illo rerum minus cumque iste facilis labore minima commodi
                        soluta, magni aperiam!</p>
                    <Link href='/'>
                        <button
                            className="w-full bg-black text-white rounded-full p-2 mt-4 flex items-center justify-center gap-2">
                            <div className="w-[18px] h-[18px]">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M12 10.4V20M12 10.4C12 8.15979 12 7.03969 11.564 6.18404C11.1805 5.43139 10.5686 4.81947 9.81596 4.43597C8.96031 4 7.84021 4 5.6 4H4.6C4.03995 4 3.75992 4 3.54601 4.10899C3.35785 4.20487 3.20487 4.35785 3.10899 4.54601C3 4.75992 3 5.03995 3 5.6V16.4C3 16.9601 3 17.2401 3.10899 17.454C3.20487 17.6422 3.35785 17.7951 3.54601 17.891C3.75992 18 4.03995 18 4.6 18H7.54668C8.08687 18 8.35696 18 8.61814 18.0466C8.84995 18.0879 9.0761 18.1563 9.29191 18.2506C9.53504 18.3567 9.75977 18.5065 10.2092 18.8062L12 20M12 10.4C12 8.15979 12 7.03969 12.436 6.18404C12.8195 5.43139 13.4314 4.81947 14.184 4.43597C15.0397 4 16.1598 4 18.4 4H19.4C19.9601 4 20.2401 4 20.454 4.10899C20.6422 4.20487 20.7951 4.35785 20.891 4.54601C21 4.75992 21 5.03995 21 5.6V16.4C21 16.9601 21 17.2401 20.891 17.454C20.7951 17.6422 20.6422 17.7951 20.454 17.891C20.2401 18 19.9601 18 19.4 18H16.4533C15.9131 18 15.643 18 15.3819 18.0466C15.15 18.0879 14.9239 18.1563 14.7081 18.2506C14.465 18.3567 14.2402 18.5065 13.7908 18.8062L12 20"
                                            stroke="#ffffff" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round"></path>
                                    </g>
                                </svg>
                            </div>
                            Подробнее
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    )
}