import Taplink from "@/components/Taplink";
import Advantages from "@/components/Advantages";
import Cards from "@/components/Cards";
import Places from "@/components/Places";
import Blog from "@/components/Blog";

export default function Home() {
    return (
        <div className="flex flex-col gap-16">
            <Taplink/>
            <Advantages/>
            <Cards/>
            <Blog/>
            <Places/>
        </div>
    );
}
