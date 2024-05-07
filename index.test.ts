import * as utils from "./utils";
import { runWorkflow } from "./app";

describe("DAG Diagram Suite", () => {
  describe("utils", () => {
    it("should set attributes for html elements", () => {
      const text = document.createElement("p");
      utils.setAttributes(text, { id: "foo" });
      expect(text.getAttribute("id")).toBe("foo");

      utils.setAttributes(text, { class: "bar" });
      expect(text.getAttribute("class")).toBe("bar");
    });

    it("should fade in a transparent element", async () => {
      const text = document.createElement("p");
      text.style.opacity = "0";
      await utils.fadeInElement(0, text);
      expect(text.getAttribute("style")).toContain("opacity: 1");
    });
  });

  describe("#runWorkflow", () => {
    it("should log an error if no start is defined in vertices", async () => {
      const errorSpy = jest.spyOn(global.console, "error");
      const workflow = {
        vertices: [
          {
            id: "A",
            edges: [],
            x: 0,
            y: 0,
          },
        ],
      };

      await runWorkflow(workflow);
      expect(errorSpy).toHaveBeenCalled();
    });

    it("should draw each vertex and edge elements on screen", async () => {
      // Setup DOM
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const canvasGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      svg.setAttribute("id", "workflowSVG");
      canvasGroup.setAttribute("id", "canvas");
      svg.appendChild(canvasGroup);
      document.body.appendChild(svg);

      const workflow = {
        vertices: [
          {
            id: "A",
            start: true,
            edges: [
              { target: "B", time: 0 },
              { target: "C", time: 0 },
            ],
            x: 100,
            y: 50,
          },
          { id: "B", edges: [{ target: "D", time: 0 }], x: 100, y: 100 },
          { id: "C", edges: [{ target: "D", time: 0 }], x: 150, y: 100 },
          { id: "D", edges: [], x: 100, y: 150 },
        ],
      };
      await runWorkflow(workflow);

      const vertexes = document.querySelectorAll("circle");
      expect(vertexes).toHaveLength(4);

      const texts = document.querySelectorAll("text");
      expect(texts[0].textContent).toBe("A");
      expect(texts[1].textContent).toBe("B");
      expect(texts[2].textContent).toBe("C");
      expect(texts[3].textContent).toBe("D");

      const lines = document.querySelectorAll("line");
      expect(lines).toHaveLength(4);
    });
  });
});
