import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = ({ items }) => {
    return (
        <div className="bg-gray-100 py-6 border-b border-gray-200">
            <div className="container mx-auto px-4 max-w-7xl">
                <ul className="flex items-center gap-2 text-sm uppercase font-medium text-gray-500 tracking-wide">
                    <li>
                        <Link
                            to="/"
                            className="flex items-center transition-colors hover:text-[#00bba6]"
                        >
                            <Home size={14} className="mr-1" /> Home
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            <li>
                                <ChevronRight size={14} />
                            </li>
                            {item.path ? (
                                <li>
                                    <Link
                                        to={item.path}
                                        className="transition-colors hover:text-[#00bba6]"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ) : (
                                <li className="text-[#00bba6]">{item.label}</li>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Breadcrumbs;
