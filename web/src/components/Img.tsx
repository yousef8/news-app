import React, { useState } from "react";

const Img: React.FC<{
  src: string | null;
  fallBack: string;
  className: string;
}> = ({ src, fallBack, className }) => {
  const [failedToLoad, setFailedToLoad] = useState<boolean>(false);

  if (!src || failedToLoad) {
    return <img src={fallBack} className={className} />;
  }

  return (
    <img
      src={src || undefined}
      className={className}
      onError={() => setFailedToLoad(true)}
    />
  );
};

export default Img;
