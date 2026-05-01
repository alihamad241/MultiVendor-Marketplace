import React from "react";

const counters = [
    {
        id: 1,
        img: "/assets/img/cart/count.png",
        number: "2170",
        title: "Happy Customers",
    },
    {
        id: 2,
        img: "/assets/img/cart/count2.png",
        number: "8080",
        title: "Awards Won",
    },
    {
        id: 3,
        img: "/assets/img/cart/count3.png",
        number: "2150",
        title: "Hours Worked",
    },
    {
        id: 4,
        img: "/assets/img/cart/cart5.png",
        number: "2170",
        title: "Complete Projects",
    },
];

export default function CounterUp() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {counters.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center group">
                            <div className="mb-4 p-4 rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {item.number}
                            </h2>
                            <p className="text-sm uppercase font-medium text-gray-500 tracking-wide">
                                {item.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
