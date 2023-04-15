// deposit ether to contract using wagmi

import { utils } from 'ethers';
import { useState } from 'react';
import { useContract, useSigner } from 'wagmi';
import orbVaultContract from '../abi/OrbVault.json';

export const Deposit = () => {
  const { data: signData } = useSigner();
  const [amount, setAmount] = useState('0.05');
  const vaultContract = useContract({
    address: process.env.NEXT_PUBLIC_ORB_VAULT_ADDRESS,
    abi: orbVaultContract.abi,
    signerOrProvider: signData
  });
  const deposit = async () => {
    console.log(amount);
    const tx = await vaultContract?.deposit(utils.parseEther(amount), {
      value: utils.parseEther(amount)
    });
    await tx?.wait();
  };

  return (
    <div>
      <input
        style={{ color: 'black' }}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="button" onClick={() => deposit()}>
        Deposit
      </button>
    </div>
  );
};
