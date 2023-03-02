const permify = require("@permify/permify-node");

const client = new permify.grpc.newClient({
    endpoint: "localhost:3478",
})

exports.createTenant = async () => {
    const res = await client.tenancy.create({
        id: "t1",
        name: "tenant 1"
    });
    console.log(res);
}

exports.writeSchema = async () => {
    const res = await client.schema.write({
        tenantId: "t1",
        schema: `
        entity user {}

        entity organization {

            //organizational roles
            relation admin @user
            relation member @user

        }

        entity team {

            // represents admin of the team
            relation admin @user

            // represents direct member of the team
            relation member @user

            // reference for organization that team belong
            relation org @organization

            // organization admins or team admins can edit, delete the team details
            action edit = org.admin or admin
            action delete = org.admin or admin

            // to invite someone you need to be admin and either owner or member of this team
            action invite = org.admin and (admin or member)

            // only owners can remove users
            action remove_user =  admin

        }

        entity project {

            // references for team and organization that project belongs
            relation owner @user
            relation team @team
            relation org @organization

            action view = org.admin or team.member or owner
            action edit = org.admin or team.member or owner
            action delete = org.admin

        }
        `
    });
    console.log(res);
}

exports.writeRelationships = async () => {
    const adminRelationship = {
        tenantId: "t1",
        metadata: {
            schemaVersion: ""
        },
        tuples: [
            {
                entity: {
                    type: "project",
                    id: "1"
                },
                relation: "owner",
                subject: {
                    type: "user",
                    id: "a1"
                }
            },
            {
                entity: {
                    type: "project",
                    id: "2"
                },
                relation: "owner",
                subject: {
                    type: "user",
                    id: "a1"
                }
            },
            {
                entity: {
                    type: "project",
                    id: "3"
                },
                relation: "owner",
                subject: {
                    type: "user",
                    id: "a1"
                }
            },
            {
                entity: {
                    type: "project",
                    id: "4"
                },
                relation: "owner",
                subject: {
                    type: "user",
                    id: "a1"
                }
            },
            {
                entity: {
                    type: "project",
                    id: "5"
                },
                relation: "owner",
                subject: {
                    type: "user",
                    id: "a1"
                }
            }
        ]
    };
    const res = await client.relationship.write(adminRelationship);
    console.log(res);
}