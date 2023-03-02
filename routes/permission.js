const express = require('express');
const router = express.Router();
const permify = require("@permify/permify-node");

const client = new permify.grpc.newClient({
    endpoint: "localhost:3478",
})

router.post("/project/owner", async (req, res) => {
    const {userId, projectId} = req.body;
    console.log(userId, projectId);
    if (req.headers.token.startsWith('m')) {
        res.send(`Only organization ADMINS are authorized to assign permissions`);
    }
    else {
        await this.assignOwnerToProject(userId, projectId);
        res.send(`User: ${userId} is now ADMIN of Project ${projectId}`);
    }
});

exports.assignOwnerToProject = async (userId, projectId) => {
    const relationship = {
        tenantId: "t1",
        metadata: {
            schemaVersion: ""
        },
        tuples: [
            {
                entity: {
                    type: "project",
                    id: projectId
                },
                relation: "owner",
                subject: {
                    type: "user",
                    id: userId
                }
            }
        ]
    };
    const res = await client.relationship.write(relationship);
    console.log(res);
}
 
module.exports = router;