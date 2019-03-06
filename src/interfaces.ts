import Link from "./models/link";

export interface IRegisterNodesOption {
  constraintNegative: boolean;
  exclude(node: HTMLDivElement): boolean;
  dragable(node: HTMLDivElement): boolean;
  onChange(node: HTMLDivElement): void;
}

export interface INConnectMethods {
  renderLink: (
    callback: (link: Link, linkData: string) => SVGPathElement
  ) => void;
  onLinkCreated(callback: (link: Link) => void): void;
  registerNodes(selector: string, option: IRegisterNodesOption): void;
  addLink(fromId: string, toId: string, data: any): void;
  forEachLinkedNode(
    nodeId: string,
    callback: (node: HTMLElement, link: Link) => void
  ): void;
  forEachLink(callback: (link: Link) => void): void;
  forEachNode(callback: (node: HTMLElement) => void): void;
  makeLinkFollow(nodeId: string): void;
  pinNode(nodeId: string): void;
  unPinNode(nodeId: string): void;
}

export interface INConnectOptions {
  dragScrollViewer: boolean;
  dragScrollViewerWithRightMouse: boolean;
  onScroll(x: number, y: number): void;
}

export interface IConnectElementOtion {
  link: Link;
  elementFrom: HTMLDivElement;
  elementTo: HTMLDivElement;
  linkRenderer: (link: Link, linkData: string) => SVGPathElement;
  root: HTMLDivElement;
}

export interface ILinkUI {
  svg: SVGElement;
  path: SVGPathElement;
  arrow?: SVGMarkerElement;
}

export interface IMakeDragableNodeOption {
  constraintNegative: boolean;
  onDrag(node: HTMLElement): void;
}
