import Image from "next/image";

export default function NavbarLogo() {
    return (
        <Image
            src="/F1_Logo.svg"
            alt="F1"
            width={120}        // pick a base size
            height={40}        // correct aspect for your SVG
            className="h-10 w-auto" // if you control height via CSS, keep width auto
            priority
        />
    );
}