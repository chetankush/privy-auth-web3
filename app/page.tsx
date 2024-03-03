"use client"
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";


interface MenuItem {
  name: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { name: 'Home', href: '/home' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
  // Add more items as needed
];
export default function Home() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();
  if (!ready) return <></>;
  if (ready && authenticated) router.push("/loggedin")
  return (
    <main className="w-full">
      <header className="relative w-full border-b bg-white pb-4 mt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="inline-flex items-center space-x-2">
            <span className='w-10'>
              <Image src="/account_abs.png" alt="account_abs_logo"
                width={60}
                height={60}
              />
            </span>
            <span className="font-bold">Eth solutions</span>
          </div>
          <div className="">
            <ul className="inline-flex space-x-8 ">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between">

            <div className="max-w-fit px-8 py-2  bg-black text-white rounded-full">
              <button
                onClick={login}
              >
                Sign in
              </button>
            </div>

          </div>
          <div className="lg:hidden">
            <div className="h-6 w-6 cursor-pointer" ></div>
          </div>

        </div>
      </header>
      {/* Hero Section */}

      <div className="relative w-full bg-white">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="flex flex-col justify-center px-4 py-10 lg:px-6">
            <div className="mt-10 flex max-w-max items-center space-x-2 rounded-full p-2">
              <h3 className=" font-medium md:text-sm">

                Welcome Home {''}!

              </h3>
            </div>
            <h1 className="mt-8 max-w-4xl text-3xl font-bold tracking-tight text-black md:text-4xl lg:text-6xl">
              People who really cares about your business
            </h1>
            <p className="mt-8 max-w-3xl text-lg text-gray-700">
              Partner with best crypto marketing agency to 3x your ROI
              Grow your brand with
              best in class Blockchain,
              Web3 services
            </p>
            <div className="mt-8">
              <button
                type="button"
                className="rounded-md bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Connect with us
              </button>
            </div>
          </div>
          <div className="rounded-lg bg-gray-200 py-44 h-100">

          </div>
        </div>
      </div>

    </main>
  );
}
