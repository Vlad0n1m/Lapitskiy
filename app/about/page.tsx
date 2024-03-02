export default function About() {
    return (
        <div className="flex flex-col gap-16">
            <h1 className="text-[52px] uppercase font-black text-center mt-4">О нас</h1>
            <div className="flex flex-col py-8 bg-[#f7f7fa] shadow-xl items-center rounded-xl gap-8">

                <h1 className="text-[48px] font-black">Lapitskiy</h1>
                <p className="w-[80%] md:w-[50%] text-center">Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Autem dolores, natus, vero tenetur quibusdam excepturi, ex eligendi architecto obcaecati nemo enim
                    voluptates voluptas quaerat? Animi, deserunt doloremque? Autem, minus laborum.Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Alias doloremque unde ratione. Voluptates debitis accusamus, eius
                    ullam, non iusto aspernatur quidem rem, facilis animi ab sequi aliquam velit eveniet dolorum.</p>
            </div>
            <div className="flex gap-5 flex-col sm:flex-row items-center">
                <div className="bg-black rounded-xl w-full h-[300px] "></div>
                <div className="flex flex-col sm:w-[80%] items-center sm:items-start justify-between gap-4">
                    <div>
                        <h2 className="text-[22px] uppercase font-black mb-2 text-center sm:text-left">История</h2>
                        <p className="text-center sm:text-left">Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Minima eligendi aspernatur beatae laborum doloremque, rem possimus dicta sapiente
                            nobis! Pariatur libero repudiandae id repellat doloremque possimus saepe consequuntur
                            debitis veniam?</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-5 flex-col sm:flex-row-reverse items-center">
                <div className="bg-black rounded-xl w-full h-[300px]"></div>
                <div className="flex flex-col sm:w-[80%] items-center sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-[22px] uppercase font-black mb-2 text-center sm:text-right">Кофе любовь
                            круассаны</h2>
                        <p className="text-center sm:text-right">Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Minima eligendi aspernatur beatae laborum doloremque, rem possimus dicta sapiente
                            nobis! Pariatur libero repudiandae id repellat doloremque possimus saepe consequuntur
                            debitis veniam?</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-5 flex-col sm:flex-row items-center">
                <div className="bg-black rounded-xl w-full h-[300px]"></div>
                <div className="flex flex-col sm:w-[80%] items-center sm:items-start justify-between gap-4">
                    <div>
                        <h2 className="text-[22px] uppercase font-black mb-2 text-center sm:text-left">Лапицкий?</h2>
                        <p className="text-center sm:text-left">Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Minima eligendi aspernatur beatae laborum doloremque, rem possimus dicta sapiente
                            nobis! Pariatur libero repudiandae id repellat doloremque possimus saepe consequuntur
                            debitis veniam?</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
