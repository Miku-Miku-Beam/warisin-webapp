"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ActiveLinkProps {
    href: string;
    children: React.ReactNode;
    exactMatch?: boolean;
}

const ActiveLink = ({ href, children, exactMatch = false }: ActiveLinkProps) => {
    const pathname = usePathname();

    const isActive = exactMatch
        ? pathname === href
        : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`transition hover:text-black ${isActive
                    ? 'text-black font-medium'
                    : 'text-gray-700'
                }`}
        >
            {children}
        </Link>
    );
};

export default ActiveLink;
