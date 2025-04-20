import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-brand-900 text-white py-8 mt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div>
            <Image src="/logo-white.png" alt="logo" width={150} height={150} />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-brand-500">關於</h3>
            <Link href="/about" className="text-white hover:text-brand-600">
              關於我們
            </Link>

            <Link href="/explore-studios" className="text-white hover:text-brand-600">
              所有場地
            </Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-brand-500">幫助</h3>
            <Link href="/faq" className="text-white hover:text-brand-600">
              常見問題
            </Link>
            <Link href="/terms-and-conditions" className="text-white hover:text-brand-600">
              條款與細則
            </Link>
            <Link
              href="/auth/register?redirect=/studio-owner/dashboard"
              className="text-white hover:text-brand-600"
            >
              建立場地
            </Link>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold text-brand-500">追蹤我們</h3>
            <div className="flex space-x-3 mt-2">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-brand-50 p-2 w-fit">
                    <Image src="/social/facebook.svg" alt="Facebook" width={20} height={20} />
                  </div>
                </div>
              </a>

              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-brand-50 p-2 w-fit">
                    <Image src="/social/instagram.svg" alt="Instagram" width={20} height={20} />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
          <p className="mb-1">&copy; {new Date().getFullYear()} Ksana. All rights reserved.</p>
          <p>本網站僅供作品參考，並非真實營運販售</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
