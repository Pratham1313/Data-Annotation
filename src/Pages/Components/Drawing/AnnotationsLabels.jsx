import React from "react";

function AnnotationsLabels({ currentImage, classes }) {
  const annotations = currentImage?.annotations || [];
  const classList = Array.isArray(classes) ? classes : [];

  const counts = classList
    .map((c) => ({
      class_label: c.class_label,
      count: annotations.filter(
        (item) => item.class_name === c.class_label && item.width !== 0
      ).length,
      color: c.color,
    }))
    .filter((c) => c.count > 0);

  return (
    <>
      <div className="text-white text-3xl font-semibold">Annotations</div>
      <div className="pr-11 mt-5">
        {counts.map((item) => (
          <div
            key={item.class_label}
            className="flex justify-between items-center text-white mb-2"
          >
            <div>{item.class_label}</div>
            <div>{item.count}</div>
            <div
              className="w-[50px] h-[22px] rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AnnotationsLabels;
