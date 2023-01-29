import { Router } from "express";
import { deleteMatch, postMatch, putMatch } from "../controllers/matchControllers.js";
import { deleteTeam, getMatchesOfTeam, getTable, getTeam, postTeam } from "../controllers/teamControllers.js";
import { matchValidator } from "../middlewares/matchValidator.js";
import { teamValidator } from "../middlewares/teamValidator.js";

const router = Router();
router.post("/team", teamValidator, postTeam);
router.delete("/team", teamValidator, deleteTeam);
router.post("/match", matchValidator, postMatch);
router.put("/match", matchValidator, putMatch);
router.delete("/match", matchValidator, deleteMatch);
router.get("/table", getTable);
router.get("/table/:name", getTeam);
router.get("/match/:name", getMatchesOfTeam);

export default router;