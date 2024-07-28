import React, { useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import Konvaimage from "../image/Konvaimage";
import toast from "react-hot-toast";

function Stages({ imageSrc, Color, action }) {
  const stageRef = useRef();

  const [rectangles, setRectangles] = useState([]);
  const selectedImage_ID = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const isPainting = useRef(false);
  const moved = useRef(false);

  function onMouseDown() {
    selectedImage_ID.current = null;
    if (!action) {
      toast.error("select type of bounding box");
    }
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    selectedImage_ID.current = Math.random(); //random id
    isPainting.current = true;
    setRectangles((prevRectangles) => [
      ...prevRectangles,
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
    ]);
  }

  function onMouseMove() {
    if (!action || !isPainting.current) return;
    moved.current = true;
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    setRectangles((prevRectangles) =>
      prevRectangles.map((rectangle) => {
        if (rectangle.id === selectedImage_ID.current) {
          return {
            ...rectangle,
            width: x - rectangle.x,
            height: y - rectangle.y,
          };
        }
        return rectangle;
      })
    );
  }

  function onPointerUp() {
    if (moved.current) {
      const annotation = prompt("Enter annotation text:");
      if (annotation !== null) {
        setRectangles((prevRectangles) =>
          prevRectangles.map((rectangle) => {
            console.log("Before", selectedImage_ID.current);
            if (rectangle.id === selectedImage_ID.current) {
              return {
                ...rectangle,
                annotation: annotation,
                edit: true,
              };
            }
            return rectangle;
          })
        );
      }
    }

    isPainting.current = false;
    moved.current = false;
    console.log("Current ID after annotation:", selectedImage_ID.current);
    //selectedImage_ID.current = null;    ---it was causing unknown issue therefore i made it null in onMouseDown----
  }

  function handleEdit(id) {
    const annotation = prompt("Edit ");
    if (annotation !== null) {
      setRectangles((prevRectangles) =>
        prevRectangles.map((rectangle) =>
          rectangle.id === id ? { ...rectangle, annotation } : rectangle
        )
      );
    }
  }

  function handleDelete(id) {
    setRectangles((prevRectangles) =>
      prevRectangles.filter((rectangle) => rectangle.id !== id)
    );
  }
  return (
    <>
      {imageSrc && (
        <Stage
          ref={stageRef}
          width={imageSrc.width}
          height={imageSrc.height}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onPointerUp}
          className="border-2 bg-red-500 overflow-hidden"
          style={{ width: imageSrc.width }}
        >
          <Layer>
            <Konvaimage image={imageSrc} />
            {rectangles.map((rectangle) => {
              console.log(rectangle);
              return (
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
                        f
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
              );
            })}
          </Layer>
        </Stage>
      )}
    </>
  );
}

export default Stages;
