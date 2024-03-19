import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import { COINFLIP_PROGRAM_PUBKEY } from "./constants/index"
import coinflipIDL from './constants/coinflip.json'
import toast from 'react-hot-toast'
import { SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'


export function User() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()
    const [loading, setLoading] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [transactionPending, setTransactionPending] = useState(false)


    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
            return new anchor.Program(coinflipIDL, COINFLIP_PROGRAM_PUBKEY, provider)
        }
    }, [connection, anchorWallet])

    useEffect(() => {
        const findProfileAccounts = async () => {
            if (program && publicKey && !transactionPending) {
                try {
                    setLoading(true)
                    const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.userProfile.fetch(profilePda)

                    if (profileAccount) {
                        setInitialized(true)
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                } finally {
                    setLoading(false)
                }
            }
        }

        findProfileAccounts()
    }, [publicKey, program, transactionPending])

    const getCurrState = async () => {
        if (program && publicKey) {
            const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
            const profileAccount = await program.account.userProfile.fetch(profilePda)
            if (profileAccount) {
               return profileAccount.state
            }
            else {
                return 0;
            }
        } else{
        }
    }
    const getAccount = async () => {
        if (program && publicKey) {
            const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
            const profileAccount = await program.account.userProfile.fetch(profilePda)
            if (profileAccount) {
               return profileAccount
            }
            else {
                return 0;
            }
        } else{
        }
    }

    const changeState = async (change_state) => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)
                const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                const tx = await program.methods.setUser(change_state).accounts({
                    authority: publicKey,
                    userProfile: profilePda,
                    systemProgram: SystemProgram.programId
                }).rpc()
            } finally {
                setTransactionPending(false)
                setLoading(false)
            }
        }
    }
   
   
    const initializeUser = async () => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                const tx = await program.methods
                    .initUser()
                    .accounts({
                        authority: publicKey,
                        userProfile: profilePda,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                setInitialized(true)
                toast.success('Successfully initialized user.')
            } catch (error) {
                console.log(error)
                toast.error(error.toString())
            } finally {
                setTransactionPending(false)
            }
        }
    }
    return { initialized, initializeUser, changeState, getCurrState ,getAccount}

}