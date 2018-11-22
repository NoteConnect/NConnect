import { INConnectMethods, IRegisterNodesOption } from "./interfaces";
import { connectElements, makeLinkFollow } from "./link";
import Link from "./models/link";
import { makeDragableDiv } from "./util";

export default class NConnect implements INConnectMethods {
  private root: HTMLDivElement;
  private nodes: Map<string, HTMLDivElement> = new Map();
  private links: Map<string, Link> = new Map();
  private linkRenderer: (link: Link) => SVGPathElement;

  constructor(root: HTMLDivElement) {
    this.root = root;
  }

  /**
   * Register all nodes
   * @param selector DOM Selector for the nodes to register
   * @param option Option for registering nodes
   */
  public registerNodes(selector: string, option: IRegisterNodesOption): void {
    const nodes = this.root.querySelectorAll(selector);
    const numberOfNodes = nodes.length;
    const hasExclude = option && typeof option.exclude === "function";
    const hasDragable = option && typeof option.dragable === "function";
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
  public addLink(fromId: string, toId: string, data: any): void {
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
        element = this.nodes.get(link.from);
      } else if (link.to === nodeId) {
        element = this.nodes.get(link.to);
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
}
