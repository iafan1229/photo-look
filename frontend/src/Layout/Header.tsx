"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Header() {
  const path = usePathname();
  console.log(path);
  return (
    <>
      <header>
        <h1>photo-look</h1>
        <nav>
          <ul>
            {["photo", "video", "register", "about"].map((el) => {
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
