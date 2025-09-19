import Image from 'next/image';

const styles = {
    wrapper: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        justifyContent: 'center',
        // color: '#fff',
        textAlign: 'center' as const,
    },
    icon: {
        // filter: 'invert(1)',
    },
    subheading: {
        padding: '2rem 0',
        fontFamily: 'monospace',
        opacity: '0.4',
    },
}


const Loader = () => {
    // full page loader
    return (
        <>
            <div className="loader-wrapper" style={styles.wrapper}>
                <div className="loader">
                    <div className="loader-inner">
                        <div className="loader-inner-content">
                            <div className="loader-inner-icon">
                                <Image src="/static/img/logo.svg" alt="logo" style={styles.icon} width="256" height={128}/>
                                <h3 style={styles.subheading}>Unlocking Possibilities..</h3>
                                <h4 style={styles.subheading}>Team Panel</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loader;
