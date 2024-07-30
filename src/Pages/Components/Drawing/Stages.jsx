import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import Konvaimage from "../image/Konvaimage";
import toast from "react-hot-toast";
import useStore from "../../../Zustand/Alldata";

function Stages({ images, Color, action, current }) {
  const stageRef = useRef();

  const { all_annotations, set_allAnnotations } = useStore();

  // Ensure that `all_annotations` is always an array
  const [annotations, setAnnotations] = useState(all_annotations);

  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);

  const currentImage = annotations.find((image) => image.image_id === current);

  const selectedImage_ID = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const isPainting = useRef(false);
  const moved = useRef(false);

  function onMouseDown() {
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
                  Color,
                  edit: false,
                },
              ],
            }
          : entry
      )
    );
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
      const className = prompt("Enter class name:");
      if (className !== null && className !== "") {
        set_allAnnotations((prevAnnotations) =>
          prevAnnotations.map((entry) =>
            entry.image_id === current
              ? {
                  ...entry,
                  annotations: entry.annotations.map((annotation) =>
                    annotation.class_id === selectedImage_ID.current
                      ? {
                          ...annotation,
                          class_name: className,
                          edit: true,
                        }
                      : annotation
                  ),
                }
              : entry
          )
        );
      } else {
        handleDelete(selectedImage_ID.current);
      }
    }

    isPainting.current = false;
    moved.current = false;
  }

  function handleEdit(class_id) {
    const className = prompt("Edit class name:");
    if (className !== null) {
      set_allAnnotations((prevAnnotations) =>
        prevAnnotations.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                annotations: entry.annotations.map((annotation) =>
                  annotation.class_id === class_id
                    ? { ...annotation, class_name: className }
                    : annotation
                ),
              }
            : entry
        )
      );
    }
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
                {annotation.class_name && (
                  <Text
                    x={annotation.x}
                    y={annotation.y - 20}
                    text={annotation.class_name}
                    fontSize={16}
                    fill={annotation.Color}
                  />
                )}
                {hoveredId === annotation.class_id && annotation.edit && (
                  <>
                    <Text
                      x={annotation.x}
                      y={annotation.y + 20}
                      text="Edit"
                      fontSize={15}
                      fill="blue"
                      onClick={() => handleEdit(annotation.class_id)}
                    />
                    <Text
                      x={annotation.x + 30}
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
