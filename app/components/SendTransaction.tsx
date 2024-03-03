import React, { useState } from 'react';
import { ethers } from 'ethers';
import { User } from "@privy-io/react-auth";

type Props = {
  user: User,
  sendTransaction: any;
}

const SendTransaction = ({ user, sendTransaction }: Props) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [ethAmount, setEthAmount] = useState("0.001");

  const sendTs = async () => {
    const weiValue = ethers.utils.parseEther(ethAmount);
    const hexWeiValue = ethers.utils.hexlify(weiValue);

    const unsignedTx = {
      to: recipientAddress,
      chainId: 11155111,
      value: hexWeiValue,
    }

    const txUiConfig = {
      header: "Send Transaction",
      description: `Send ${ethAmount} Eth to ${recipientAddress}`,
      buttonText: "Send",
    }

    if (user.wallet) {
      await sendTransaction(unsignedTx, txUiConfig);
    }
    
  }

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        className="border rounded-l p-2 w-48 focus:outline-none"
      />
      <input
        type="number"
        step="0.001"
        placeholder="ETH Amount"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
        className="border p-2 w-20 focus:outline-none"
      />
      <button
        className='bg-black rounded-full flex justify-center p-4 w-40 ml-4 text-white'
        onClick={sendTs}
        disabled={!user.wallet || !ethers.utils.isAddress(recipientAddress)}
      >
        Send Eth
      </button>
    </div>
  );
}

export default SendTransaction;
