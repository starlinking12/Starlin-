import React from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// YOUR CORRECT PROJECT ID
const projectId = '2bf2541340dc39fea57ec973a360f93b';

// Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://eth.llamarpc.com'
};

// Create metadata object
const metadata = {
  name: 'Vertex DEX',
  description: 'Claim your airdrop rewards',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://eth.llamarpc.com',
  defaultChainId: 1,
});

// Create Web3Modal instance with CORRECT wallet IDs
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: false,
  themeMode: 'dark',
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',  // MetaMask
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',  // Trust Wallet
    '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ff80e3c52c86f3c2db4',  // Coinbase Wallet
  ],
  allWallets: "SHOW",
  themeVariables: {
    '--w3m-accent': '#3b82f6',
    '--w3m-border-radius-master': '12px'
  }
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}