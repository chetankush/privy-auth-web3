"use client"
import React, { useState } from 'react'
import { User } from '@privy-io/react-auth'


type Props = {
    signMessage: any,
    user: User;
}



const SignMessage = ({ signMessage, user }: Props) => {

    const [hasSigned, setHasSigned] = useState(false);
    const [signature, setSignature] = useState("");

    const message = "This is a test message"

const uiConfig = {
    title: "Testing Signing Feature",
    description: "This is a demo to test the signin feature",
    buttonText: "Sign the message"
};

const handleClick = async () => {
    try {
        const signature = await signMessage(message, uiConfig);
        setSignature(signature);
        setHasSigned(true);
    } catch (error) {
        console.error("Error during signMessage:", error);
    }
};

return (
    <div>
        <button
            className='bg-black rounded-full flex justify-center p-4 w-40 ml-4 text-white'
            onClick={handleClick}
            disabled={!user.wallet}
        >
            Sign Message
        </button>

        {hasSigned && (
            <p className='mt-4'>Signed message with signature: {signature}</p>
        )}
    </div>
);

}

export default SignMessage
