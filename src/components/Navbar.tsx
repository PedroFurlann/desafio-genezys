"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { List } from "phosphor-react";
import Image from "next/image";
import Logo from '../../public/logo_genezys_sem_fundo.png';

interface Props {
  routesList: string[]
}

export const Navbar = ({ routesList }: Props) => {
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
    <div className="w-full h-24 bg-black flex items-center pl-8 gap-6 justify-between"
      style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)' }}
    >
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
            className="absolute right-4 top-38 bg-black w-48 border border-white rounded-md shadow-lg"
            style={{ transform: "translateX(-10%)" }}
          >
            {routesList.map((route) => (
              <Link key={route} href={`/${route === "Login" ? "" : route === "Recover Password" ? "recover-password" : route.toLowerCase()}`}>
                <p className="block py-2 px-4 text-white font-bold hover:bg-gray-800 transition-all ease-in-out duration-300">
                  {route}
                </p>
              </Link>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}