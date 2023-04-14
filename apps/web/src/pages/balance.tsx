import { useAccount, useBalance } from 'wagmi';

export const Balance = () => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address,
    token: '0x0b48aF34f4c854F5ae1A3D587da471FeA45bAD52'
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
};
