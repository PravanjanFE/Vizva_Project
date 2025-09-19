import Lottie, { LottieComponentProps } from "lottie-react";
import loadingAnimation from "../../public/lottie json/Loading.json";

// interface Props extends LottieComponentProps {}
export default function LoadingAnimation(
  props: Omit<LottieComponentProps, "animationData">
) {
  return (
    <div className={props.className}>
      <Lottie
        {...props}
        animationData={loadingAnimation}
        loop={true}
        autoPlay={true}
      />
    </div>
  );
}
