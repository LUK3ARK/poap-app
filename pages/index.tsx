import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  const [wallet, setWallet] = useState('');
  const [poapCode, setPoapCode] = useState('');
    
  return (
    <div className={styles.container}>
      <Head>
        <title>POAP</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to POAP enter your code
        </h1>

      <input type='text' placeholder='enter wallet' onChange={(e) => setWallet(e.target.value)}>
      </input>

      <input type='text' placeholder='enter poap here' onChange={(e) => setPoapCode(e.target.value)}>
      </input>

      <button onClick={async () => {
        await fetch(`api/enterPoap?walletAddress=${wallet}&poapCode=${poapCode}`)
      }}>
        Enter Poap
      </button>
        
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}

export default Home
