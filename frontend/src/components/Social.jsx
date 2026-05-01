import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP } from "react-icons/fa";


const Social = () => {
  return (
    <div className="flex justify-center">
      <div className="border w-full border-gray-300 p-4 text-center">
        <h4 className="font-bold mb-2 text-2xl">Share on:</h4>
        <ul className="flex gap-4 justify-center items-center">
          <li>
            <a href="#" aria-label="Share">
              <FaFacebookF className="w-5 h-5 text-[#333333] hover:text-red-500 transition-colors duration-200 cursor-pointer" />
            </a>
          </li>
          <li>
            <a href="#" aria-label="Share">
              <FaTwitter className="w-5 h-5 text-[#333333] hover:text-red-500 transition-colors duration-200 cursor-pointer" />
            </a>
          </li>
          <li>
            <a href="#" aria-label="Share">
              <FaLinkedinIn className="w-5 h-5 text-[#333333] hover:text-red-500 transition-colors duration-200 cursor-pointer" />
            </a>
          </li>
          <li>
            <a href="#" aria-label="Share">
              <FaPinterestP className="w-5 h-5 text-[#333333] hover:text-red-500 transition-colors duration-200 cursor-pointer" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Social;
