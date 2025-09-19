import React from "react";
import MaxWidth from "./layout/maxWidth";
import Navbar from "./navigation/navbar";
import Prompt from "./prompt";

type MyState = {
  error: boolean;
};

type MyProps = {
  children: React.ReactNode;
};

class ErrorBoundary extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      error: false,
    };
  }

  static getDerivedStateFromError(error: any) {
    return { error: true };
  }

  componentDidCatch(eror: any, info: any) {
    // this.setState({ error: true });
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div>
          <Navbar />
          <MaxWidth>
            <Prompt
              title="an error occured"
              message="an error we can't recover from right now just occured"
              text="Home"
              href="/"
            />
          </MaxWidth>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
