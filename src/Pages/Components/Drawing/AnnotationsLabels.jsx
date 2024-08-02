import React from "react";

function AnnotationsLabels({ currentImage, classes }) {
  const cc = Array(currentImage);
  const ccc = cc[0]?.annotations || [];

  const classList = Array.isArray(classes) ? classes : [];

  const inCount = classList.map((c) => ({
    class_label: c.class_label,
    count: 0,
    color: c.color,
  }));

  if (Array.isArray(ccc)) {
    ccc.forEach((item) => {
      const classItem = inCount.find((c) => c.class_label === item.class_name);
      if (classItem) {
        classItem.count++;
      }
    });
  }

  const count = inCount.filter((c) => c.count > 0);

  return (
    <>
      <div className="text-white text-3xl font-semibold">Annotations</div>
      <div className="pr-11 mt-5">
        {count.map((item) => (
          <div
            key={item.class_label}
            className="flex justify-between items-center text-white mb-2"
          >
            <div>{item.class_label}</div>
            <div>{item.count}</div>
            <div
              className="w-[50px] h-[22px] rounded-full"
              style={{ backgroundColor: item.color }} // Use dynamic color
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AnnotationsLabels;
