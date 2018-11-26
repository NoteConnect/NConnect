import svg from "simplesvg";

export function createArrowMarker() {
  const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const marker = svg("marker", {
    id: `arrow_${hash}`,
    viewBox: "0 0 10 10",
    refX: "8",
    refY: "5",
    markerUnits: "strokeWidth",
    markerWidth: "10",
    markerHeight: "5",
    orient: "auto"
  });

  const path = svg("path", {
    d: "M 0 0 L 10 5 L 0 10 z",
    fill: "black"
  });

  marker.appendChild(path);
  return marker;
}
