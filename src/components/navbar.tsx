"use client";

import { CircleUser, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const primaryLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/destinations", label: "Destinations" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/admin", label: "Admin" },
];

const accountLinks = [
  { href: "/profile", label: "Profile", icon: true },
  { href: "/login", label: "Login" },
  { href: "/sign-up", label: "Sign Up" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
      <nav className="relative mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <ul className="hidden items-center gap-5 md:flex sm:gap-7">
          {primaryLinks.map(({ href, label, active }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-cyan-600 ${
                  active
                    ? "text-cyan-600 underline decoration-2 underline-offset-4"
                    : "text-foreground"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Wanderlast home"
        >
          <Image
            src="/assets/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            priority
            className="h-6 w-auto"
          />
        </Link>
        <ul className="hidden items-center gap-5 md:flex sm:gap-7">
          {accountLinks.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:text-cyan-600"
              >
                {icon ? <CircleUser className="size-4.5" /> : null}
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {open ? (
        <nav className="flex flex-col border-t border-border/60 bg-white px-4 py-3 md:hidden">
          {[...primaryLinks, ...accountLinks].map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-1.5 py-2.5 text-sm font-medium transition-colors hover:text-cyan-600 ${
                "active" in link && link.active
                  ? "text-cyan-600 underline decoration-2 underline-offset-4"
                  : "text-foreground"
              } ${index === primaryLinks.length ? "mt-2 border-t border-border/60 pt-4" : ""}`}
            >
              {"icon" in link && link.icon ? (
                <CircleUser className="size-4.5" />
              ) : null}
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
