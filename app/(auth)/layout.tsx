import Logo from "@/components/custom/Logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid h-screen lg:grid-cols-2">
      <>
        {children}
      </>

      <div className="hidden lg:flex items-center justify-left relative bg-muted">
        <img 
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=80" 
          alt="Artist community" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        <div className="flex justify-end absolute bottom-12 right-5 z-10 text-right text-white px-12">
          <Link href="/" className="text-4xl font-bold block mb-4">
            <Logo theme="light" />
          </Link>
        </div>
      </div>
    </main>
  );
}
