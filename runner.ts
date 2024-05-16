import { Vertex, Workflow, drawVertex, drawEdge } from "./utils";

export const runWorkflow = async (workflow: Workflow) => {
  // Ensure we don't end up in an infinite loop
  const visited = new Set();

  // Recursively traverses the workflow json, using the next vertex passed from each edge connection
  const traverse = async (vertex: Vertex | undefined) => {
    if (vertex && !visited.has(vertex.id)) {
      visited.add(vertex.id);

      await drawVertex(vertex);

      // Each vertex may contain edges which should wait the specified time before displaying,
      // and continuing on to the next vertex
      const edgePromises = vertex.edges.map(
        async (edge: { target: string; time: number }) => {
          await new Promise((resolve) => setTimeout(resolve, edge.time * 1000));
          await drawEdge(vertex, edge, workflow);
          await traverse(workflow.vertices.find((v) => v.id === edge.target)); // Walk the graph
        }
      );

      await Promise.all(edgePromises); // Wait for all edge timers to complete
    }
  };

  const startVertex = workflow.vertices.find((v) => v.start);
  if (!startVertex) {
    console.error("No start vertex specified.");
    return;
  }

  await traverse(startVertex);
};
