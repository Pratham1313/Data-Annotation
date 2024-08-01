import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import Konvaimage from "../image/Konvaimage";
import toast from "react-hot-toast";
import useStore from "../../../Zustand/Alldata";

function Stages({ images, action, current }) {
  const stageRef = useRef();

  const { all_annotations, set_allAnnotations, classes, class_label } =
    useStore();

  const [annotations, setAnnotations] = useState(all_annotations); //just for converting in array
  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);
  const currentImage = annotations.find((image) => image.image_id === current);

  //getting color
  const current_class = classes.find(
    (classItem) => classItem.class_label === class_label
  );

  const selectedImage_ID = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const isPainting = useRef(false);
  const moved = useRef(false);

  function onMouseDown() {
    if (current_class) {
      selectedImage_ID.current = null;
      if (!action) {
        toast.error("Select type of bounding box");
        return;
      }
      const stage = stageRef.current;
      const { x, y } = stage.getPointerPosition();
      selectedImage_ID.current = Math.random(); // random id
      isPainting.current = true;
      set_allAnnotations((prevAnnotations) =>
        prevAnnotations.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                annotations: [
                  ...entry.annotations,
                  {
                    class_id: selectedImage_ID.current,
                    class_name: "",
                    x,
                    y,
                    width: 0,
                    height: 0,
                    Color: current_class.color,
                    edit: false,
                  },
                ],
              }
            : entry
        )
      );
    } else {
      toast.error("Please Select Class First");
    }
  }

  function onMouseMove() {
    if (!action || !isPainting.current) return;
    moved.current = true;
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations.map((annotation) =>
                annotation.class_id === selectedImage_ID.current
                  ? {
                      ...annotation,
                      width: x - annotation.x,
                      height: y - annotation.y,
                    }
                  : annotation
              ),
            }
          : entry
      )
    );
  }

  function onPointerUp() {
    if (moved.current) {
      {
        set_allAnnotations((prevAnnotations) =>
          prevAnnotations.map((entry) =>
            entry.image_id === current
              ? {
                  ...entry,
                  annotations: entry.annotations.map((annotation) =>
                    annotation.class_id === selectedImage_ID.current
                      ? {
                          ...annotation,
                          class_name: current_class.class_label,
                          edit: true,
                        }
                      : annotation
                  ),
                }
              : entry
          )
        );
      }
    }

    isPainting.current = false;
    moved.current = false;
  }

  function handleDelete(class_id) {
    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations.filter(
                (annotation) => annotation.class_id !== class_id
              ),
            }
          : entry
      )
    );
  }

  return (
    <>
      {images[current] && (
        <Stage
          ref={stageRef}
          width={images[current].width}
          height={images[current].height}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onPointerUp}
          className="border-2 bg-red-500 overflow-hidden"
          style={{ width: images[current].width }}
        >
          <Layer>
            <Konvaimage image={images[current]} />
            {currentImage?.annotations.map((annotation) => (
              <Group
                key={annotation.class_id}
                onMouseEnter={() => setHoveredId(annotation.class_id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Rect
                  x={annotation.x}
                  y={annotation.y}
                  strokeWidth={2}
                  height={annotation.height}
                  width={annotation.width}
                  stroke={annotation.Color}
                />

                {hoveredId === annotation.class_id && annotation.edit && (
                  <>
                    <Text
                      x={annotation.x + 5}
                      y={annotation.y + 20}
                      text="Delete"
                      fontSize={15}
                      fill="red"
                      onClick={() => handleDelete(annotation.class_id)}
                    />
                  </>
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
      )}
    </>
  );
}

export default Stages;
