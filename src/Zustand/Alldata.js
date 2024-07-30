import create from "zustand";

// Utility function to check if a color is valid
const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);

const useStore = create((set) => ({
  imageSrc: null,
  Color: "#000000",
  action: null,
  current: 0,
  all_annotations: [], // Initialize as empty

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
}));

export default useStore;
