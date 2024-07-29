import React, { useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import Konvaimage from "../image/Konvaimage";
import toast from "react-hot-toast";

function Stages({ images, Color, action, current }) {
  const stageRef = useRef();
  const [rectangles, setRectangles] = useState(
    images.map((image, index) => ({
      image_id: index,
      rectangles: [],
    }))
  ); //all data for each annotations for each image

  const currentImage = rectangles.find((image) => image.image_id === current); //current image's annotation

  const selectedImage_ID = useRef(null); //id for rectangle not image
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
    setRectangles((prevRectangles) =>
      prevRectangles.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              rectangles: [
                ...entry.rectangles,
                {
                  id: selectedImage_ID.current,
                  x,
                  y,
                  width: 0,
                  height: 0,
                  Color,
                  annotation: "",
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
    setRectangles((prevRectangles) =>
      prevRectangles.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              rectangles: entry.rectangles.map((rectangle) =>
                rectangle.id === selectedImage_ID.current
                  ? {
                      ...rectangle,
                      width: x - rectangle.x,
                      height: y - rectangle.y,
                    }
                  : rectangle
              ),
            }
          : entry
      )
    );
  }

  function onPointerUp() {
    if (moved.current) {
      const annotation = prompt("Enter annotation text:");
      if (annotation !== null) {
        setRectangles((prevRectangles) =>
          prevRectangles.map((entry) =>
            entry.image_id === current
              ? {
                  ...entry,
                  rectangles: entry.rectangles.map((rectangle) =>
                    rectangle.id === selectedImage_ID.current
                      ? {
                          ...rectangle,
                          annotation: annotation,
                          edit: true,
                        }
                      : rectangle
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

  function handleEdit(id) {
    const annotation = prompt("Edit annotation:");
    if (annotation !== null) {
      setRectangles((prevRectangles) =>
        prevRectangles.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                rectangles: entry.rectangles.map((rectangle) =>
                  rectangle.id === id ? { ...rectangle, annotation } : rectangle
                ),
              }
            : entry
        )
      );
    }
  }

  function handleDelete(id) {
    setRectangles((prevRectangles) =>
      prevRectangles.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              rectangles: entry.rectangles.filter(
                (rectangle) => rectangle.id !== id
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
            {currentImage.rectangles.map((rectangle) => (
              <Group
                key={rectangle.id}
                onMouseEnter={() => setHoveredId(rectangle.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Rect
                  x={rectangle.x}
                  y={rectangle.y}
                  strokeWidth={2}
                  height={rectangle.height}
                  width={rectangle.width}
                  stroke={rectangle.Color}
                />
                {rectangle.annotation && (
                  <Text
                    x={rectangle.x}
                    y={rectangle.y - 20}
                    text={rectangle.annotation}
                    fontSize={16}
                    fill={rectangle.Color}
                  />
                )}
                {hoveredId === rectangle.id && rectangle.edit && (
                  <>
                    <Text
                      x={rectangle.x}
                      y={rectangle.y + 20}
                      text="Edit"
                      fontSize={15}
                      fill="blue"
                      onClick={() => handleEdit(rectangle.id)}
                    />
                    <Text
                      x={rectangle.x + 30}
                      y={rectangle.y + 20}
                      text="Delete"
                      fontSize={15}
                      fill="red"
                      onClick={() => handleDelete(rectangle.id)}
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
