import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react";
export const WalletConnectProvider = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(() => {
        if (network === WalletAdapterNetwork.Devnet) {
            return `https://devnet.helius-rpc.com/?api-key=${process.env.REACT_APP_RPC}`
        }
        return clusterApiUrl(network)
    }, [network])

    const wallets = useMemo(() => [new PhantomWalletAdapter()], [network])
    return (<ConnectionProvider endpoint={ endpoint } > <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider >
    </ConnectionProvider>)
}