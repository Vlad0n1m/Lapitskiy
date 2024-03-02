import Image from "next/image"

interface IMenuLink {
    id: string,
    name: string,
    image_url: string,
}

export default function MenuLink(props: IMenuLink) {
    return (
        <div className="p-1 basis-1/3">
            <div className="relative cursor-pointer  bg-black rounded-xl shadow-xl p-2 text-white font-black w-full h-[150px] flex flex-col-reverse">
                <p className=" justify-self-end z-10">{props.name}</p>
                <Image style={{ filter: 'brightness(0.5)' }} src={props.image_url} objectFit={"cover"} layout={"fill"} alt="Чаи"
                    className="rounded-xl z-0 " />
            </div>
        </div>
    )
}