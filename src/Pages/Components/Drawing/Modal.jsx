import React from "react";
import useStore from "../../../Zustand/Alldata";

function Modal({ classes }) {
  const { isModalOpen, closeModal, set_classlabel } = useStore((state) => ({
    isModalOpen: state.isModalOpen,
    closeModal: state.closeModal,
    set_classlabel: state.set_classlabel, // Ensure set_classlabel is included
  }));

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select the class</h2>
        </div>
        <div className="mt-4">
          {classes.map((classs, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-slate-400 px-2 hover:rounded-md"
              style={{ color: classs.color }}
              onClick={() => {
                closeModal(classs.class_label); // Close the modal
              }}
            >
              {classs.class_label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
