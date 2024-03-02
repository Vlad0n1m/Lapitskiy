import BigBlogCard from "@/components/BigBlogCard"

export default function BlogPage() {
    return (
        <div className="flex flex-col gap-16">
            <h1 className="text-[52px] uppercase font-black text-center mt-4 ">Блог</h1>
            <div className="flex flex-wrap">
                <BigBlogCard/>
                <BigBlogCard/>
                <BigBlogCard/>
                <BigBlogCard/>
                <BigBlogCard/>
                <BigBlogCard/>
            </div>
        </div>
    )
}