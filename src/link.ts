import svg from "simplesvg";
import { IConnectElementOtion } from "./interfaces";
import { createArrowMarker } from "./marker";
import Link from "./models/link";
import { getElementPosition, intersectRect } from "./util";

/**
 * Connect 2 DOM elements by generating UI for link
 */
export function connectElements({
  link,
  elementFrom,
  elementTo,
  linkRenderer,
  root
}: IConnectElementOtion) {
  const hasCustomLinkRenderer =
    linkRenderer && typeof linkRenderer === "function";
  const linkData: string = calculateLinkData(elementFrom, elementTo);
  const svgElement: SVGElement = svg("svg");

  const newpath = hasCustomLinkRenderer
    ? linkRenderer(link)
    : _defaultLinkRenderer(linkData);

  // default arrrow
  const marker = createArrowMarker();
  const defs = svg("defs");
  defs.appendChild(marker);
  svgElement.appendChild(defs);

  svgElement.appendChild(newpath);
  root.prepend(svgElement);
  const box = newpath.getBBox();
  _fitSVGwithBox(svgElement, box);
  link.ui = {
    svg: svgElement,
    path: newpath
  };
}

/**
 * Default link renderer
 * @param linkData Path data for link
 */
function _defaultLinkRenderer(linkData: string): SVGPathElement {
  return svg("path", {
    "d": linkData,
    "stroke": "black",
    "stroke-width": "3",
    "marker-end": "url(#Triangle)"
  });
}

/**
 * Resize svg element to fit link path DOMRect
 * @param svgElement SVG element containing link path
 * @param box DOMRect of link path
 */
function _fitSVGwithBox(svgElement: SVGElement, box: DOMRect) {
  svgElement
    // @ts-ignore
    .attr(
      "viewBox",
      `${box.x - 10} ${box.y - 10} ${box.width + 20} ${box.height + 20}`
    )
    .attr(
      "style",
      `width: ${box.width + 20}px; height: ${box.height + 20}px; top: ${box.y -
        10}px; left: ${box.x - 10}px; position: absolute;`
    );
}

/**
 * Make all links connected to this node to follow when it move
 * @param nodeId ID of registered DOM node
 */
export function makeLinkFollow(nodeId: string) {
  // `this` is NConnect class
  const links: Map<string, Link> = this.links;
  links.forEach((link) => {
    const partnerData =
      link.from === nodeId
        ? { id: link.to, direction: "to" }
        : link.to === nodeId
        ? { id: link.from, direction: "from" }
        : null;
    if (partnerData === null) {
      return;
    }
    const isToPartner = partnerData.direction === "to";
    const from = isToPartner
      ? this.nodes.get(nodeId)
      : this.nodes.get(partnerData.id);
    const to = isToPartner
      ? this.nodes.get(partnerData.id)
      : this.nodes.get(nodeId);
    const linkData = calculateLinkData(from, to);
    // @ts-ignore
    link.ui.path.attr("d", linkData);
    const box = link.ui.path.getBBox();
    _fitSVGwithBox(link.ui.svg, box);
  });
}

/**
 * Calculate SVG path data for connecting from DOM 1 to DOM 2
 * @param elementFrom DOM node 1
 * @param elementTo DOM node 2
 */
function calculateLinkData(
  elementFrom: HTMLDivElement,
  elementTo: HTMLDivElement
): string {
  const positionFrom = getElementPosition(elementFrom);
  const positionTo = getElementPosition(elementTo);

  const sizeFrom = {
    width: elementFrom.clientWidth,
    height: elementFrom.clientHeight
  };
  const sizeTo = {
    width: elementTo.clientWidth,
    height: elementTo.clientHeight
  };
  const centerSizeFrom = {
    width: sizeFrom.width / 2,
    height: sizeFrom.height / 2
  };
  const centerSizeTo = {
    width: sizeTo.width / 2,
    height: sizeTo.height / 2
  };
  let from = intersectRect(
    // rectangle:
    positionFrom.x - centerSizeFrom.width, // left
    positionFrom.y - centerSizeFrom.height, // top
    positionFrom.x + centerSizeFrom.width, // right
    positionFrom.y + centerSizeFrom.height, // bottom
    // segment:
    positionFrom.x,
    positionFrom.y,
    positionTo.x,
    positionTo.y
  );
  from = from || positionFrom;
  let to = intersectRect(
    // rectangle:
    positionTo.x - centerSizeTo.width, // left
    positionTo.y - centerSizeTo.height, // top
    positionTo.x + centerSizeTo.width, // right
    positionTo.y + centerSizeTo.height, // bottom
    // segment:
    positionTo.x,
    positionTo.y,
    positionFrom.x,
    positionFrom.y
  );
  to = to || positionTo;
  const linkData = `M${from.x},${from.y} L${(to.x + from.x) / 2},${(to.y +
    from.y) /
    2} L${to.x},${to.y}`;
  return linkData;
}
