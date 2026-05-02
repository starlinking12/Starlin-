import React from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId from https://cloud.walletconnect.com
// This is a placeholder, user should provide their own in production.
const projectId = '76288820f86236319808a38a7c152a55';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
};

// 3. Create a metadata object
const metadata = {
  name: 'EtherFlow',
  description: 'EtherFlow Airdrop Rewards',
  url: 'https://etherflow.io', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: 'https://cloudflare-eth.com', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#FF4E00',
    '--w3m-border-radius-master': '1px'
  }
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
