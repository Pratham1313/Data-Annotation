import React, { useState } from "react";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";

function ProjectaddModal() {
  const { isProjectModalOpen, closeProjectModal, addProject, projects } =
    useStore();
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");

  if (!isProjectModalOpen) return; // Hide modal if it's not open

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          onClick={closeProjectModal}
        ></div>
        <div className="relative w-[400px] h-[70%] bg-gray-800 rounded-2xl px-10 text-white py-10">
          <div className="text-3xl font-semibold mt-8 mb-8">Add Project</div>
          <input
            className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm bg-[#333333] border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2 mb-7"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <textarea
            className="w-full h-[15vh] xs:h-[6.5vh] rounded-sm bg-[#333333] border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2"
            placeholder="Project Description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />
          <button
            className="w-full h-[8vh] rounded-md bg-green-600 mt-5"
            onClick={() => {
              if (name && description) {
                const projectExists = projects.find(
                  (project) =>
                    project.project_name.toLowerCase() === name.toLowerCase()
                );

                if (!projectExists) {
                  addProject(name, description);
                  toast.success("Project Added");
                  setname("");
                  setdescription("");
                  closeProjectModal();
                } else {
                  toast.error("Project already exists");
                }
              } else {
                toast.error("Complete all fields");
              }
            }}
          >
            Add
          </button>
          <button
            className="absolute top-2 right-2 text-white"
            onClick={() => {
              closeProjectModal();
              setname("");
              setdescription("");
            }}
          >
            X
          </button>
        </div>
      </div>
    </>
  );
}

export default ProjectaddModal;
