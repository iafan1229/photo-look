"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Header() {
  const path = usePathname();
  return (
    <>
      <header>
        <h1>
          <Link href='/photo' style={{ color: "white" }}>
            photo-look
          </Link>
        </h1>
        <nav>
          <ul>
            {["photo", "register", "about"].map((el) => {
              return (
                <li key={el} className={path.includes(el) ? "on" : ""}>
                  <Link href={"/" + el}>{el.toUpperCase()}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
    </>
  );
}
