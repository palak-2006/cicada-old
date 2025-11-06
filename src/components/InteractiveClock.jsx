import { useRef, useState, useEffect } from "react";

const InteractiveClock = () => {
  const [hourAngle, setHourAngle] = useState(180);
  const [minuteAngle, setMinuteAngle] = useState(90);
  const [isDraggingHour, setIsDraggingHour] = useState(false);
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);
  const clockRef = useRef(null);

  const circularText = "robotoverwritingbaselinksynapsenetcamerainkpythonoperationbusystemsransomwarerosetupiobsassemblerappdepegatationpubandonubdemonodesperindependentlyransomwarerosetupiobsassembl";

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
    if (hand === "hour") {
      setIsDraggingHour(true);
    } else {
      setIsDraggingMinute(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingHour) {
        setHourAngle(getAngleFromEvent(e));
      } else if (isDraggingMinute) {
        setMinuteAngle(getAngleFromEvent(e));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingHour(false);
      setIsDraggingMinute(false);
    };

    if (isDraggingHour || isDraggingMinute) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingHour, isDraggingMinute]);

  return (
    <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
      <svg
        ref={clockRef}
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ cursor: isDraggingHour || isDraggingMinute ? "grabbing" : "default" }}
      >
        {/* Clock Circle Background */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="#000000"
          stroke="#22c55e"
          strokeWidth="2"
        />

        {/* Circular Text */}
        <defs>
          <path
            id="circlePath"
            d="M 200, 200 m -160, 0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0"
          />
        </defs>
        <text className="text-xs font-mono" fill="#22c55e">
          <textPath href="#circlePath" startOffset="0%">
            {circularText}
          </textPath>
        </text>

        {/* Center Dot */}
        <circle cx="200" cy="200" r="8" fill="#22c55e" />

        {/* Hour Hand (shorter, thicker) */}
        <line
          x1="200"
          y1="200"
          x2={200 + Math.cos((hourAngle - 90) * (Math.PI / 180)) * 80}
          y2={200 + Math.sin((hourAngle - 90) * (Math.PI / 180)) * 80}
          stroke="#22c55e"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ cursor: "grab" }}
          onMouseDown={handleMouseDown("hour")}
        />
        
        {/* Hour Hand Tip (draggable area) */}
        <circle
          cx={200 + Math.cos((hourAngle - 90) * (Math.PI / 180)) * 80}
          cy={200 + Math.sin((hourAngle - 90) * (Math.PI / 180)) * 80}
          r="12"
          fill="#22c55e"
          style={{ cursor: "grab" }}
          onMouseDown={handleMouseDown("hour")}
        />

        {/* Minute Hand (longer, thinner) */}
        <line
          x1="200"
          y1="200"
          x2={200 + Math.cos((minuteAngle - 90) * (Math.PI / 180)) * 130}
          y2={200 + Math.sin((minuteAngle - 90) * (Math.PI / 180)) * 130}
          stroke="#22c55e"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ cursor: "grab" }}
          onMouseDown={handleMouseDown("minute")}
        />
        
        {/* Minute Hand Tip (draggable area) */}
        <circle
          cx={200 + Math.cos((minuteAngle - 90) * (Math.PI / 180)) * 130}
          cy={200 + Math.sin((minuteAngle - 90) * (Math.PI / 180)) * 130}
          r="10"
          fill="#22c55e"
          style={{ cursor: "grab" }}
          onMouseDown={handleMouseDown("minute")}
        />
      </svg>
    </div>
  );
};

export default InteractiveClock;
