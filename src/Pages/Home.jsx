// Home.js
import { useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import Imageupload from "./Components/image/Imageupload";
import Konvaimage from "./Components/image/Konvaimage";

function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const stageRef = useRef();

  return (
    <div>
      <Imageupload setImageSrc={setImageSrc} />
      {imageSrc && (
        <>
          <Stage
            ref={stageRef}
            width={imageSrc.width}
            height={imageSrc.height}
            className="border-2 bg-red-500 overflow-hidden"
            style={{ width: imageSrc.width }}
          >
            <Layer>
              <Konvaimage image={imageSrc} />
            </Layer>
          </Stage>
        </>
      )}
    </div>
  );
}

export default Home;
