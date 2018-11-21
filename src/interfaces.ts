import Link from "./models/link";

export interface IRegisterNodesOption {
  exclude(node: HTMLDivElement): boolean;
  dragable(node: HTMLDivElement): boolean;
}

export interface INConnectMethods {
  registerNodes(selector: string, option: IRegisterNodesOption): void;
  addLink(fromId: string, toId: string, data: any): void;
}

export interface IConnectElementOtion {
  link: Link;
  elementFrom: HTMLDivElement;
  elementTo: HTMLDivElement;
  linkRenderer: (link: Link) => SVGPathElement;
  root: HTMLDivElement;
}

export interface ILinkUI {
  svg: SVGElement;
  path: SVGPathElement;
}

export interface IMakeDragableNodeOption {
  onDrag(node: HTMLElement): void;
}
