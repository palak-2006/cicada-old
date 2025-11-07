import { useRef, useState, useEffect } from "react";

const InteractiveClock = () => {
  const [smallHandAngle, setSmallHandAngle] = useState(180); // inner (short)
  const [bigHandAngle, setBigHandAngle] = useState(180); // outer (long)
  const [draggingSmall, setDraggingSmall] = useState(false);
  const [draggingBig, setDraggingBig] = useState(false);
  const clockRef = useRef(null);

  const innerCircularText =
    "independentlyransomwarerossetuprosbasedapplicationpubdemonodescppnoderun";
  const outerCircularText =
    "robotoverfittingbaselinksynapsenetcameralinkpythonoperationgsystemtransformbackpropagationreasonsandsolution";

  // Get angle from mouse position
  const getAngleFromEvent = (e) => {
    if (!clockRef.current) return 0;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handleMouseDown = (hand) => (e) => {
    e.preventDefault();
    if (hand === "small") setDraggingSmall(true);
    else setDraggingBig(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingSmall) setSmallHandAngle(getAngleFromEvent(e));
      if (draggingBig) setBigHandAngle(getAngleFromEvent(e));
    };
    const handleMouseUp = () => {
      setDraggingSmall(false);
      setDraggingBig(false);
    };

    if (draggingSmall || draggingBig) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingSmall, draggingBig]);

  return (
    <div className="relative w-full max-w-md aspect-square flex items-center justify-center bg-black">
      <svg
        ref={clockRef}
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{
          cursor: draggingSmall || draggingBig ? "grabbing" : "default",
        }}
      >
        {/* Outer Circle */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="black"
          stroke="#22c55e"
          strokeWidth="1.5"
        />

        {/* Text Paths */}
        <defs>
          <path
            id="outerCircle"
            d="M 200,200 m -170,0 a 170,170 0 1,1 340,0 a 170,170 0 1,1 -340,0"
          />
          <path
            id="innerCircle"
            d="M 200,200 m -130,0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0"
          />

          {/* Big Hand Arrowhead */}
          <marker
            id="arrowheadBig"
            markerWidth="10"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
            fill="#000000ff"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>

          {/* Small Hand Arrowhead (smaller) */}
          <marker
            id="arrowheadSmall"
            markerWidth="6"
            markerHeight="5"
            refX="3"
            refY="2.5"
            orient="auto"
            fill="#000000ff"
          >
            <polygon points="0 0, 6 2.5, 0 5" />
          </marker>
        </defs>

        {/* Circular Texts */}
        <text
          fill="#ffffff"
          fontSize="13"
          fontFamily="monospace"
          letterSpacing="2"
        >
          <textPath href="#outerCircle" startOffset="0%">
            {outerCircularText}
          </textPath>
        </text>

        <text
          fill="#ffffff"
          fontSize="13"
          fontFamily="monospace"
          letterSpacing="2"
        >
          <textPath href="#innerCircle" startOffset="0%">
            {innerCircularText}
          </textPath>
        </text>

        {/* Center Dot */}
        <circle cx="200" cy="200" r="8" fill="#1e90ff" />

        {/* 🕒 Small Hand (inner, short, thick, green, smaller arrow) */}
        <line
          x1="200"
          y1="200"
          x2={200 + Math.cos((smallHandAngle - 90) * (Math.PI / 180)) * 100}
          y2={200 + Math.sin((smallHandAngle - 90) * (Math.PI / 180)) * 100}
          stroke="#22c55e"
          strokeWidth="8"
          strokeLinecap="round"
          markerEnd="url(#arrowheadSmall)"
          onMouseDown={handleMouseDown("small")}
          style={{ cursor: "grab",
            filter: "drop-shadow(0 0 8px #22c55e)",
           }}
        />

        {/* 🕓 Big Hand (outer, long, thin, blue) */}
        <line
          x1="200"
          y1="200"
          x2={200 + Math.cos((bigHandAngle - 90) * (Math.PI / 180)) * 140}
          y2={200 + Math.sin((bigHandAngle - 90) * (Math.PI / 180)) * 140}
          stroke="#00b4ff"
          strokeWidth="5"
          strokeLinecap="round"
          markerEnd="url(#arrowheadBig)"
          onMouseDown={handleMouseDown("big")}
          style={{
            cursor: "grab",
            filter: "drop-shadow(0 0 8px #00b4ff)",
          }}
        />
      </svg>
    </div>
  );
};

export default InteractiveClock;
