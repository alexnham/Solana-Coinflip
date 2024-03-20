import { useState, useEffect } from 'react';
import heads from './images/heads.gif';
import tails from './images/tails.gif';
import original from "./images/default.gif";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { User } from './User';


export const Main = () => {
    const web3 = require("@solana/web3.js")
    const bs58 = require("bs58")
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { changeState, getCurrState, initialized } = User()
    const [count, setCount] = useState(0);
    const [currState, setCurrState] = useState()
    const [decisionText, setDecisionText] = useState("");
    const [imageSrc, setImageSrc] = useState(original);
    const [choice, setChoice] = useState("");
    const [visibility, setVisibility] = useState(true)
    let timeSecond = 5;
    let or = 0;

    useEffect(() => {
        async function setState() {
            const userState = await getCurrState()
            setCurrState(userState)
        }
        setState()
    }, [initialized, currState])

    const flip = () => {
        setDecisionText("")
        setVisibility(false);
        if (choice !== "") {
            const countdown = setInterval(async () => {
                setImageSrc(or === 1 ? heads : tails);
                setDecisionText("");
                timeSecond--;
                if (timeSecond === 0) {
                    clearInterval(countdown)
                    if (await getCurrState() === 1) {
                        setDecisionText(`${or === 1 ? "Heads" : "Tails"}`);
                        setCount(prevCount => prevCount + 1);
                        setImageSrc(original);
                        setCurrState(-1)
                    } else {
                        setDecisionText(`${or === 1 ? "Heads" : "Tails"}`);
                        setCount(0);
                        setImageSrc(original);
                        setCurrState(-1)



                    }
                    setChoice("");

                    setVisibility(true);
                }
            }, 1000);
        }

    };

    const onClick = async () => {
        try {
            if (!publicKey) throw new WalletNotConnectedError();

            if (choice === "") {
                setVisibility(true);
                setDecisionText("Make Your Decision");
            } else {
                or = random()

                try {
                    const transaction = new Transaction().add(
                        SystemProgram.transfer({
                            fromPubkey: publicKey,
                            toPubkey: process.env.REACT_APP_RECIEVE_WALLET,
                            lamports: 1_000_000_0,
                        })
                    );
                    const signature = await sendTransaction(transaction, connection);

                    if ((or === 1 && choice === "heads") || (or === 0 && choice === "tails")) {
                        await changeState(1)

                    }
                    else {
                        await changeState(2)

                    }

                    if (signature) flip();
                } catch (error) {
                    console.error("Error processing transaction:", error);
                }



            }
        } catch (e) {
            alert(e);
        }

    }

    const claimLoss = async () => {
        await changeState(0)
        setCurrState(-1)
    }
    const claimWin = async () => {
        const privateKey = new Uint8Array(bs58.decode(process.env.REACT_APP_SENDER_PK));

        const account = web3.Keypair.fromSecretKey(privateKey);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: account.publicKey,
                toPubkey: publicKey,
                lamports: 2_000_000_0,
            })
        );
        await changeState(0)
        setCurrState(-1)
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [account]);
    }





const random = () => {
    return Math.random() > 0.5 ? 1 : 0;
};
return { count, imageSrc, visibility, choice, setChoice, onClick, decisionText, currState, claimWin, claimLoss }
}
