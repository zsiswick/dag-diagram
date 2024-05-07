import { Vertex, Workflow, drawVertex, drawEdge } from "./utils";

const runWorkflow = async (workflow: Workflow) => {
  const visited = new Set();

  const traverse = async (vertex: Vertex | undefined) => {
    if (vertex && !visited.has(vertex.id)) {
      visited.add(vertex.id);
      await drawVertex(vertex);

      const edgePromises = vertex.edges.map(
        async (edge: { target: string; time: number }) => {
          await new Promise((resolve) => setTimeout(resolve, edge.time * 1000));
          await drawEdge(vertex, edge, workflow);
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
  // Notify in the document when diagram is done animating
  const headerSection = document.getElementById("header");
  if (headerSection) {
    const text = document.createElement("p");
    const textContent = document.createTextNode("Done");
    text.appendChild(textContent);
    headerSection.appendChild(text);
  }
});

export default runWorkflow;
