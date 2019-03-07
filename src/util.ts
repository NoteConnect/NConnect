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

export function isCollide(element1: HTMLElement, element2: HTMLElement) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
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
    e.stopPropagation();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    if (element.dataset.pinned === "true") {
      return;
    }
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    let y = element.offsetTop - pos2;
    let x = element.offsetLeft - pos1;
    if (option && option.constraintNegative) {
      y = y < 0 ? 0 : y;
      x = x < 0 ? 0 : x;
    }
    element.style.top = y + "px";
    element.style.left = x + "px";
    const hasOnDrag = option && typeof option.onDrag === "function";
    if (hasOnDrag) {
      option.onDrag(element);
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    const hasOnDrop = option && typeof option.onDrop === "function";
    if (hasOnDrop) {
      option.onDrop(element);
    }
  }
}

export function dragScrollViewer(
  viewer: HTMLElement,
  option?: {
    useRightMouse?: boolean;
    onDrag?(x: number, y: number): void;
  }
) {
  let isDragging = false;
  let originalX: number = 0;
  let originalY: number = 0;
  viewer.addEventListener("mousedown", (e: MouseEvent) => {
    e.preventDefault();
    if (e.button === 2) {
      if (option && !option.useRightMouse) {
        return;
      }
    }
    isDragging = true;
    originalX = viewer.scrollLeft + e.pageX;
    originalY = viewer.scrollTop + e.pageY;
  });

  viewer.addEventListener("mouseup", () => {
    isDragging = false;
  });

  viewer.addEventListener("mousemove", (e: MouseEvent) => {
    e.preventDefault();
    if (isDragging) {
      const newX = originalX - e.pageX;
      const newY = originalY - e.pageY;
      viewer.scrollLeft = newX;
      viewer.scrollTop = newY;
      if (option && typeof option.onDrag === "function") {
        option.onDrag(newX, newY);
      }
    }
  });
}
