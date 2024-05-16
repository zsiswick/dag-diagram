const vertexFadeTime = 500;
const vertexRadius = 20;
const svgNamespace = "http://www.w3.org/2000/svg";

export const setAttributes = (
  el: unknown,
  attrs: { [key: string]: string }
) => {
  for (var key in attrs) {
    (el as HTMLElement).setAttribute(key, attrs[key]);
  }
};

export const fadeInElement = (time: number, el: unknown): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      (el as HTMLElement).style.opacity = "1";
      resolve();
    }, time);
  });
};

export interface Workflow {
  readonly vertices: Vertex[];
}

export interface Vertex {
  readonly id: string;
  readonly start?: boolean;
  readonly edges: { target: string; time: number }[];
  readonly x: number;
  readonly y: number;
}

export const drawVertex = async (vertex: Vertex): Promise<void> => {
  const canvas = document.getElementById("canvas");
  if (canvas) {
    // Create svg elements
    const group = document.createElementNS(svgNamespace, "g");
    group.setAttribute("id", vertex.id);

    const circle = document.createElementNS(svgNamespace, "circle");
    setAttributes(circle, {
      id: vertex.id,
      cx: `${vertex.x}`,
      cy: `${vertex.y}`,
      r: `${vertexRadius}`,
    });

    const text = document.createElementNS(svgNamespace, "text");
    setAttributes(text, {
      x: `${vertex.x}`,
      y: `${vertex.y}`,
      "text-anchor": "middle",
      dy: ".3em",
    });

    const textContent = document.createTextNode(vertex.id);

    // Append elements
    text.appendChild(textContent);
    group.appendChild(circle);
    group.appendChild(text);
    canvas.appendChild(group);

    await fadeInElement(vertexFadeTime, group);
  }
};

export const drawEdge = async (
  vertex: Vertex,
  edge: {
    target: string;
    time: number;
  },
  workflow: Workflow
): Promise<void> => {
  const group = document.getElementById(vertex.id);
  const targetVertex = workflow.vertices.find((v) => v.id === edge.target);
  if (group && targetVertex) {
    const line = document.createElementNS(svgNamespace, "line");
    setAttributes(line, {
      x1: `${vertex.x}`,
      y1: `${vertex.y}`,
      x2: `${targetVertex.x}`,
      y2: `${targetVertex.y}`,
    });
    group.prepend(line); // Arrange in DOM behind vertex

    await fadeInElement(10, line);
  }
};

export const drawDoneMessage = () => {
  const headerSection = document.getElementById("header");
  if (headerSection) {
    const text = document.createElement("p");
    const textContent = document.createTextNode("Done");
    text.appendChild(textContent);
    headerSection.appendChild(text);
  }
};

export const scaleSvg = () => {
  const svg = document.getElementById("workflowSVG");
  if (svg) {
    svg.setAttribute("width", `${window.innerWidth - 100}`);
    svg.setAttribute("height", `${window.innerHeight - 100}`);
  }
};
