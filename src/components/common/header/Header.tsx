import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
    const { data: session } = useSession();
    return (
        <header className="p-4 border-b-2 border-gray-300 bg-white">
            <nav>
                <ul className="flex w-full">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li className="ml-auto">
                        <Link href="/projects">Projects</Link>
                    </li>
                    <li className="ml-6">
                        <Link href="/contact">Contact</Link>
                    </li>
                    <li className="ml-6">
                        {session ? (
                            <button onClick={() => signOut()}>Logout</button>
                        ) : (
                            <button onClick={() => signIn()}>Sign in</button>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
