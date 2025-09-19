import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
            crossOrigin="anonymous"
          ></link>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
          />
          <link
            rel="stylesheet"
            href="/static/plugins/fontawesome-free/css/all.min.css"
          />
          <link
            rel="stylesheet"
            href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
          />
          {/* <link
            rel="stylesheet"
            href="/static/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css"
          /> */}
          <link
            rel="stylesheet"
            href="/static/plugins/icheck-bootstrap/icheck-bootstrap.min.css"
          />
          <link rel="stylesheet" href="/static/plugins/jqvmap/jqvmap.min.css" />
          <link
            rel="stylesheet"
            href="/static/dist/css/adminlte.min.css?v=3.2.0"
          />
          <link
            rel="stylesheet"
            href="/static/plugins/overlayScrollbars/css/OverlayScrollbars.min.css"
          />
          <link
            rel="stylesheet"
            href="/static/plugins/daterangepicker/daterangepicker.css"
          />
          <link
            rel="stylesheet"
            href="/static/plugins/summernote/summernote-bs4.min.css"
          />
        </Head>
        <body className="hold-transition sidebar-mini layout-fixed">
          <Main />
          <NextScript />

          {/* <script src="/static/plugins/jqvmap/jquery.vmap.min.js"></script>
                    <script src="/static/plugins/jqvmap/maps/jquery.vmap.usa.js"></script> 
                    <script src="/static/plugins/jquery-knob/jquery.knob.min.js"></script> 
                    <script src="/static/dist/js/pages/dashboard.js"></script> 
                    <script src="/static/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
                    <script>
                        $.widget.bridge('uibutton', $.ui.button)
                    </script>
                    <script src="/static/dist/js/demo.js"></script> 
                    <script src="/static/plugins/chart.js/Chart.min.js"></script>
                    <script src="/static/plugins/sparklines/sparkline.js"></script>
                    <script src="/static/plugins/moment/moment.min.js"></script>
                    <script src="/static/plugins/daterangepicker/daterangepicker.js"></script>
                    <script src="/static/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
                    <script src="/static/plugins/summernote/summernote-bs4.min.js"></script>
                    <script src="/static/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>*/}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
