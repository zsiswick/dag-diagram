import { setAttributes, fadeInElement } from "./utils";

interface Vertex {
  readonly id: string;
  readonly start?: boolean;
  readonly edges: { target: string; time: number }[];
  readonly x: number;
  readonly y: number;
}

const vertexFadeTime = 500;
const vertexRadius = 20;

const drawVertex = async (vertex: Vertex): Promise<void> => {
  const canvas = document.getElementById("canvas");
  if (canvas) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const textContent = document.createTextNode(vertex.id);
    group.setAttribute("id", vertex.id);
    setAttributes(circle, {
      cx: `${vertex.x}`,
      cy: `${vertex.y}`,
      r: `${vertexRadius}`,
    });
    setAttributes(text, {
      x: `${vertex.x}`,
      y: `${vertex.y}`,
      "text-anchor": "middle",
      dy: ".3em",
    });
    text.appendChild(textContent);
    group.appendChild(circle);
    group.appendChild(text);
    canvas.appendChild(group);

    // Fade in vertex
    await fadeInElement(vertexFadeTime, group);
  }
};

const drawEdge = async (
  vertex: Vertex,
  edge: {
    target: string;
    time: number;
  }
): Promise<void> => {
  const group = document.getElementById(vertex.id);
  if (group) {
    const targetVertex = workflow.vertices.find((v) => v.id === edge.target);
    if (targetVertex) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      setAttributes(line, {
        x1: `${vertex.x}`,
        y1: `${vertex.y}`,
        x2: `${targetVertex.x}`,
        y2: `${targetVertex.y}`,
      });
      group.prepend(line);

      // Fade in after vertex fade animation is complete
      await fadeInElement(10, line);
    }
  }
};

export const runWorkflow = async (workflow: { vertices: Vertex[] }) => {
  const visited = new Set();

  const traverse = async (vertex: Vertex | undefined) => {
    if (vertex && !visited.has(vertex.id)) {
      visited.add(vertex.id);
      await drawVertex(vertex);

      const edgePromises = vertex.edges.map(
        async (edge: { target: string; time: number }) => {
          await new Promise((resolve) => setTimeout(resolve, edge.time * 1000));
          await drawEdge(vertex, edge);
          await traverse(workflow.vertices.find((v) => v.id === edge.target));
        }
      );

      await Promise.all(edgePromises);
    }
  };

  const startVertex = workflow.vertices.find((v) => v.start);
  if (!startVertex) {
    console.error("No start vertex specified.");
    return;
  }

  await traverse(startVertex);
};

// Scale the svg to size of window
const svg = document.getElementById("workflowSVG");
if (svg) {
  svg.setAttribute("width", `${window.innerWidth - 100}`);
  svg.setAttribute("height", `${window.innerHeight - 100}`);
}

// Example DAG workflow
const workflow = {
  vertices: [
    {
      id: "A",
      start: true,
      edges: [
        { target: "B", time: 3 },
        { target: "C", time: 5 },
      ],
      x: 100,
      y: 50,
    },
    { id: "B", edges: [{ target: "D", time: 3 }], x: 100, y: 100 },
    { id: "C", edges: [{ target: "D", time: 2 }], x: 150, y: 100 },
    { id: "D", edges: [], x: 100, y: 150 },
  ],
};

runWorkflow(workflow).then(() => {
  // Notify when diagram is done
  const headerSection = document.getElementById("header");
  if (headerSection) {
    const text = document.createElement("p");
    const textContent = document.createTextNode("Done");
    text.appendChild(textContent);
    headerSection.appendChild(text);
  }
});
