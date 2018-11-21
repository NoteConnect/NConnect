import intersect from "gintersect";
import { IMakeDragableNodeOption } from "./interfaces";

export function intersectRect(
  left: number,
  top: number,
  right: number,
  bottom: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return (
    intersect(left, top, left, bottom, x1, y1, x2, y2) ||
    intersect(left, bottom, right, bottom, x1, y1, x2, y2) ||
    intersect(right, bottom, right, top, x1, y1, x2, y2) ||
    intersect(right, top, left, top, x1, y1, x2, y2)
  );
}

export function getElementPosition(element: HTMLElement) {
  const x = element.offsetLeft + element.clientWidth * 0.5;
  const y = element.offsetTop + element.clientHeight * 0.5;
  return { x, y };
}

export function makeDragableDiv(
  element: HTMLElement,
  option: IMakeDragableNodeOption
) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;
  element.onmousedown = dragMouseDown;
  function dragMouseDown(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
    const hasOnDrag = option && typeof option.onDrag === "function";
    if (hasOnDrag) {
      option.onDrag(element);
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
