import Lottie from "lottie-react";
import sparkAnimation from "public/lottie json/Spark_Screen.json";
import { forwardRef } from "react";

const SparkAnimation = forwardRef<HTMLDivElement, { className?: string }>(
  (props, ref) => {
    return (
      <div className={props.className} ref={ref}>
        <Lottie
          animationData={sparkAnimation}
          // lottieRef={ref}
          loop={false}
          autoPlay={true}
        />
      </div>
    );
  }
);

export default SparkAnimation;
