import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <header className="mb-30 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-sky-600 mb-4">
          Affordable Housing with Seniors
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 max-w-xl mx-auto">
          Connecting seniors with affordable, comfortable, and community-driven
          housing solutions.
        </p>
      </header>
      <main className="w-full max-w-md">
        <div className="bg-gray-50 rounded-xl shadow-md p-8 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Find Your New Home
          </h2>
          <p className="text-gray-500 mb-6 text-center">
            Browse available listings, connect with trusted hosts, and join a
            supportive community.
          </p>
          <a
            href="#"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Get Started
          </a>
        </div>
      </main>
      <footer className="mt-16 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Affordable Housing with Seniors
      </footer>
    </div>
  );
}
