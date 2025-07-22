import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Go back to homepage
      </Link>
    </div>
  );
}
