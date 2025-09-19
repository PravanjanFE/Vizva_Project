import Script from "next/script";

export default function Footer() {
    return (
        <>
            <Script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
            {/* <Script async src="/static/plugins/jquery/jquery.min.js" /> */}
            {/* <Script async src="/static/plugins/jquery-ui/jquery-ui.min.js" /> */}
            <script async src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
            {/* <Script src="/static/dist/js/adminlte.min.js" /> */}
            <footer className="main-footer">
                <strong>Copyright &copy; {new Date().getFullYear()} <a href="http://www.vizva.io">Vizva</a>.</strong> All rights reserved.
                <div className="float-right d-none d-sm-inline-block">
                    <b>Version</b> 1.0.0
                </div>
            </footer>
        </>
    )
}

