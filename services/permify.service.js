const permify = require("@permify/permify-node");
const {PermissionCheckResponse_Result} = require("@permify/permify-node/dist/src/grpc/generated/base/v1/service");

const client = new permify.grpc.newClient({
    endpoint: "localhost:3478",
})

// checkPermission middleware that lets you check 
// whether user authorized to perform specific action 
exports.checkPermissions = (permissionType) => {
  return async (req, res, next) => {
    const userId = req.headers.token;
    
    // body params of Permify check request
    const bodyParams = {
      metadata: {
        schema_version: "",
        snap_token: "",
        depth: 20,
      },
      entity: {
        type: "project",
        id: req.params.id,
      },
      permission: permissionType,
      subject: {
        type: "user",
        id: userId, // user id
        relation: "",
      },
    };

    // performing the check request
    const checkRes = await fetch("http://localhost:3476/v1/tenants/t1/permissions/check", {
      method: "POST",
      body: JSON.stringify(bodyParams),
      headers: { "Content-Type": "application/json" },
    })
    .catch((err) => {
      console.error('Error: ', err);
      res.status(500).send(err);
    });
    
    let checkResJson = await checkRes.json()
    console.log('Check Result:', checkResJson)

    if (checkResJson.can == "RESULT_ALLOWED") {
        // if user authorized
        req.authorized = "authorized";
        next();
    } 

    // if user not authorized
    req.authorized = "not authorized";
    next();
  };
};

exports.checkPermissionsV2 = (permissionType) => {
    return async (req, res, next) => {
      const userId = req.headers.token;
      
      // body params of Permify check request
      const bodyParams = {
        tenantId: "t1",
        metadata: {
          schema_version: "",
          snap_token: "",
          depth: 20,
        },
        entity: {
          type: "project",
          id: req.params.id,
        },
        permission: permissionType,
        subject: {
          type: "user",
          id: userId, // user id
          relation: "",
        },
      };

      console.log(bodyParams);

      client.permission.check(bodyParams).then((response) => {
        if (response.can === PermissionCheckResponse_Result.RESULT_ALLOWED) {
            req.authorized = "authorized";
            next();
        } else {
            req.authorized = "not authorized";
            next();
        }
    })
  
    };
  };