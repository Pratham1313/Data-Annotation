// import React, { useEffect, useState } from "react";
// import useStore from "../../../Zustand/Alldata";

// function AnnotationsLabels() {
//   const { all_annotations, current, classes } = useStore();
//   const [annotations, setAnnotations] = useState([]);

//   useEffect(() => {
//     // Ensure all_annotations is an array
//     if (Array.isArray(all_annotations)) {
//       setAnnotations(all_annotations);
//     }
//   }, [all_annotations]);

//   // Find currentImage safely
//   // const currentImage = Array.isArray(annotations)
//   //   ? annotations.find((image) => image.image_id === current)
//   //   : null;

//   // const inCount = classes.map((c) => ({
//   //   class_label: c.class_label,
//   //   count: 0,
//   //   color: c.color,
//   // }));

//   // if (currentImage && Array.isArray(currentImage.annotations)) {
//   //   currentImage.annotations.forEach((item) => {
//   //     const classItem = inCount.find((c) => c.class_label === item.class_name);
//   //     if (classItem) {
//   //       classItem.count++;
//   //     }
//   //   });
//   // }

//   // const count = inCount.filter((c) => c.count > 0);
//   // console.log(count);

//   return (
//     <>
//       {/* <div className="text-white text-3xl font-semibold">Annotations</div>
//       <div className="pr-11 mt-5">
//         {count.map((c) => (
//           <div
//             key={c.class_label}
//             className="flex justify-between items-center text-white"
//           >
//             <div>{c.class_label}</div>
//             <div>{c.count}</div>
//             <div
//               className="w-[50px] h-[22px] rounded-full"
//               style={{ backgroundColor: c.color }}
//             ></div>
//           </div> */}
//         ))}
//       </div>
//     </>
//   );
// }

// export default AnnotationsLabels;
