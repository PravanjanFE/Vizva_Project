import Image from 'next/image';

const styles = {
  content: {
    padding: `8px 32px`,
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0px 50px'
  }
}

export default function LoginForm() {
  // login user with email and password via Moralis
  return (
    <>
      <style jsx global>{`
        body {
            height: 100vh;
            width: 100%;
            background: #F4F6F9;
            color: #000;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `}</style>
      <div style={styles.content}>
        <div style={styles.textContainer}>
          <Image src="/static/img/logo.svg" height={128} width={256}/>
        </div>
        <div>
        </div>
      </div>
    </>
  )
}