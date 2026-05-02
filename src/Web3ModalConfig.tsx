import React from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '76288820f86236319808a38a7c152a55';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://eth.llamarpc.com'
};

// 3. Create a metadata object
const metadata = {
  name: 'EtherFlow App',
  description: 'Connect and claim your rewards',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://eth.llamarpc.com',
  defaultChainId: 1,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true,
  themeMode: 'dark',
  featuredWalletIds: [
    'c57ca38b1e23e43973cf688893d8ad65876353d329221ca93328e34278183011', // MetaMask
    '4622a2b2d6ad13253303c07688ca80667ea669288e8f8510f23f8518e38d9756', // Trust Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04544e3cfb6b0af96bf2e22', // Coinbase Wallet
    '8a00bc31c6a25691ad2ae5ba51532168da6c39f046427d14210e7b7fec96131b'  // Rainbow
  ],
  themeVariables: {
    '--w3m-accent': '#007AFF',
    '--w3m-border-radius-master': '2px'
  }
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
