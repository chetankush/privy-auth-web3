"use client"
import React, { useEffect, useState } from 'react'
import { usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SignMessage from '../components/signMessage'
import SendTransaction from '../components/SendTransaction'



interface MenuItem {
  name: string;
  href: string;
}



const menuItems: MenuItem[] = [
  { name: 'Home', href: '/home' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' }
];

const page = () => {


  const [selectedLink, setSelectedLink] = useState("");


  const [walletBalance, setWalletBalance] = useState("");
  const [embeddedWallets, setEmbeddedWallet] = useState<any>("");

  const { user, ready,
    linkWallet,
    linkEmail,
    linkGithub,
    linkGoogle,
    linkPhone,
    linkDiscord,
    linkTwitter,
    logout, authenticated, signMessage, sendTransaction } = usePrivy();

  const { wallets } = useWallets();

  // Replace the string below with your desired address

  const router = useRouter();
  useEffect(() => {
    if (!ready) {
      return;
    } else {
      setUp();
    }
    async function setUp() {

      const embeddedWallets = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );

      if (embeddedWallets) {
        const provider = await embeddedWallets.getEthereumProvider();
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(11155111).toString(16)}` }],
        });

        const ethProvider = new ethers.providers.Web3Provider(provider);
        const walletBalance = await ethProvider.getBalance(
          embeddedWallets.address
        );

        const ethStringAmount = ethers.utils.formatEther(walletBalance);
        setWalletBalance(ethStringAmount);
        setEmbeddedWallet(embeddedWallets);
      }
    }
  }, [wallets, ready])


  if (ready && !authenticated) router.push("/")

  if (!user) return <></>;


  const linkOptions = [
    { label: "Email", action: linkEmail },
    { label: "Wallet", action: linkWallet },
    { label: "Github", action: linkGithub },
    { label: "Discord", action: linkDiscord },
    { label: "Google", action: linkGoogle },
    { label: "Phone", action: linkPhone },
    { label: "Twitter", action: linkTwitter },
  ];


  const handleLinkClick = async () => {
    const selected = linkOptions.find(
      (option) => option.label === selectedLink
    );
    if (selected) {
      selected.action();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black ">
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
                onClick={logout}
              >
                Sign out
              </button>
            </div>

          </div>
          <div className="lg:hidden">
            <div className="h-6 w-6 cursor-pointer" ></div>
          </div>

        </div>
      </header>
      <div className="mx-auto max-w-7xl lg:px-8 items start mt-4">

      <div className="text-xl font-extrabold mr-8 mb-4">Welcome! You are logged in</div>
</div>
      <div className="flex justify-between items-start mt-4"> 
      <div className="mb-4 mx-8">
        

      <p>Privy User ID : {user.id}</p>
        <h3 className='font-bold'> All authentication methods </h3>
        <ul className="list-inside list-disc">
          <li>Email: {user.email ? user.email.address : "None"}</li>
          <li>Wallet: {user.wallet ? user.wallet.address : "None"}</li>
          <li>Google: {user.google ? user.google.email : "None"}</li>
          <li>Discord: {user.discord ? user.discord.username : "None"}</li>
          <li>Twitter: {user.twitter ? user.twitter.username : "None"}</li>
          <li>Github: {user.github ? user.github.username : "None"}</li>

        </ul>
      </div>

      <div className="flex justify-center text-center items-center mx-8">
        <select
          value={selectedLink}
          onChange={(e) => { setSelectedLink(e.target.value) }}
          className="border rounded-full px-4 py-3"
        >
          <option>select an account to link</option>
          {linkOptions.map((option, index) => (
            <option key={index} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleLinkClick}
          className="px-2 py-2 rounded-full text-white bg-black hover:bg-gray-800 ml-2 "
        >
          Connect Other Accounts
        </button>
      </div>
   </div>
      <div className="w-[1000px] flex flex-row items-center mt-8 justify-between">
       <div className="flex justify-start">

        <h3 className="font-extrabold mb-2 mx-10 ">Embedded Wallet <br /> Address:</h3>
        <div className="flex flex-col">

          <p>{embeddedWallets?.address}</p>

          {walletBalance && (
            <p className="mt-2">With a balance of {walletBalance} ETH</p>
          )}
        </div>

       </div>

      <div className="flex justify-center my-8">
        <SendTransaction user={user} sendTransaction={sendTransaction} />
      </div>
      </div>
    </div>
  );

}

export default page
