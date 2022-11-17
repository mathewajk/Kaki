import React from "react";
import Image from "next/image";

import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

const Header = (props) => {

    const { data: session, status } = useSession();

    return(
        <nav className="menu bg-white fixed top-0 background-blur-sm left-0 flex shadow-md justify-between px-6 py-3 mb-10 w-full">

        <div className="flex h-10 lg:text-xl md:text-lg font-medium">
            <div className="flex items-center">
                <Link href="/">
                <img src={'/kaki.png'} className="max-w-none h-4 w-4 md:h-8 md:w-8"></img></Link>&nbsp;&nbsp;
                <Link href="/"><h3 className="font-bold">カキ</h3></Link>
            </div>
        </div>

        <NavLinks session={session}/>
      </nav>
    );
}

const NavLinks = ( {session} ) => {

    const [ isVisible, setIsVisible ] = useState(false);

    const toggleMenu = () => {
        setIsVisible(!isVisible);
    }

    console.log(isVisible);

    return(
    <>
        <div className={(isVisible ? "block" : "hidden") + " w-full md:block md:w-auto"}>
            <ul className="flex flex-col items-center lg:text-base mt-4 md:flex-row md:space-x-4 md:mt-0 md:text-sm md:font-medium md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li className="block py-2 md:p-0"><Link className="font-bold p-2 hover:text-orange-500" href="/learn">学ぶ</Link></li>
                <li className="block py-2 md:p-0"><Link className="font-bold p-2 hover:text-orange-500" href="/vocab">成績</Link></li>
                {session && (
                    <li className="block py-2 md:p-0">
                    <div className="sr-only">User menu</div>
                    <Menu as="div" className="relative inline-block text-left z-20">
                    <Menu.Button className="kaki-button inline-flex w-full justify-center text-sm font-medium px-4 py-2">{session.user.name.split(" ")[0]}様 
                    <ChevronDownIcon
                        className="ml-2 -mr-1 h-5 w-5"
                        aria-hidden="true"/>
                    </Menu.Button>
                    <Menu.Items className="absolute text-sm text-black right-0 mt-2 w-32 origin-top-right divide-y-2 divide-gray-700 rounded-md bg-white shadow-lg">
                    <div className="px-1 py-1">
                        <Menu.Item>
                        {({ active }) => (
                            <a
                            className={`${
                                active ? 'text-black' : 'text-gray-600'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="#"
                            >
                            設定
                            </Link>
                        )}
                        </Menu.Item>
                        <Menu.Item>
                        {({ active }) => (
                            <a
                            className={`${
                                active ? 'text-red-600' : 'text-orange-500'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              onClick={() => signOut()}
                              href="#"
                            >
                            ログアウト
                            </Link>
                        )}
                        </Menu.Item>
                    </div>
                    </Menu.Items>
                </Menu>
                </li>)}
                { !session && (<li className="block py-2 pl-3 pr-4 text-white md:bg-transparent md:p-0 dark:text-white"><button className="kaki-button"><Link href="/login">ログイン</Link></button></li>) }
            </ul>
        </div>
        <div className="flex md:hidden">
            <button data-collapse-toggle="navbar-default" type="button" onClick={() => toggleMenu()} className="inline-flex items-center p-2 mr-3 text-sm text-gray-500 rounded-lg h-10" aria-controls="navbar-default" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
                </svg>
            </button>
        </div>
        </>
    );
}

export default Header;