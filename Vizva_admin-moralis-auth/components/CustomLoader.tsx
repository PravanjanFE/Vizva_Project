const styles = {
    wrapper: {
        //position: 'fixed',
        zIndex: '1999',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#ffffffcc',
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

const CustomLoader = (props:any) => {
    // full page loader
    return (
        <>
            <div className="loader-wrapper" style={styles.wrapper}>
                <div className="loader">
                    <div className="loader-inner">
                        <div className="loader-inner-content d-flex flex-column" style={{placeItems: "center"}}>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            {props.loaderText && <strong>{props.loaderText}</strong>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomLoader;
