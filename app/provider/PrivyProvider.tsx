"use client";

import {PrivyProvider } from "@privy-io/react-auth";


const handlelogin = (user: any) => {
    console.log(`User ${user.id} logged in!`);
}

function PrivyProviderB({children}: {children: React.ReactNode}) {

   return (<PrivyProvider
       appId={ process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
       onSuccess={handlelogin}
       config={{
        loginMethods: [
          "wallet",
          "email",
          "google",
          "discord",
          "github",
          "twitter"
        ],
        embeddedWallets: {
            createOnLogin: "users-without-wallets"
        },
        appearance:{
            theme: "light",
            accentColor: "#676FFF",
            logo: "https://cdn1.vectorstock.com/i/1000x1000/92/50/data-cube-blockchain-technology-background-vector-43969250.jpg"
        }
       }}
    >
        {children} 
    </PrivyProvider>

    );
}

export default PrivyProviderB;