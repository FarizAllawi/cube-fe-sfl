export default function Meta({data, current}) {
    return (
        <div className="w-full select-none mb-4 mt-8">
            <p className="font-semibold text-xl md:text-2xl">{data[current].title}</p>
            <p className="font-light text-sm md:text-sm">{data[current].description}</p>
        </div> 
    )
}

