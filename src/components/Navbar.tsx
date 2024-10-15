"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { List } from "phosphor-react";
import Image from "next/image";
import Logo from '../../public/logo_genezys_sem_fundo.png';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-24 bg-black flex items-center pl-8 gap-6 justify-between">
      <Link href="/" className="cursor-pointer">
        <Image alt="Genezys logo" src={Logo} className="w-12 h-12 bg-transparent cursor-pointer" />
      </Link>

      <div>
        <button
          ref={buttonRef}
          className="text-lg font-extrabold text-white transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl"
          onClick={toggleMenu}
        >
          <List weight="bold" size={28} />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-28 top-38 bg-black w-48 border border-white rounded-md shadow-lg"
            style={{ transform: "translateX(-10%)" }}
          >
            <Link href="/">
              <p className="block py-2 px-4 text-white hover:bg-gray-800">
                Teste
              </p>
            </Link>
            <Link href="/">
              <p className="block py-2 px-4 text-white hover:bg-gray-800">
                Teste
              </p>
            </Link>
            <Link href="/">
              <p className="block py-2 px-4 text-white hover:bg-gray-800">
                Teste
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}