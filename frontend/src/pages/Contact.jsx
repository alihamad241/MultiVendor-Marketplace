import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [phone, setPhone] = useState("");

    const handeSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, message, subject, phone });
    };
    return (
        <div>
            <div className="pos_page">
                <div className="mx-auto px-4">
                    <div className="pos_page_inner">
                        <Header />
                        <div className="breadcrumbs_area">
                            <div className="row">
                                <div className="w-full">
                                    <div className="breadcrumb_content">
                                        <ul>
                                            <li>
                                                <a href="index.html">home</a>
                                            </li>
                                            <li>
                                                <i className="fa fa-angle-right"></i>
                                            </li>
                                            <li>contact</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contact_area">
                            <div className="flex flex-wrap">
                                <div className="lg:w-1/2 w-full px-4">
                                    <div className="contact_message">
                                        <h3>Tell us your project</h3>
                                        <form
                                            id="contact-form"
                                            method="POST"
                                            action="https://formspree.io/f/mrbwrzdy">
                                            <div className="row">
                                                <div className="w-full lg:w-1/2 px-2 mb-4">
                                                    <input
                                                        name="name"
                                                        placeholder="Name *"
                                                        type="text"
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                    />
                                                </div>
                                                <div className="w-full lg:w-1/2 px-2 mb-4">
                                                    <input
                                                        name="email"
                                                        placeholder="Email *"
                                                        type="email"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                    />
                                                </div>
                                                <div className="w-full lg:w-1/2 px-2 mb-4">
                                                    <input
                                                        name="subject"
                                                        placeholder="Subject *"
                                                        type="text"
                                                        onChange={(e) => setSubject(e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                    />
                                                </div>
                                                <div className="w-full lg:w-1/2 px-2 mb-4">
                                                    <input
                                                        name="phone"
                                                        placeholder="Phone *"
                                                        type="text"
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                    />
                                                </div>

                                                <div className="w-full px-2">
                                                    <div className="contact_textarea mb-4">
                                                        <textarea
                                                            placeholder="Message *"
                                                            name="message"
                                                            className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                                                            onChange={(e) => setMessage(e.target.value)}></textarea>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        // onClick={handeSubmit}
                                                        className="bg-blue-600 text-black px-4 py-2 rounded">
                                                        Send Message
                                                    </button>
                                                </div>
                                                <div className="w-full">
                                                    <p className="form-messege"></p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="w-full lg:w-1/2 px-4">
                                    <div className="contact_message contact_info">
                                        <h3>contact us</h3>
                                        <p>
                                            Need help or have a question about our products or your order? Use the form on the left to send us the details — include your order
                                            number when relevant and a short description of the issue. Our support team monitors messages during business hours and will reply
                                            within 24 business hours. For urgent inquiries, please call the phone number below during working hours.
                                        </p>
                                        <ul>
                                            <li>
                                                <i className="fa fa-fax"></i> Address : No 40 Baria Sreet 133/2 NewYork City
                                            </li>
                                            <li>
                                                <i className="fa fa-phone"></i> <a href="tel:+1234567890">+1 (234) 567-890</a>
                                            </li>
                                            <li>
                                                        <i className="fa fa-envelope-o"></i><a href="mailto:aliahmedfakhryhamad@gmail.com">aliahmedfakhryhamad@gmail.com</a>
                                            </li>
                                        </ul>
                                        <h3>
                                            <strong>Working hours</strong>
                                        </h3>
                                        <p>
                                            <strong>Monday – Saturday</strong>: 08AM – 22PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact_map">
                            <div className="flex flex-wrap -mx-4">
                                <div className="w-full">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb"
                                        width="500"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Contact;
