import { useEffect, useState } from "react";
import Imageupload from "./image/Imageupload";
import Stages from "./Drawing/Stages";
import Options from "./Drawing/Options";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import AnnotationsLabels from "./Drawing/AnnotationsLabels";
import Modal from "./Drawing/Modal";
import { MdDeleteOutline } from "react-icons/md";

function Imagehome() {
  const {
    imageSrc,
    setImageSrc,
    action,
    setAction,
    current,
    setcurrent,
    Color,
    setColor,
    class_label,
    set_classlabel,
    classes,
    add_classes,
    all_annotations,
    isModalOpen,
    openModal,
    closeModal,
  } = useStore();

  const [annotations, setAnnotations] = useState(all_annotations); //just for converting in array it wasy giving error
  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);
  const currentImage = annotations.find((image) => image.image_id === current);

  function submit() {
    const src = imageSrc[current].src;
    const formData = new FormData();
    formData.append("src", src);
    console.log(currentImage.annotations);
    formData.append(
      "annotations",
      JSON.stringify({ annotations: currentImage.annotations })
    );
    console.log(formData);
    axios
      .post("http://127.0.0.1:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          toast.error("Change Not Saved");
        } else {
          console.error("Network Error:", error.message);
          toast.error("Change Not Saved");
        }
      });
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-t from-purple-900 to-slate-900 overflow-hidden">
      {isModalOpen && <Modal classes={classes} />}
      {imageSrc ? (
        <div className="flex w-full h-screen">
          <div className="w-[20vw] h-screen rounded-r-xl bg-gradient-to-t from-purple-900 to-neutral-900 border-r-4 border-purple-900 py-6 pt-10 px-[20px]">
            <AnnotationsLabels currentImage={currentImage} classes={classes} />
          </div>
          <div className="w-[80vw] h-screen flex-col">
            <div className="w-full h-[70vh] ">
              <div className="w-full h-[85%] ">
                <div className=" h-full flex justify-center items-center mt-5">
                  <Stages
                    imageSrc={imageSrc[current]}
                    action={action}
                    Color={Color}
                    images={imageSrc}
                    current={current}
                  />
                </div>
              </div>
              <div className="w-full h-[15%] flex justify-center items-center gap-5">
                <select
                  className=" outline-none w-[10rem] h-[3rem] rounded-full mb-5 text-white bg-slate-500  mt-[25px] border-b-[3px] border-green-500 border-r-0  border-t-0 border-l-0 focus:outline-none focus:ring-0 focus:border-green-500 px-2"
                  placeholder=""
                  value={class_label}
                  onChange={(e) => set_classlabel(e.target.value)}
                  style={{ maxHeight: "5rem", overflowY: "auto" }}
                >
                  <option value="">Select Class Label</option>
                  {classes.map((cls, index) => {
                    return (
                      <option
                        key={index}
                        value={cls.class_label}
                        style={{ color: cls.color }}
                      >
                        {cls.class_label}
                      </option>
                    );
                  })}
                </select>
                <button
                  const
                  className="px-4 py-3 text-white bg-green-500 rounded-full font-medium "
                  onClick={() => {
                    const classs = prompt("Enter class name:");
                    if (classs !== null && classs !== "") {
                      const exits = classes.find(
                        (clas) => clas.class_label === classs
                      );
                      if (!exits) {
                        add_classes(classs);
                        toast.success("Added the class");
                      } else {
                        toast.error("Class Already Exists");
                      }
                    }
                  }}
                >
                  Add New Class
                </button>
                <Options
                  Color={Color}
                  setColor={setColor}
                  setAction={setAction}
                  action={action}
                />
                <button
                  onClick={submit}
                  className="px-4 py-3 text-white bg-green-500 rounded-full font-medium "
                >
                  Save Changes
                </button>
              </div>
            </div>
            <div className="w-full h-[25vh] rounded-t-xl bg-gradient-to-t from-purple-900 to-neutral-900 border-t-4 border-purple-900 py-4 ">
              <p className="text-white font-medium text-2xl ml-7">Images</p>
              <div className="w-full h-[142px] overflow-auto custom-scrollbar flex gap-3 px-5">
                {imageSrc.map((image, index) => (
                  <div
                    className="relative group flex-shrink-0"
                    key={index}
                    onClick={() => {
                      console.log("ahaha", currentImage);
                      if (current != index) {
                        if (Array(currentImage)[0]?.annotations.length > 0) {
                          submit();
                          setcurrent(index);
                        } else if (
                          Array(currentImage)[0]?.annotations.length == 0
                        ) {
                          setcurrent(index);
                        }
                      }
                    }}
                  >
                    <img
                      src={image.src}
                      className={`w-[140px] cursor-pointer h-[120px] object-cover mt-3 ${
                        current === index
                          ? "border-[4px] border-yellow-400"
                          : "border-[2px] border-black"
                      }`}
                      alt={`${index + 1}`}
                    />
                    <div className="absolute top-[11px] p-1 bg-black text-white">
                      {current === index ? "Selected" : index + 1}
                    </div>
                    <button
                      className="absolute top-[11px] right-0 p-1 bg-black text-white cursor-pointer opacity-0 group-hover:opacity-100"
                      onClick={() => {
                        const a = confirm("Do you want to delete");
                      }}
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Imageupload setImageSrc={setImageSrc} />
      )}
    </div>
  );
}

export default Imagehome;