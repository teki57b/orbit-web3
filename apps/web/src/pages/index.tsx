/* eslint-disable react/button-has-type */
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from 'styles/Home.module.scss';

import logoImg from '../assets/orbit.png';

import { Balance } from '../components/TokenBalance';
import { Deposit } from '../components/Deposit';
import ConnectButton from '../components/Button/ConnectButton';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Team Orbit</title>
    </Head>

    <main className={styles.main}>
      <div className={styles.center}>
        <Image className={styles.logo} src={logoImg} alt="Orbit Logo" priority />
        <h1 className="mx-2 text-3xl font-semibold">Orbit Vault</h1>
      </div>{' '}
      <div>
        <ConnectButton />
      </div>
      <Balance />
      <Deposit />
    </main>
  </>
);

export default Home;
