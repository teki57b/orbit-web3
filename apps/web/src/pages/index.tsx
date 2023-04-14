/* eslint-disable react/button-has-type */
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from 'styles/Home.module.scss';

import dynamic from 'next/dynamic';

const ConnectButton = dynamic(() => import('../components/Button/ConnectButton'), {
  ssr: false
});

const Home: NextPage = () => (
  <>
    <Head>
      <title>Team Orbit</title>
    </Head>
    <main className={styles.main}>
      <div>
        <ConnectButton />
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/orbit.png"
          width={640}
          height={480}
          alt="Orbit Logo"
          priority
        />
      </div>
      <div className={styles.center}>
        <h1 className="mx-2 text-3xl font-semibold">Orbit Vault</h1>
      </div>
    </main>
  </>
);

export default Home;
