import ballerina/http;
import ballerina/log;

# This module provides the prediction service functionality
public isolated function createService(int port, string modelServiceUrl) returns http:Service|error {
    // Initialize the HTTP client
    http:Client modelClient = check new (modelServiceUrl);

    // Create the service object
    service object {} svc = @http:ServiceConfig {
        cors: {
            allowOrigins: ["*"],
            allowCredentials: false,
            allowHeaders: ["Content-Type", "Authorization"],
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    } service object {
        // Handle preflight OPTIONS requests
        resource function options predict(http:Caller caller, http:Request req) returns error? {
            http:Response res = new;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.statusCode = 200;
            return caller->respond(res);
        }

        resource function post predict(http:Caller caller, http:Request req) returns error? {
            // Step 1: Validate input
            json|error payloadResult = req.getJsonPayload();
            if payloadResult is error {
                http:Response res = new;
                res.statusCode = 400;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setPayload(createErrorResponse(400, "Invalid JSON payload"));
                return caller->respond(res);
            }
            json payload = payloadResult;
           
            if !(payload is map<json>) {
                http:Response res = new;
                res.statusCode = 400;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setPayload(createErrorResponse(400, "Invalid payload format"));
                return caller->respond(res);
            }

            json skillsJson = payload["skills"];
            if skillsJson is () {
                http:Response res = new;
                res.statusCode = 400;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setPayload(createErrorResponse(400, "Skills field is required"));
                return caller->respond(res);
            }
            if !(skillsJson is json[]) {
                http:Response res = new;
                res.statusCode = 400;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setPayload(createErrorResponse(400, "Skills should be an array"));
                return caller->respond(res);
            }

            // Step 2: Prepare model request
            string[] validatedSkills = validateSkills(<json[]>skillsJson);
            if validatedSkills.length() == 0 {
                http:Response res = new;
                res.statusCode = 400;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setPayload(createErrorResponse(400, "No valid skills provided"));
                return caller->respond(res);
            }

            json modelRequest = {
                "skills": validatedSkills
            };

            // Step 3: Call Python model service
            http:Response|error modelResponse = modelClient->post("/predict", modelRequest);
            if modelResponse is error {
                log:printError("Model service error", modelResponse);
                http:Response res = new;
                res.statusCode = 502;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setPayload(createErrorResponse(502, "Prediction service unavailable"));
                return caller->respond(res);
            }

            // Step 4: Process model response
            json|error responseJson = modelResponse.getJsonPayload();
            if responseJson is error {
                http:Response res = new;
                res.statusCode = 502;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setPayload(createErrorResponse(502, "Invalid response from prediction service"));
                return caller->respond(res);
            }

            // Step 5: Forward response
            http:Response res = new;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setPayload(responseJson);
            return caller->respond(res);
        }
    };
    
    return svc;
}

// Helper functions
isolated function createErrorResponse(int status, string message) returns json {
    return {
        "error": message,
        "predicted_role": null,
        "suggested_skills": []
    };
}

isolated function validateSkills(json[] skillsJson) returns string[] {
    string[] skills = [];
    foreach var skill in skillsJson {
        if skill is string {
            skills.push(skill.trim().toLowerAscii());
        } else if skill is int|float|decimal|boolean {
            skills.push(skill.toString().trim().toLowerAscii());
        }
    }
    return skills;
}