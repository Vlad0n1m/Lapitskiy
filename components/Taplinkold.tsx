// import Image from "next/image"
// export default function Taplink() {
//     return (
//         <div className="flex flex-col gap-[30px] h-[80svh] sm:h-[unset] justify-between sm:p-[20px] p-[10px] bg-center bg-[url('/herobg.webp')] bg-cover rounded-xl text-white transition-all">
//             <div className="flex justify-between ">
//                 <h1 className="font-[600] text-[45px] leading-[46px] sm:text-[60px] sm:leading-[61px] text-white uppercase">Кофе<br />
//                     Круасаны<br />
//                     Любовь</h1>
//                 <div className="sm:flex flex-col hidden gap-[5px]">
//                     <div className="bg-white rounded-full bg-white h-[40px] cursor-pointer transition-all hover:opacity-100 opacity-50 w-[40px]"></div>
//                     <div className="bg-white rounded-full bg-white h-[40px] cursor-pointer transition-all  hover:opacity-100 opacity-50 w-[40px]"></div>
//                     <div className="bg-white rounded-full bg-white h-[40px] cursor-pointer transition-all  hover:opacity-100 opacity-50 w-[40px]"></div>
//                     <div className="bg-white rounded-full bg-white h-[40px] cursor-pointer transition-all  hover:opacity-100 opacity-50 w-[40px]"></div>
//                 </div>
//             </div>
//             <div className="flex sm:flex-row-reverse flex-col gap-[10px] self-center w-full ">
//                 <div className="sm:w-[103px] h-[103px] bg-gradient-to-r from-red-500 to-orange-500 cursor-pointer transition-all hover:bg-auto bg-cover px-[10px]  text-xl  bg-cover bg-center text-center flex items-center justify-center font-bold text-white rounded-lg"><p>Доставка</p></div>
//                 <div className="flex gap-[9px] sm:min-w-[325px] w-full max-h-[103px] sm:justify-end">
//                     <div className="group bg-gradient-to-b from-emerald-500 to-emerald-900 sm:hover:w-[180px] sm:hover:pr-[30px] w-full h-full aspect-square cursor-pointer transition-all px-[10px] sm:hover:justify-between bg-cover sm:w-[103px]  text-center text-xl flex items-center justify-center font-bold text-white rounded-lg">
//                         <Image src='/cup.webp' alt="cup" width={90} height={90} className="hidden sm:group-hover:block transition-all"/>

//                         <p className="transition-all">Кофе</p>
//                         </div>
//                     <div className="group bg-gradient-to-b from-blue-600 to-violet-600 sm:hover:w-[180px] w-full h-full aspect-square cursor-pointer transition-all px-[10px] sm:hover:justify-between bg-cover sm:w-[103px]  text-center text-xl flex items-center justify-center font-bold text-white rounded-lg">
//                         <Image src='/croisant.webp' alt="cup" width={70} height={70} className="hidden sm:group-hover:block transition-all"/>

//                         <p className="transition-all">Круасаны</p>
//                         </div>
//                     <div className="group bg-gradient-to-b from-teal-200 to-teal-500 to-emerald-900 sm:hover:w-[180px] sm:hover:pr-[30px]  w-full h-full aspect-square cursor-pointer transition-all  px-[10px] sm:hover:justify-between bg-cover sm:w-[103px]  text-center text-xl flex items-center justify-center font-bold text-white rounded-lg">
//                         <Image src='/mark.webp' alt="cup" width={70} height={70} className="hidden sm:group-hover:block transition-all"/>
//                         <p className="transition-all">Точки</p>
//                         </div>
//                 </div>
//             </div>
//         </div>
//     )
// }