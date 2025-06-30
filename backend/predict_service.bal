import ballerina/http;
import ballerina/log;

// HTTP client to connect to Python service
http:Client pythonClient = check new("http://localhost:5001");

// CORS configuration
@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"],
        allowCredentials: false,
        allowHeaders: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
service / on new http:Listener(5000) {

    // POST endpoint for prediction
    resource function post predict(http:Caller caller, http:Request req) returns error? {
        
        // Extract JSON payload from request
        json|error payload = req.getJsonPayload();
        
        if (payload is error) {
            http:Response errorResponse = new;
            errorResponse.statusCode = 400;
            errorResponse.setJsonPayload({"error": "Invalid JSON payload"});
            check caller->respond(errorResponse);
            return;
        }
        
        // Forward request to Python service
        http:Response|error pythonResponse = pythonClient->post("/predict", payload);
        
        if (pythonResponse is error) {
            log:printError("Failed to call Python service", pythonResponse);
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Prediction service unavailable"});
            check caller->respond(errorResponse);
            return;
        }
        
        // Forward Python service response to client
        check caller->respond(pythonResponse);
    }
}

// Service startup message  
public function main() {
    log:printInfo("✅ Ballerina gateway running at http://localhost:5000");
    log:printInfo("🔗 Forwarding requests to Python service at http://localhost:5001");
}