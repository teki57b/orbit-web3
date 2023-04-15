import { useAccount, useBalance } from 'wagmi';

export const Balance = () => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_ORB_TOKEN_ADDRESS as `0x${string}`
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
};
