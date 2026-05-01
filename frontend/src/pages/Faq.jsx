import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Plus, Minus, ChevronRight, Home } from "lucide-react";

const faqData = [
    {
        id: 1,
        question: "How long does shipping take and how much does it cost?",
        answer: "Standard shipping typically takes 3–7 business days within the continental US. Shipping cost is calculated at checkout based on your address and the items in your cart; free shipping promotions are applied automatically when eligible.",
    },
    {
        id: 2,
        question: "What is your return and exchange policy?",
        answer: "We accept returns within 14 days of delivery for most unused items in original condition. Start a return from your account or contact support and we'll provide a prepaid return label when applicable. Exchanges are processed as a return plus a new order.",
    },
    {
        id: 3,
        question: "Which payment methods do you accept?",
        answer: "We accept major credit and debit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay / Google Pay where available. All payments are processed securely.",
    },
    {
        id: 4,
        question: "How can I track my order?",
        answer: "After your order ships you'll receive an email with tracking details. You can also view order status from your account's Orders page. If you don't receive tracking info, contact support with your order number.",
    },
    {
        id: 5,
        question: "Do you ship internationally?",
        answer: "We ship to many countries worldwide. International shipping rates and delivery times vary by destination and will be shown at checkout. Import taxes or duties may apply and are the responsibility of the recipient.",
    },
    {
        id: 6,
        question: "How do promo codes and discounts work?",
        answer: "Enter promo codes at checkout in the discount field. Only one promo code can be applied per order unless stated otherwise. Some promotions exclude sale items or certain categories — terms are shown with each offer.",
    },
    {
        id: 7,
        question: "My item is out of stock — can I be notified?",
        answer: "If an item is out of stock you can sign up for a back-in-stock notification on the product page. We'll email you when the item is available again.",
    },
    {
        id: 8,
        question: "How do I contact customer support?",
        answer: "You can reach our support team via the Contact page or by emailing support@yourdomain.com. Include your order number for fastest service; typical response time is within 24–48 hours.",
    },
];

export default function Faq() {
    const [activeId, setActiveId] = useState(null);

    const toggle = (id) => setActiveId(activeId === id ? null : id);

    return (
        <div className="font-sans text-gray-600 faq-accent">
            <style>{`
                .faq-accent { --accent: #00bba6; }
                .faq-accent .accent-text { color: var(--accent); }
                .faq-accent .accent-hover:hover { color: var(--accent); }
                .faq-accent .accent-border { border-color: var(--accent) !important; }
                .faq-accent .accordion-header.active { background-color: rgba(0,187,166,0.08); color: var(--accent); }
            `}</style>
            <Header />

            {/* --- Breadcrumbs Area --- */}
            <div className="bg-gray-100 py-6 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center gap-2 text-sm uppercase font-medium text-gray-500">
                        <li>
                            <a
                                href="/"
                                className="flex items-center transition-colors accent-hover">
                                <Home size={14} className="mr-1" /> Home
                            </a>
                        </li>
                        <li>
                            <ChevronRight size={14} />
                        </li>
                        <li className="accent-text">Frequently Questions</li>
                    </ul>
                </div>
            </div>
            {/* --- End Breadcrumbs --- */}

            {/* --- Main Content --- */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    {/* Page Title */}
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <h4 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
                            Below are frequently asked questions
                        </h4>
                        <p className="text-gray-500">
                            Find answers to common questions here. We are here
                            to help you.
                        </p>
                    </div>

                    {/* Accordion Area */}
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-4">
                            {faqData.map((item) => (
                                <div
                                    key={item.id}
                                    className={`border rounded-sm transition-all duration-200 ${
                                        activeId === item.id
                                            ? "shadow-sm accent-border"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                    {/* Accordion Header (Button) */}
                                    <button
                                        onClick={() => toggle(item.id)}
                                        className={`w-full flex justify-between items-center px-6 py-4 text-left transition-colors accordion-header ${
                                            activeId === item.id
                                                ? "active"
                                                : "bg-white text-gray-700 accent-hover"
                                        }`}>
                                        <span className="font-semibold text-sm md:text-base uppercase tracking-wide">
                                            {item.question}
                                        </span>
                                        <span className="ml-4 shrink-0">
                                            {activeId === item.id ? (
                                                <Minus size={16} />
                                            ) : (
                                                <Plus size={16} />
                                            )}
                                        </span>
                                    </button>

                                    {/* Accordion Body (Answer) */}
                                    {/* Using simple conditional rendering. For animation, a library like framer-motion is recommended, but this is pure React/Tailwind */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            activeId === item.id
                                                ? "max-h-96 opacity-100"
                                                : "max-h-0 opacity-0"
                                        }`}>
                                        <div className="px-6 pb-6 pt-2 text-sm leading-relaxed text-gray-500 border-t border-gray-100">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* --- End Main Content --- */}

            <Footer />
        </div>
    );
}
