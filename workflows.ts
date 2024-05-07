export const dagWorkflow = {
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
