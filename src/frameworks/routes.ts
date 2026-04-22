import { Express, Router } from "express";
import { RegistrationController } from "../adapters/controllers/RegistrationController";
import { EventController } from "../adapters/controllers/EventController";
import { AuthController } from "../adapters/controllers/AuthController";

import { authMiddleware } from "./middleware/authMiddleware";

export default async function initRoutes(app: Express, _dataSource?: any) {
  const router = Router();

  // ── Auth routes ──────────────────────────────────────────────────────────
  const authController = new AuthController();

  router.post("/auth/signup", authController.signup);
  router.post("/auth/login", authController.login);

  // ── Registration routes ──────────────────────────────────────────────────
  const registrationController = new RegistrationController();

  // Student registers → ticket email sent
  router.post("/register", registrationController.createRegistration);

  // Admin views all registrations (protected)
  router.get("/registrations", authMiddleware, registrationController.getAllRegistrations);

  // Admin views registrations for a specific event (protected)
  router.get("/registrations/event/:eventId", authMiddleware, registrationController.getByEventId);

  // ── Event routes (admin + public webapp) ────────────────────────────────
  const eventController = new EventController();

  // Public: webapp reads these (no auth needed)
  router.get("/registration/featured", eventController.getFeaturedEvents);
  router.get("/registration/active", eventController.getActiveEvents);
  router.get("/registration/:id", eventController.getEventById);
  router.get("/registration", eventController.getAllEvents);

  // Admin: create / edit / toggle / delete (protected)
  router.post("/registration", authMiddleware, eventController.createEvent);
  router.put("/registration/:id", authMiddleware, eventController.updateEvent);
  router.patch("/registration/:id/toggle", authMiddleware, eventController.toggleActive);
  router.delete("/registration/:id", authMiddleware, eventController.deleteEvent);



  app.use("/api/v1", router);
}
