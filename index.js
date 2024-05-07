(() => {
  // utils.ts
  var setAttributes = (el, attrs) => {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  };
  var fadeInElement = (time, el) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        el.style.opacity = "1";
        resolve();
      }, time);
    });
  };

  // app.ts
  var vertexFadeTime = 500;
  var vertexRadius = 20;
  var drawVertex = async (vertex) => {
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
        r: `${vertexRadius}`
      });
      setAttributes(text, {
        x: `${vertex.x}`,
        y: `${vertex.y}`,
        "text-anchor": "middle",
        dy: ".3em"
      });
      text.appendChild(textContent);
      group.appendChild(circle);
      group.appendChild(text);
      canvas.appendChild(group);
      await fadeInElement(vertexFadeTime, group);
    }
  };
  var drawEdge = async (vertex, edge) => {
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
          y2: `${targetVertex.y}`
        });
        group.prepend(line);
        await fadeInElement(10, line);
      }
    }
  };
  var runWorkflow = async (workflow2) => {
    const visited = /* @__PURE__ */ new Set();
    const traverse = async (vertex) => {
      if (vertex && !visited.has(vertex.id)) {
        visited.add(vertex.id);
        await drawVertex(vertex);
        const edgePromises = vertex.edges.map(
          async (edge) => {
            await new Promise((resolve) => setTimeout(resolve, edge.time * 1e3));
            await drawEdge(vertex, edge);
            await traverse(workflow2.vertices.find((v) => v.id === edge.target));
          }
        );
        await Promise.all(edgePromises);
      }
    };
    const startVertex = workflow2.vertices.find((v) => v.start);
    if (!startVertex) {
      console.error("No start vertex specified.");
      return;
    }
    await traverse(startVertex);
  };
  var svg = document.getElementById("workflowSVG");
  if (svg) {
    svg.setAttribute("width", `${window.innerWidth - 100}`);
    svg.setAttribute("height", `${window.innerHeight - 100}`);
  }
  var workflow = {
    vertices: [
      {
        id: "A",
        start: true,
        edges: [
          { target: "B", time: 3 },
          { target: "C", time: 5 }
        ],
        x: 100,
        y: 50
      },
      { id: "B", edges: [{ target: "D", time: 3 }], x: 100, y: 100 },
      { id: "C", edges: [{ target: "D", time: 2 }], x: 150, y: 100 },
      { id: "D", edges: [], x: 100, y: 150 }
    ]
  };
  runWorkflow(workflow).then(() => {
    const headerSection = document.getElementById("header");
    if (headerSection) {
      const text = document.createElement("p");
      const textContent = document.createTextNode("Done");
      text.appendChild(textContent);
      headerSection.appendChild(text);
    }
  });
})();
