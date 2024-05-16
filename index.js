(() => {
  // utils.ts
  var vertexFadeTime = 500;
  var vertexRadius = 20;
  var svgNamespace = "http://www.w3.org/2000/svg";
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
  var drawVertex = async (vertex) => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      const group = document.createElementNS(svgNamespace, "g");
      group.setAttribute("id", vertex.id);
      const circle = document.createElementNS(svgNamespace, "circle");
      setAttributes(circle, {
        id: vertex.id,
        cx: `${vertex.x}`,
        cy: `${vertex.y}`,
        r: `${vertexRadius}`
      });
      const text = document.createElementNS(svgNamespace, "text");
      setAttributes(text, {
        x: `${vertex.x}`,
        y: `${vertex.y}`,
        "text-anchor": "middle",
        dy: ".3em"
      });
      const textContent = document.createTextNode(vertex.id);
      text.appendChild(textContent);
      group.appendChild(circle);
      group.appendChild(text);
      canvas.appendChild(group);
      await fadeInElement(vertexFadeTime, group);
    }
  };
  var drawEdge = async (vertex, edge, workflow) => {
    const group = document.getElementById(vertex.id);
    const targetVertex = workflow.vertices.find((v) => v.id === edge.target);
    if (group && targetVertex) {
      const line = document.createElementNS(svgNamespace, "line");
      setAttributes(line, {
        x1: `${vertex.x}`,
        y1: `${vertex.y}`,
        x2: `${targetVertex.x}`,
        y2: `${targetVertex.y}`
      });
      group.prepend(line);
      await fadeInElement(10, line);
    }
  };
  var drawDoneMessage = () => {
    const headerSection = document.getElementById("header");
    if (headerSection) {
      const text = document.createElement("p");
      const textContent = document.createTextNode("Done");
      text.appendChild(textContent);
      headerSection.appendChild(text);
    }
  };
  var scaleSvg = () => {
    const svg = document.getElementById("workflowSVG");
    if (svg) {
      svg.setAttribute("width", `${window.innerWidth - 100}`);
      svg.setAttribute("height", `${window.innerHeight - 100}`);
    }
  };

  // runner.ts
  var runWorkflow = async (workflow) => {
    const visited = /* @__PURE__ */ new Set();
    const traverse = async (vertex) => {
      if (vertex && !visited.has(vertex.id)) {
        visited.add(vertex.id);
        await drawVertex(vertex);
        const edgePromises = vertex.edges.map(
          async (edge) => {
            await new Promise((resolve) => setTimeout(resolve, edge.time * 1e3));
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

  // workflows.ts
  var dagWorkflow = {
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

  // app.ts
  scaleSvg();
  runWorkflow(dagWorkflow).then(() => {
    drawDoneMessage();
  });
})();
