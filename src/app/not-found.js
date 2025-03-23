import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4 capitalize">
      <h1 className="font-semibold text-xl">Page not found or not yet created!</h1>
      <Link href='/' className="bg-black text-white px-3 py-3 rounded-lg font-semibold hover:font-semibold hover:text-green-300 cursor-pointer">Return to homepage</Link>
    </div>
  )
}
