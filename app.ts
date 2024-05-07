import {
  Vertex,
  Workflow,
  drawVertex,
  drawEdge,
  drawDoneMessage,
  scaleSvg,
} from "./utils";
import { dagWorkflow } from "./workflows";

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
          await traverse(workflow.vertices.find((v) => v.id === edge.target)); // Walk the graph
        }
      );

      await Promise.all(edgePromises); // Wait for edge timers to complete
    }
  };

  const startVertex = workflow.vertices.find((v) => v.start);
  if (!startVertex) {
    console.error("No start vertex specified.");
    return;
  }

  await traverse(startVertex);
};

scaleSvg(); // Scale the svg to size of window

runWorkflow(dagWorkflow).then(() => {
  drawDoneMessage();
});

export default runWorkflow;
