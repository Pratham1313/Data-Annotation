import { useState } from "react";
import Imageupload from "./Components/image/Imageupload";
import Stages from "./Components/Drawing/Stages";
import Options from "./Components/Drawing/Options";

function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const [Color, setColor] = useState("#000000");
  const [action, setAction] = useState(null);
  const [current, setcurrent] = useState(0);
  const no_images = imageSrc?.length;

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-t from-purple-900 to-slate-900">
      {imageSrc && (
        <div className="w-[20vw] h-screen  rounded-r-3xl bg-gradient-to-t from-purple-900 to-neutral-900 border-r-2 border-purple-900 py-6 pt-10  bo">
          <p className="text-white font-medium text-3xl ml-7 ">Images</p>
          <div className="w-full h-[90%] mt-5 px-7 overflow-auto custom-scrollbar">
            {imageSrc.map((image, index) => {
              return (
                <>
                  <div className="relative" onClick={() => setcurrent(index)}>
                    <img
                      src={image.src}
                      className={`w-[250px] h-[200px] object-fill mt-3 ${
                        current === index
                          ? "border-[4px] border-yellow-400"
                          : "border-[2px] border-white"
                      }`}
                    />
                    <div className="text-white absolute bottom-0 border-[2px] border-white p-2 bg-black rounded-e-md">
                      {current === index ? "Selected" : index + 1}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      )}
      <div className="w-[80vw] h-screen  overflow-hidden">
        <div className="h-full flex gap-4 justify-center items-center">
          {imageSrc ? (
            <>
              <div className="">
                <div className="flex justify-center gap-5">
                  <Options
                    Color={Color}
                    setColor={setColor}
                    setAction={setAction}
                    action={action}
                  />
                  <button className="px-3 py-2 text-white bg-green-500 rounded-full font-medium ">
                    Save Changes
                  </button>
                </div>
                <div className=" flex justify-center mt-5">
                  <Stages
                    imageSrc={imageSrc[current]}
                    action={action}
                    Color={Color}
                    images={imageSrc}
                    current={current}
                  />
                </div>
              </div>
            </>
          ) : (
            <Imageupload setImageSrc={setImageSrc} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
