"use client"
import React, { useEffect, useState } from 'react'
import { usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { DemoTransactionButton } from '../components/SendTransaction'
// import SignMessage from '../components/signMessage'

import { useCallback, useMemo } from "react"
import { useAccount, useDisconnect, useWalletClient } from "wagmi"
import { usePublicClient } from "wagmi"

import {
    SmartAccount,
    signerToSimpleSmartAccount
} from "permissionless/accounts"
import { PrivyProvider } from "@privy-io/react-auth"
import { Address, Chain, Hash, Transport, http } from "viem"
// import { CustomSigner } from "./customSigner"
import {
    SmartAccountClient,
    createSmartAccountClient,
    walletClientToCustomSigner
} from "permissionless"
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico"

import { PrivyWagmiConnector, usePrivyWagmi } from "@privy-io/wagmi-connector"
import { WagmiConfig, createConfig, configureChains, sepolia } from "wagmi"
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc"

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





if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID)
    throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID")

const pimlicoPaymaster = createPimlicoPaymasterClient({
    transport: http(process.env.NEXT_PUBLIC_PIMLICO_PAYMASTER_RPC_HOST!)
})





const page = () => {
  const { isConnected } = useAccount()


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

  const { login } = usePrivy()
  const { disconnect } = useDisconnect()


  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [smartAccountClient, setSmartAccountClient] = useState<SmartAccountClient<Transport, Chain, SmartAccount> | null>(null);
  const publicClient = usePublicClient()

  const { data: walletClient } = useWalletClient()
  const [txHash, setTxHash] = useState<string | null>(null)
  
  

  const { setActiveWallet } = usePrivyWagmi()

  const embeddedWallet = useMemo(
    () => wallets.find((wallet) => wallet.walletClientType === "privy"),
    [wallets]
    )



    const signIn = useCallback(async () => {
      setShowLoader(true)
      login()
    }, [login])
    
    const signOut = useCallback(async () => {
      setShowLoader(false)
      disconnect()
    }, [disconnect])
    
    
    useEffect(() => {
      (async () => {
          if (isConnected && walletClient && publicClient) {
    
              const customSigner = walletClientToCustomSigner(walletClient)
    
              const safeSmartAccountClient = await signerToSimpleSmartAccount(
                  publicClient,
                  {
                      entryPoint: process.env
                          .NEXT_PUBLIC_ENTRYPOINT! as Address,
                      signer: customSigner,
                      factoryAddress: process.env
                          .NEXT_PUBLIC_FACTORY_ADDRESS! as Address
                  }
              )
    
              const smartAccountClient = createSmartAccountClient({
                  account: safeSmartAccountClient,
                  chain: sepolia,
                  transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC_HOST!),
                  sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation
                }) as SmartAccountClient<Transport, Chain, SmartAccount>;
                
                setSmartAccountClient(smartAccountClient);
          } 
      })()
    }, [isConnected, walletClient, publicClient])

  const router = useRouter();

  
  useEffect(() => {
    if (!ready) {
        return;
    }
    setUpEmbeddedWallet();
}, [wallets, ready]);

const setUpEmbeddedWallet = async () => {
    const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
    );

    if (embeddedWallet) {
        setActiveWallet(embeddedWallet);
        const provider = await embeddedWallet.getEthereumProvider();
        await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${Number(11155111).toString(16)}` }],
        });
        
        const ethProvider = new ethers.BrowserProvider(provider);
        const walletBalance = await ethProvider.getBalance(embeddedWallet.address);
        const ethStringAmount = ethers.formatEther(walletBalance);
        setWalletBalance(ethStringAmount);
        setEmbeddedWallet(embeddedWallet);
    }
};





  if (ready && !authenticated) router.push("/")

  
  

const onSendTransaction = (txHash: Hash) => {
    setTxHash(txHash)
}

const onSendMessage = (txHash: Hash) => {
    setTxHash(txHash)
}

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



    if (!user) return <></>;
  
  
    if (isConnected && smartAccountClient && embeddedWallet) {
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
      <DemoTransactionButton
                    smartAccountClient={smartAccountClient}
                    onSendTransaction={onSendTransaction}
                />
      </div>
      </div>
    </div>
  );

}
}


export default page
