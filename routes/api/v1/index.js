"use strict";
const router = require("express").Router(); 
const auth = global.include("middleware/auth");
const users = require("../../../controllers/users");
const holes = require("../../../controllers/holes");



router.get("/user", auth.authenticate, (req, res) => users.getUser(req,res));
router.get("/holes", auth.authenticate, (req, res) => holes.getHoles(req, res));
router.post("/hole", auth.authenticate, (req, res) => holes.createHole(req, res));
router.get("/holes", auth.authenticate, (req, res) => holes.getHoles(req, res));


module.exports = router;