import create from "zustand";

const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);
const randomBrightColor = () => {
  const randomHue = Math.floor(Math.random() * 360); // Hue ranges from 0 to 360
  const saturation = "100%"; // Max saturation for bright colors
  const lightness = Math.floor(Math.random() * 30) + 45; // Lightness between 40% and 70%

  return `hsl(${randomHue}, ${saturation}, ${lightness}%)`;
};

const useStore = create((set) => ({
  //initialize all states =[]
  imageSrc: null,
  Color: "#000000",
  action: null,
  current: 0,
  all_annotations: [],
  class_label: null,
  classes: [
    { class_label: "Dog", color: randomBrightColor() },
    { class_label: "Cat", color: randomBrightColor() },
    { class_label: "Lion", color: randomBrightColor() },
  ],
  setImageSrc: (src) =>
    set((state) => {
      const newAnnotations = src
        ? src.map((_, index) => ({
            image_id: index,
            annotations: [],
          }))
        : [];
      return { imageSrc: src, all_annotations: newAnnotations };
    }),

  setColor: (color) => {
    if (isValidColor(color)) {
      set({ Color: color });
    } else {
      console.error("Invalid color format. Must be in hex format #rrggbb.");
    }
  },

  setAction: (action) => set({ action }),

  setcurrent: (current) => set({ current }),

  set_allAnnotations: (newAnnotations) =>
    set({ all_annotations: newAnnotations }),

  set_classlabel: (class_label) => set({ class_label }),
  add_classes: (newClassLabel) =>
    set((state) => ({
      classes: [
        ...state.classes,
        { class_label: newClassLabel, color: randomBrightColor() },
      ],
    })),
}));

export default useStore;
