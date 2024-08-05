import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text, Line } from "react-konva";
import Konvaimage from "../image/Konvaimage";
import toast from "react-hot-toast";
import useStore from "../../../Zustand/Alldata";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { RxReset } from "react-icons/rx";

function Stages({ images, action, current }) {
  const stageRef = useRef();
  const [zoomEnabled, setZoomEnabled] = useState(true);

  const {
    all_annotations,
    set_allAnnotations,
    classes,
    class_label,
    openModal,
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
      setPendingAnnotation(null);
    }
  }, [class_label, pendingAnnotation, classes, current, set_allAnnotations]);

  const currentImage = annotations.find((image) => image.image_id === current);

  const selectedImage_ID = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const isPainting = useRef(false);
  const moved = useRef(false);

  const [points, setPoints] = useState([]);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hoveredPolygonIndex, setHoveredPolygonIndex] = useState(null);
  const [hoveredTextIndex, setHoveredTextIndex] = useState(null);

  const getMousePos = (stage) => {
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      return [pointerPosition.x, pointerPosition.y];
    }
    return [0, 0];
  };

  const handleMouseDown = (event) => {
    if (!action) {
      toast.error("Select type of bounding box");
      return;
    }

    if (action === "rectangle") {
      onRectangleMouseDown();
    } else if (action === "polygon") {
      handleClick(event);
    }
  };

  const onRectangleMouseDown = () => {
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    selectedImage_ID.current = Math.random(); // random id
    isPainting.current = true;

    let newAnnotation = {
      class_id: selectedImage_ID.current,
      class_name: "",
      x,
      y,
      width: 0,
      height: 0,
      Color: "black",
      type: "rectangle",
      edit: false,
    };

    if (class_label) {
      const current_class = classes.find(
        (classItem) => classItem.class_label === class_label
      );
      newAnnotation.class_name = current_class?.class_label || "";
      newAnnotation.Color = current_class?.color || "black";
    }

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: [...entry.annotations, newAnnotation],
            }
          : entry
      )
    );
  };

  const handleClick = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (isFinished) {
      setPoints([]);
      setIsFinished(false);
      setIsMouseOverStartPoint(false);
      return;
    }

    // Check if mouse is over the start point and there are enough points
    if (isMouseOverStartPoint && points.length >= 2) {
      addPolygon(points);
      setPoints([]);
      setIsFinished(true);
      setIsMouseOverStartPoint(false);
    } else {
      setPoints((prevPoints) => [...prevPoints, mousePos]);
    }
  };

  const addPolygon = (points) => {
    const classId = Math.random(); // random id

    let newAnnotation = {
      class_id: classId,
      class_name: "",
      points,
      Color: "black",
      type: "polygon",
      edit: false,
    };

    if (class_label) {
      const current_class = classes.find(
        (classItem) => classItem.class_label === class_label
      );
      newAnnotation.class_name = current_class?.class_label || "";
      newAnnotation.Color = current_class?.color || "black";
    }

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: [...entry.annotations, newAnnotation],
            }
          : entry
      )
    );
  };

  const onMouseMove = (event) => {
    if (!action || !isPainting.current) return;

    if (action === "rectangle") {
      onRectangleMouseMove();
    } else if (action === "polygon") {
      handleMouseMove(event);
    }
  };

  const onRectangleMouseMove = () => {
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    moved.current = true;

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
  };

  const handleMouseMove = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    setCurMousePos(mousePos);
  };

  const onPointerUp = () => {
    if (action === "rectangle" && moved.current) {
      finalizeRectangle();
    }
    isPainting.current = false;
    moved.current = false;
  };

  const finalizeRectangle = () => {
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
  };

  const handleMouseOverStartPoint = (event) => {
    if (isFinished || points.length < 3) return;
    event.target.to({
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 0,
    });
    setIsMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = (event) => {
    event.target.to({
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 0.1,
    });
    setIsMouseOverStartPoint(false);
  };

  const calculateCentroid = (points) => {
    const numPoints = points.length;
    let centroidX = 0;
    let centroidY = 0;

    for (let i = 0; i < numPoints; i++) {
      centroidX += points[i][0];
      centroidY += points[i][1];
    }

    return [centroidX / numPoints, centroidY / numPoints];
  };

  const handleDelete = (class_id, type) => {
    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations.filter(
                (annotation) =>
                  annotation.class_id !== class_id || annotation.type !== type
              ),
            }
          : entry
      )
    );
  };

  useEffect(() => {
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
                  onMouseDown={handleMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onPointerUp}
                  className="overflow-hidden"
                >
                  <Layer>
                    <Konvaimage image={images[current]} />
                    {currentImage?.annotations.map((annotation, index) => {
                      if (annotation.type === "rectangle") {
                        return (
                          <Group
                            key={annotation.class_id}
                            onMouseEnter={() =>
                              setHoveredId(annotation.class_id)
                            }
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
                                  <Rect
                                    x={annotation.x - 20}
                                    y={annotation.y - 10}
                                    width={40}
                                    height={30}
                                    fill="transparent"
                                    onClick={() =>
                                      handleDelete(
                                        annotation.class_id,
                                        annotation.type
                                      )
                                    }
                                  />
                                  <Text
                                    x={annotation.x - 15}
                                    y={annotation.y + 5}
                                    text="Delete"
                                    fontSize={16}
                                    fill="red"
                                    onClick={() =>
                                      handleDelete(
                                        annotation.class_id,
                                        annotation.type
                                      )
                                    }
                                  />
                                  {/* Transparent clickable padding around delete button */}
                                </>
                              )}
                          </Group>
                        );
                      } else if (annotation.type === "polygon") {
                        const centroid = calculateCentroid(annotation.points);
                        return (
                          <React.Fragment key={annotation.class_id}>
                            <Line
                              points={annotation.points.reduce(
                                (a, b) => a.concat(b),
                                []
                              )}
                              stroke={annotation.Color}
                              strokeWidth={2}
                              closed
                              onMouseOver={() => setHoveredPolygonIndex(index)}
                              onMouseOut={() => {
                                if (hoveredTextIndex !== index) {
                                  setHoveredPolygonIndex(null);
                                }
                              }}
                            />
                            {hoveredPolygonIndex === index && (
                              <>
                                <Rect
                                  x={centroid[0] - 25}
                                  y={centroid[1] - 15}
                                  width={50}
                                  height={30}
                                  fill="transparent"
                                  onClick={() =>
                                    handleDelete(
                                      annotation.class_id,
                                      annotation.type
                                    )
                                  }
                                />
                                <Text
                                  x={centroid[0] - 20}
                                  y={centroid[1] - 10}
                                  text="Delete"
                                  fill="red"
                                  fontSize={16}
                                  onMouseOver={() => setHoveredTextIndex(index)}
                                  onMouseOut={() => setHoveredTextIndex(null)}
                                  onClick={() =>
                                    handleDelete(
                                      annotation.class_id,
                                      annotation.type
                                    )
                                  }
                                />
                              </>
                            )}
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                    {action === "polygon" && (
                      <Line
                        points={points.flat()} // Use points correctly for rendering the polygon
                        stroke="black"
                        strokeWidth={1}
                        closed={isFinished} // Close the polygon if finished
                      />
                    )}

                    {action === "polygon" &&
                      points.map((point, index) => {
                        const width = 6;
                        const x = point[0] - width / 2;
                        const y = point[1] - width / 2;
                        const isStartPoint = index === 0;
                        return (
                          <Rect
                            key={`current-${index}`}
                            x={x}
                            y={y}
                            width={width}
                            height={width}
                            fill={isStartPoint ? "gold" : "white"}
                            stroke={isStartPoint ? "gold" : "black"}
                            strokeWidth={1}
                            onMouseOver={
                              isStartPoint
                                ? handleMouseOverStartPoint
                                : undefined
                            }
                            onMouseOut={
                              isStartPoint
                                ? handleMouseOutStartPoint
                                : undefined
                            }
                          />
                        );
                      })}
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
