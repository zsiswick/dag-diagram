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
  });
});
