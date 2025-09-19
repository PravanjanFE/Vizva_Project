import type { NextPage } from 'next'
import Head from 'next/head'
import Dashboard from '../components/Dashboard'

const Home: NextPage = () => {
  return (
    <div className="wrapper">
      <Head>
        <title>Vizva Admin</title>
        <meta name="description" content="Vizva Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>  
        <Dashboard/>  
    </div>
  )
}

export default Home
