import { runWorkflow } from "./runner";
import { scaleSvg, drawDoneMessage } from "./utils";
import { dagWorkflow } from "./workflows";

scaleSvg(); // Scale the svg to size of window

runWorkflow(dagWorkflow).then(() => {
  drawDoneMessage();
});
