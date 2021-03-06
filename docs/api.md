# NConnect API

## class NConnect

NConnect is the main, only class for our api. All the avaiable methods are in this class.

### constructor(root, options)

Initialize an instance of NConnect.

- `root` <[HTMLElement]> The root element
- `options` <[Object]>
  - `dragScrollViewer`: <[Boolean]> Allow users to scroll the overflow part by dragging
  - `onScroll`: <[function](<[Number]>, <[Number]>)> A callback when the graph is scrolled
    - `x`: <[Number]> The scroll left
    - `y`: <[Number]> The scroll top
  - `useRightMouse`: <[Boolean]> Allow drag scroll viewer using right mouse click

### nconnect.root <[HTMLElement]>

The root element that NConnect is initialized on.

### nconnect.nodes <[Map]<[string], [HTMLDivElement]>>

The map containing the list of registered nodes.

- `key` <[string]> The id of the registered node.
- `value` <[HTMLDivElement]> The `div` associated with the registered node.

### nconnect.links <[Map]<[string], [Link]>>

- `key` <[string]> The id of the link.
- `value` <[Link]> The link that connect 2 nodes. **See**: [Link]

### nconnect.registerNodes(selector, options)

Register nodes to be used by the nconnect system.

> **Please note:** Every node being registered to the nconnect system must have an attribute: `data-node-id`. NConnect doesn't auto generate id for each node so you need to specify that attribute so that NConnect can use it.

- `selector` <[String]> A selector for nodes to be selected
- `options` <[Object]>
  - `exclude` <[function]([HTMLElement]):[void]> A function to be called using an argument:
    - `node` <[HTMLElement]> current node about to be registered
    - returns: <[Boolean]> Indicating a node should be registered or not
  - `dragable` <[function]([HTMLElement]):[void]> A function to be called using an argument:
    - `node` <[HTMLElement]> current node about to be registered
    - returns: <[Boolean]> Indicating a node can be dragable or not
  - `onChange`: <[function]([HTMLElement]):[void]> A function to be called when a node is dragged
  - `onNodeDrop`: <[function]([HTMLElement]):[void]> A function to be called when a node is stop dragged
  - `constraintNegative`: <[Boolean]> Prevent users from dragging node to negative coordinate

### nconnect.addLink(nodeId1, nodeId2, data)

Add a link between 2 nodes

- `nodeId1` <[String]> Id of the first node
- `nodeId2` <[String]> Id of the second node
- `data` Anything to use as data for the link (will be available under `data` property of each link)
- returns: <[Link]> The generated link

### nconnect.renderLink(callback)

Add a custom link renderer to handle custom link render

> **Please note:** At this stage, the link `ui` property will be undefined

- `callback` <[function]([Link], [String])>
  - `link` The current link between 2 nodes
  - `linkData` The data generated for link's path element
  - returns: <[SVGPathElement]> The custom svg path element for the link UI

### nconnect.forEachLinkedNode(nodeId, callback)

Loop through each node that linked with a specific node

- `nodeId` <[String]> Id of a node
- `callback` <[function]([HTMLElement], [Link])>
  - `node` <[HTMLElement]> The current node that linked to the specified node
  - `link` <[Link]> The link between those 2 nodes

### nconnect.forEachLink(callback)

Loop through each link in the graph

- `callback` <[function]([Link])> A function to be called on every loop with an argument:
  - `link` <[Link]> The link in the graph

### nconnect.forEachNode(callback)

Loop through each node in the graph

- `callback` <[function]([HTMLElement])> A function to be called on every loop with an argument:
  - `node` <[HTMLElement]> The DOM node registered in the graph

### nconnect.forEachCollidedNode(nodeId, callback)

Loop through each collided node with the specified node

- `nodeId` <[String]> The id of the node
- `callback` <[function]([HTMLElement], [String])> A function to be called on every loop with an argument:
  - `node` <[HTMLElement]> The DOM node collided with the specified node
  - `nodeId` <[String]> Id of the current collided node

### nconnect.makeLinkFollow(nodeId)

Re-calculate link position and make link follow a node when it appearance changed (moved or resized, etc)

- `nodeId` <[String]> The id of the node

### nconnect.pinNode(nodeId)

Pin a node a stop it from moving

- `nodeId` <[String]> The id of the node

### nconnect.unPinNode(nodeId)

Un-pin a node, opposite of `nconnect.pinNode`. Allow node to moving freely if it has been registered.

- `nodeId` <[String]> The id of the node

[htmldivelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Glossary/Function
[htmlelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[boolean]: https://developer.mozilla.org/en-US/docs/Glossary/Boolean
[link]: ./dataType.md#link
[svgpathelement]: https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement
[number]: https://developer.mozilla.org/en-US/docs/Glossary/Number
[mouseevent]: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
