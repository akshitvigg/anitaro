"use client";

import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const NavbarContainer = () => {
  const [inputVal, setInputval] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const router = useRouter();

  const handleSearch = () => {
    if (inputVal.trim() !== "") {
      router.push(`/searchanime/${inputVal}`);
      handleCloseSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isMenuOpen) setIsMenuOpen(false);
    if (!isSearchVisible) {
      setTimeout(() => document.querySelector("input")?.focus(), 100);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
    setInputval("");
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background/60 backdrop-blur-lg shadow-sm"
      maxWidth="full"
    >
      <NavbarContent className="sm:hidden">
        {!isSearchVisible && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        )}
      </NavbarContent>

      <NavbarBrand className={`${isSearchVisible ? "hidden sm:flex" : "flex"}`}>
        <Link
          href="/"
          className="font-bold font-mono text-xl bg-gradient-to-r text-white bg-clip-text text-transparent hover:scale-105 transition-transform"
          onClick={handleCloseSearch}
        >
          アニタロ
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            href="/"
            className="text-foreground/60 hover:text-foreground transition-colors relative group"
          >
            <span className=" font-mono">Anime</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/manga"
            className="text-foreground/60 hover:text-foreground transition-colors relative group"
          >
            <span className=" font-mono">Manga</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="flex items-center gap-2">
          <div className="hidden font-mono sm:block">
            <Input
              classNames={{
                base: "max-w-full sm:max-w-[20rem] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 hover:bg-default-100 transition-colors",
              }}
              placeholder="Search anime..."
              size="sm"
              startContent={<Search size={18} className="text-default-400" />}
              type="search"
              value={inputVal}
              onChange={(e) => setInputval(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="sm:hidden">
            {!isSearchVisible ? (
              <Button
                isIconOnly
                variant="light"
                onClick={toggleSearch}
                className="text-default-500"
              >
                <Search size={20} />
              </Button>
            ) : (
              <Button
                isIconOnly
                variant="light"
                onClick={handleCloseSearch}
                className="text-default-500"
              >
                <X size={20} />
              </Button>
            )}
          </div>
        </NavbarItem>
      </NavbarContent>

      <div
        className={`fixed inset-0 sm:hidden bg-background/80 backdrop-blur-md transition-opacity duration-300 flex items-start pt-16 px-4 ${
          isSearchVisible
            ? "opacity-100 z-50"
            : "opacity-0 pointer-events-none -z-10"
        }`}
      >
        <div className="w-full">
          <Input
            classNames={{
              base: "w-full h-12",
              mainWrapper: "h-full",
              input: "text-medium",
              inputWrapper: "h-full font-normal bg-default-100/50",
            }}
            placeholder="Search anime..."
            size="lg"
            startContent={<Search size={20} className="text-default-400" />}
            endContent={
              inputVal && (
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => setInputval("")}
                >
                  <X size={16} />
                </Button>
              )
            }
            type="search"
            value={inputVal}
            onChange={(e) => setInputval(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {inputVal && (
            <Button
              color="default"
              className="w-full mt-4"
              onClick={handleSearch}
            >
              Search
            </Button>
          )}
        </div>
      </div>

      <NavbarMenu className="pt-6 bg-background/80 backdrop-blur-lg">
        <NavbarMenuItem>
          <Link
            href="/"
            className="w-full text-foreground/60 hover:text-foreground transition-colors py-2 text-lg"
            onClick={handleCloseSearch}
          >
            Anime
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/manga"
            className="w-full text-foreground/60 hover:text-foreground transition-colors py-2 text-lg"
            onClick={handleCloseSearch}
          >
            Manga
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
