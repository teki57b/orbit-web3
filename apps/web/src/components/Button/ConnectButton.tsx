/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-shadow */
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const ConnectButton = () => {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <div>{address}</div>
        <div>Connected to {connector?.name}</div>
        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => {
        if (!connector) return null;
        return (
          <button
            type="button"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}>
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
          </button>
        );
      })}

      {error && <div>{error.message}</div>}
    </div>
  );
};

export default ConnectButton;
