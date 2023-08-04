import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import 'styles/globals.scss';
import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { chains, provider } = configureChains(
    [hardhat],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: `http://localhost:8545`
        })
      })
    ]
  );

  // Set up client
  const client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider
  });
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default MyApp;
