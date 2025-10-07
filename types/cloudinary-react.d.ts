declare module "@cloudinary/react" {
  import type { FC, HTMLAttributes } from "react";
  import type { CloudinaryImage } from "@cloudinary/url-gen";

  export interface AdvancedImageProps extends HTMLAttributes<HTMLElement> {
    cldImg: CloudinaryImage;
    style?: React.CSSProperties;
  }

  export const AdvancedImage: FC<AdvancedImageProps>;
}
