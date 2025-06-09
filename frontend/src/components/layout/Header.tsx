"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const path = usePathname();
  return (
    <>
      <header>
        <div>
          <h1>
            <Link href='/photo' style={{ color: "white" }}>
              <div className='header-logo'>
                <img
                  src='/img/logo-png.png'
                  alt='Photo Look 로고'
                  width={300}
                  height={100}
                />
              </div>
            </Link>
          </h1>
          <nav>
            <ul>
              {["photo", "about", "register"].map((el) => {
                return (
                  <li key={el} className={path.includes(el) ? "on" : ""}>
                    <Link href={"/" + el}>{el.toUpperCase()}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
