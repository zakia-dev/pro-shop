import ModeToggle from "./mode-toggel";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import UserButtons from "./user-buttons";

const Menu = () => {
    return (
        <div className="flex justify-end gap-3">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex w-full max-w-xs gap-1">
                <ModeToggle />
                <Button asChild variant="ghost">
                    <Link href="/cart">
                        <ShoppingCart /> Cart
                    </Link>
                </Button>
                <UserButtons />
            </nav>

            {/* Mobile Navigation */}
            <nav className="md:hidden">
                <Sheet>
                    {/* SheetTrigger must be within the Sheet context */}
                    <SheetTrigger asChild className="align-middle">
                        <Button variant="ghost">
                            <EllipsisVertical />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col items-start">
                        <SheetTitle>Menu</SheetTitle>
                        <ModeToggle />
                        <Button asChild variant="ghost">
                            <Link href="/cart">
                                <ShoppingCart /> Cart
                            </Link>
                        </Button>
                        {/* <Button asChild variant="ghost">
                            <Link href="/sign-in">
                                <UserIcon /> Sign-In
                            </Link>
                        </Button> */}
                        <UserButtons />
                        <SheetDescription>
                            {/* Add any additional descriptions if needed */}
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
};

export default Menu;
