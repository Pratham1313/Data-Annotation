import { RiRectangleLine } from "react-icons/ri";
import { BsVectorPen } from "react-icons/bs";

function Options({ action, setAction }) {
  return (
    <div className=" w-[7rem]  h-[55.5px] bg-slate-500 rounded-full flex justify-center items-center gap-2 ">
      <button
        className={`rounded-full w-11 h-11 flex items-center justify-center ${
          action === "rectangle" ? "bg-slate-200" : "bg-slate-400"
        }`}
        onClick={() => {
          if (action == "rectangle") {
            setAction("");
          } else {
            setAction("rectangle");
          }
        }}
      >
        <RiRectangleLine style={{ width: "60%", height: "60%" }} />
      </button>
      <button
        className={`rounded-full w-11 h-11 flex items-center justify-center ${
          action === "polygon" ? "bg-gray-200" : "bg-slate-400"
        }`}
        onClick={() => {
          if (action == "polygon") {
            setAction("");
          } else {
            setAction("polygon");
          }
        }}
      >
        <BsVectorPen style={{ width: "60%", height: "60%" }} />
      </button>
    </div>
  );
}

export default Options;
