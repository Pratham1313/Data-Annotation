import { Image } from "react-konva";
import useImage from "use-image";

function Konvaimage({ image }) {
  const [img] = useImage(image.src); //loads the image then only render the image
  return <Image image={img} width={image.width} height={image.height} />;
}

export default Konvaimage;
