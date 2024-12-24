import { Navbar, NavbarBrand } from "@nextui-org/react";
import {
  IconBrandGithub,
  IconBrandX,
  IconCopy,
  IconCopyright,
  IconCopyrightFilled,
  IconCopyrightOff,
  IconNoCopyright,
} from "@tabler/icons-react";

import Link from "next/link";

export const Footer = () => {
  return (
    <Navbar isBordered className="border-t mt-12   font-mono py-4">
      <NavbarBrand className="flex justify-between items-center ">
        <div className="flex items-center space-x-2">
          <IconCopyright size={21} className=" " />

          <Link
            href="/"
            className="font-bold font-mono text-xl bg-gradient-to-r text-white bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            アニタロ
          </Link>
        </div>
        <div className="text-white text-sm text-center mt-2 md:mt-0">
          <p>
            Developed by
            <span className="pl-2">
              <a
                target="_blank"
                href="https://github.com/akshitvigg"
                className="hover:underline"
              >
                Akshit
              </a>
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-4 text-white">
          <a target="_blank" href="https://github.com/akshitvigg/anitaro">
            <IconBrandGithub className=" transition-all duration-200 hover:scale-110" />
          </a>

          <div>
            <a target="_blank" href="https://x.com/AkshitVig4">
              <IconBrandX className="transition-all duration-200 hover:scale-110" />
            </a>
          </div>
        </div>
      </NavbarBrand>
    </Navbar>
  );
};
