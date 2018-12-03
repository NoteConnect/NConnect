import svg from "simplesvg";
import {
  INConnectMethods,
  INConnectOptions,
  IRegisterNodesOption
} from "./interfaces";
import { connectElements, makeLinkFollow } from "./link";
import Link from "./models/link";
import { dragScrollViewer, makeDragableDiv } from "./util";

export default class NConnect implements INConnectMethods {
  private root: HTMLDivElement;
  private nodes: Map<string, HTMLDivElement> = new Map();
  private links: Map<string, Link> = new Map();
  private linkRenderer: (link: Link, linkData: string) => SVGPathElement;
  private onLinkCreatedHandler: (link: Link) => void;
  private svg: any;

  constructor(root: HTMLDivElement, option: INConnectOptions) {
    this.root = root;
    this.svg = svg;
    if (option) {
      if (option.dragScrollViewer && typeof option.onScroll === "function") {
        dragScrollViewer(this.root, {
          onDrag: option.onScroll
        });
      } else if (option.dragScrollViewer) {
        dragScrollViewer(this.root);
      }
    }
  }

  /**
   * Register all nodes
   * @param selector DOM Selector for the nodes to register
   * @param option Option for registering nodes
   */
  public registerNodes(selector: string, option: IRegisterNodesOption) {
    const nodes = this.root.querySelectorAll(selector);
    const numberOfNodes = nodes.length;
    const hasExclude = option && typeof option.exclude === "function";
    const hasDragable = option && typeof option.dragable === "function";
    const hasOnChange = option && typeof option.onChange === "function";
    for (let i = 0; i < numberOfNodes; i++) {
      const node = nodes[i] as HTMLDivElement;
      if (!node.dataset.nodeId) {
        throw new Error(
          "[NConnect] You should provide id to each node using attribute data-node-id"
        );
      }
      if (hasExclude) {
        if (option.exclude(node)) {
          continue;
        }
      }
      if (hasDragable) {
        if (option.dragable(node)) {
          makeDragableDiv(node, {
            onDrag: () => {
              if (!node.dataset.nodeId) {
                throw new Error(
                  "[NConnect] You should provide id to each node using attribute data-node-id"
                );
              }
              makeLinkFollow.call(this, node.dataset.nodeId);
              if (hasOnChange) {
                option.onChange();
              }
            }
          });
        }
      }
      this.nodes.set(node.dataset.nodeId, node);
    }
  }

  /**
   * Add a link between 2 nodes
   * @param fromId ID of the first node
   * @param toId ID of the second node
   * @param data Data for the link
   */
  public addLink(fromId: string, toId: string, data: any): Link {
    const link = new Link(fromId, toId, data);
    const node1 = this.nodes.get(fromId);
    const node2 = this.nodes.get(toId);
    if (!node1) {
      throw new Error(`[NConnect] Node with id ${fromId} is not found`);
    }
    if (!node2) {
      throw new Error(`[NConnect] Node with id ${toId} is not found`);
    }
    connectElements({
      link,
      elementFrom: node1,
      elementTo: node2,
      linkRenderer: this.linkRenderer,
      root: this.root
    });
    this.links.set(link.id, link);
    this.onLinkCreatedHandler(link);
    return link;
  }

  /**
   * Add link renderer to handle custom link render
   * @param callback a link renderer to handle custom link render
   */
  public renderLink(
    callback: (link: Link, linkData: string) => SVGPathElement
  ) {
    this.linkRenderer = callback;
  }

  /**
   * loop through each linked node with a specific node
   * @param nodeId id of the node
   * @param callback connected node alongside its' link to the specified node
   */
  public forEachLinkedNode(
    nodeId: string,
    callback: (node: HTMLElement, link: Link) => void
  ) {
    this.links.forEach((link) => {
      let element = null;
      if (link.from === nodeId) {
        element = this.nodes.get(link.to);
      } else if (link.to === nodeId) {
        element = this.nodes.get(link.from);
      }
      if (element) {
        callback(element, link);
      }
    });
  }

  /**
   * Loop through each link in list
   * @param callback callback for each link
   */
  public forEachLink(callback: (link: Link) => void) {
    this.links.forEach((link) => callback(link));
  }

  /**
   * Loop through each node in list
   * @param callback callback for each node
   */
  public forEachNode(callback: (node: HTMLElement) => void) {
    this.nodes.forEach((node) => callback(node));
  }

  /**
   * Make link follow a node when it changed (resize or move, etc)
   * @param nodeId NoteID to follow
   */
  public makeLinkFollow(nodeId: string) {
    makeLinkFollow.call(this, nodeId);
  }

  /**
   * Pin node which will stop node from moving
   * @param nodeId NoteID to pin
   */
  public pinNode(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`[NConnect] Node with id ${nodeId} is not found`);
    }
    node.dataset.pinned = "true";
  }

  /**
   * Un-pin node, opposite of pin node
   * @param nodeId NoteID to un-pin
   */
  public unPinNode(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`[NConnect] Node with id ${nodeId} is not found`);
    }
    node.dataset.pinned = "false";
  }

  public onLinkCreated(callback: (link: Link) => void) {
    this.onLinkCreatedHandler = callback;
  }
}
