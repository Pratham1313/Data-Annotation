import React from "react";
import useStore from "../../Zustand/Alldata";
import ProjectaddModal from "./ProjectaddModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const { openProjectModal, projects, setprojectname } = useStore();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden  ">
      <ProjectaddModal />
      <div className="w-full h-[10%] bg-gray-700 flex items-center text-3xl text-white  font-bold px-7 rounded-b-xl">
        DataScribe.
      </div>
      <div className="w-full h-[90%] px-5">
        <div className="w-full h-[15%] flex  items-center justify-between pr-5">
          <div className="mt-6 mb-4 text-2xl font-bold text-white px-6">
            Project's
          </div>
          <button
            className="px-3 py-2 text-white bg-green-500 rounded-md"
            onClick={openProjectModal}
          >
            Add +
          </button>
        </div>
        {projects.length == 0 && (
          <div className=" text-red-500 text-center font-semibold text-xl">
            No Project's
          </div>
        )}

        {projects.map((project) => {
          return (
            <div
              className="w-full items-center bg-slate-800 px-5 py-3 rounded-xl cursor-pointer mb-5 hover:bg-gray-800"
              onClick={() => {
                setprojectname(project.project_name);
                const toastId = toast.loading("Navigating to your project");
                setTimeout(() => {
                  toast.dismiss(toastId);
                  navigate(`/project/${project.project_name}`);
                }, 1500);
              }}
            >
              <div className="text-xl text-white">{project.project_name}</div>
              <div className="text-gray-400">
                Description - {project.project_description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
