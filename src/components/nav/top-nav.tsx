import Image from "next/image";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
} from "../ui/navigation-menu";
import { ThemeToggle } from "../ui/theme-toggle";

export async function TopNav() {
	return (
		<NavigationMenu className=" max-w-none fixed z-50 top-0 flex h-14 w-full items-center justify-between  px-8">
			<NavigationMenuItem>
				<NavigationMenuLink href="/" className="flex items-center gap-3">
					{/* <Image src="/favicon.ico" alt="Company Logo" width={20} height={20} /> */}
				</NavigationMenuLink>
			</NavigationMenuItem>
			<div>
				<div className="flex items-center gap-6 text-sm font-normal">
					<ThemeToggle />
				</div>
			</div>
		</NavigationMenu>
	);
}
