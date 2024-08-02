import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import Konvaimage from "../image/Konvaimage";
import toast from "react-hot-toast";
import useStore from "../../../Zustand/Alldata";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiZoomIn, FiZoomOut } from "react-icons/fi"; // Import icons
import { RxReset } from "react-icons/rx"; // Import icon

function Stages({ images, action, current }) {
  const stageRef = useRef();
  const [zoomEnabled, setZoomEnabled] = useState(true);

  const {
    all_annotations,
    set_allAnnotations,
    classes,
    class_label,
    openModal, // Access openModal function
  } = useStore();

  const [annotations, setAnnotations] = useState(all_annotations);
  const [pendingAnnotation, setPendingAnnotation] = useState(null);

  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);

  useEffect(() => {
    if (pendingAnnotation && class_label) {
      const current_class = classes.find(
        (classItem) => classItem.class_label === class_label
      );

      set_allAnnotations((prevAnnotations) =>
        prevAnnotations.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                annotations: entry.annotations.map((annotation) =>
                  annotation.class_id === pendingAnnotation.class_id
                    ? {
                        ...annotation,
                        class_name: current_class?.class_label || "",
                        Color: current_class?.color,
                        edit: true,
                      }
                    : annotation
                ),
              }
            : entry
        )
      );
      setPendingAnnotation(null); // Clear pending annotation
    }
  }, [class_label, pendingAnnotation, classes, current, set_allAnnotations]);

  const currentImage = annotations.find((image) => image.image_id === current);

  const selectedImage_ID = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const isPainting = useRef(false);
  const moved = useRef(false);

  function onMouseDown() {
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
                  Color: "black",
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
      const current_class = classes.find(
        (classItem) => classItem.class_label === class_label
      );

      set_allAnnotations((prevAnnotations) =>
        prevAnnotations.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                annotations: entry.annotations.map((annotation) =>
                  annotation.class_id === selectedImage_ID.current
                    ? {
                        ...annotation,
                        class_name: current_class?.class_label || "",
                        Color: current_class?.color,
                        edit: true,
                      }
                    : annotation
                ),
              }
            : entry
        )
      );

      if (!class_label) {
        openModal();
        setPendingAnnotation({
          class_id: selectedImage_ID.current,
        });
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

  useEffect(() => {
    // Update zoomEnabled based on the action
    setZoomEnabled(!action);
  }, [action]);

  return (
    <>
      {images[current] && (
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          wheel={{ disabled: !zoomEnabled }}
          panning={{ disabled: !zoomEnabled }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: 10,
                  marginRight: 30,
                }}
              >
                {zoomEnabled && (
                  <>
                    <button
                      onClick={() => zoomIn()}
                      style={{
                        marginBottom: 10,
                        padding: "5px 11px",
                        fontSize: "24px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <FiZoomIn />
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      style={{
                        marginBottom: 10,
                        padding: "5px 11px",
                        fontSize: "24px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <FiZoomOut />
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      style={{
                        padding: "5px 11px",
                        fontSize: "24px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <RxReset />
                    </button>
                  </>
                )}
              </div>
              <TransformComponent>
                <Stage
                  ref={stageRef}
                  width={800}
                  height={450}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onPointerUp}
                  className="overflow-hidden"
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
                        {hoveredId === annotation.class_id &&
                          annotation.edit && (
                            <>
                              <Text
                                x={annotation.x - 15}
                                y={annotation.y + 5}
                                text="Delete"
                                fontSize={16}
                                fill="red"
                                onClick={() =>
                                  handleDelete(annotation.class_id)
                                }
                              />
                            </>
                          )}
                      </Group>
                    ))}
                  </Layer>
                </Stage>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
    </>
  );
}

export default Stages;
