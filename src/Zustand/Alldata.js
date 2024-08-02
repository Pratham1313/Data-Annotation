import create from "zustand";

const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);
const brightColors = [
  "#00FF00", // Lime
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FF4500", // Orange Red
  "#32CD32", // Lime Green
  "#8A2BE2", // Blue Violet
  "#FFD700", // Gold
  "#ADFF2F", // Green Yellow
  "#FF69B4", // Hot Pink
  "#00CED1", // Dark Turquoise
  "#FF6347", // Tomato
  "#7FFF00", // Chartreuse
  "#40E0D0", // Turquoise
  "#DA70D6", // Orchid
  "#EEE8AA", // Pale Goldenrod
  "#8B0000", // Dark Red
];

const randomBrightColor = (index) => {
  return brightColors[index];
};

const useStore = create((set) => ({
  // Initialize all states
  imageSrc: null,
  Color: "#000000",
  action: null,
  current: 0,
  all_annotations: [],
  class_label: null,
  counter: 0,
  classes: [
    { class_label: "Dog", color: "#FF7F50" },
    { class_label: "Cat", color: "#B0E0E6" },
    { class_label: "Lion", color: "#FF69B4" },
  ],

  setImageSrc: (src) =>
    set(() => {
      const newAnnotations = src
        ? src.map((i, index) => ({
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
        { class_label: newClassLabel, color: randomBrightColor(state.counter) },
      ],
      counter: state.counter + 1,
    })),
}));

export default useStore;
