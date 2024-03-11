"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAccount, useDisconnect, useWalletClient } from "wagmi"
import { usePublicClient } from "wagmi"

import {
    SmartAccount,
    signerToSimpleSmartAccount
} from "permissionless/accounts"
import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth"
import {
    SmartAccountClient,
    createSmartAccountClient,
  
} from "permissionless"
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico"

import { PrivyWagmiConnector, usePrivyWagmi } from "@privy-io/wagmi-connector"
import { WagmiConfig, createConfig, configureChains, sepolia } from "wagmi"
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc"
import { ethers } from 'ethers'

// import { SmartAccountProvider } from "./SmartAccountContext";


const handlelogin = (user: any) => {
    console.log(`User ${user.id} logged in!`);
}

const configureChainsConfig = configureChains(
    [sepolia],
    [
        jsonRpcProvider({
            rpc: () => ({
                http: process.env.NEXT_PUBLIC_RPC_URL!
            })
        })
    ]
)







const config = createConfig({
    autoConnect: true,
    publicClient: configureChainsConfig.publicClient
})

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID)
    throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID")



function PrivyProviderB({ children }: { children: React.ReactNode }) {

    return (
    
        <WagmiConfig config={config}>
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                embeddedWallets: {
                    createOnLogin: "all-users"
                },
                loginMethods: [

                    "wallet",
                    "email",
                    "google",
                    "discord",
                    "github",
                    "twitter"

                ],
                appearance: {
                    theme: "light",
                    accentColor: "#676FFF",
                    logo: "https://avatars.githubusercontent.com/u/125581500?s=200&v=4"
                }
            }}
        >
            <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
                {children}
            </PrivyWagmiConnector>
        </PrivyProvider>
    </WagmiConfig>
    
    // <PrivyProvider
    //     appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
    //     onSuccess={handlelogin}
    //     config={{
    //         loginMethods: [
    //             "wallet",
    //             "email",
    //             "google",
    //             "discord",
    //             "github",
    //             "twitter"
    //         ],
    //         embeddedWallets: {
    //             createOnLogin: "all-users",
    //             noPromptOnSignature: true

    //         },
    //           // @ts-ignore
    //       defaultChain: sepolia,

    //         appearance: {
    //             theme: "light",
    //             accentColor: "#676FFF",
    //             logo: "https://cdn1.vectorstock.com/i/1000x1000/92/50/data-cube-blockchain-technology-background-vector-43969250.jpg"
    //         }
    //     }}
    // >



    //     {children}

    // </PrivyProvider>

    );
}

export default PrivyProviderB;