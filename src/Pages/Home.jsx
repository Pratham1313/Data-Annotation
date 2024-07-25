import { useState } from "react";
import Imageupload from "./Components/image/Imageupload";
import Stages from "./Components/Drawing/Stages";
import Options from "./Components/Drawing/Options";

function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const [Color, setColor] = useState("#000000");
  const [action, setAction] = useState(null);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-t from-purple-900 to-slate-900">
      <div>
        <div className=" flex gap-4 justify-center">
          <Imageupload setImageSrc={setImageSrc} />
          {imageSrc && (
            <Options
              Color={Color}
              setColor={setColor}
              setAction={setAction}
              action={action}
            />
          )}
        </div>
        <div className=" flex justify-center">
          <Stages imageSrc={imageSrc} action={action} Color={Color} />
        </div>
      </div>
    </div>
  );
}

export default Home;
