import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-navy to-navy-light p-6 text-center text-white">
      <div>
        <Image src="/logo.png" alt="" width={90} height={90} className="mx-auto mb-4" />
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="mt-2 text-slate-300">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-green mt-6">Back to Home</Link>
      </div>
    </div>
  );
}
