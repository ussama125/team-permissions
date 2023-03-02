const express = require('express');
const { checkPermissions, checkPermissionsV2 } = require('../services/permify.service');
const router = express.Router();

router.get("/:id", checkPermissionsV2("view"), (req, res) => {
    res.send(`User: ${req.headers.token} is ${req.authorized} to view project:${req.params.id}`);
});

router.put("/:id", checkPermissions("edit"), (req, res) => {
    res.send(`User: ${req.headers.token} to edit project:${req.params.id}`);
});

router.delete("/:id", checkPermissions("delete"), (req, res) => {
    res.send(`User: ${req.headers.token} to delete project:${req.params.id}`);
});
 
module.exports = router;