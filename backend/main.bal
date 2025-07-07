import ballerina/http;
import ballerina/log;
import ballerina/lang.runtime;

// Configuration
configurable int interviewServicePort = ?;
configurable int predictionServicePort = ?;
configurable string openRouterApiKey = ?;
configurable string modelServiceUrl = ?;

public function main() returns error? {
    log:printInfo("Starting backend services...");

    // Start interview service
    log:printInfo("Creating interview service on port: " + interviewServicePort.toString());
    http:Listener interviewListener = check new(interviewServicePort);
    http:Service interviewService = check getInterviewService(interviewServicePort, openRouterApiKey);
    check interviewListener.attach(interviewService, "/");

    // Start prediction service
    log:printInfo("Creating prediction service on port: " + predictionServicePort.toString());
    http:Listener predictionListener = check new(predictionServicePort);
    http:Service predictionService = check createService(predictionServicePort, modelServiceUrl);
    check predictionListener.attach(predictionService, "/prediction");

    // Start the listeners
    log:printInfo("Starting interview service listener on port: " + interviewServicePort.toString());
    check interviewListener.'start();
    log:printInfo("Starting prediction service listener on port: " + predictionServicePort.toString());
    check predictionListener.'start();

    log:printInfo(string `Services running on ports ${interviewServicePort} and ${predictionServicePort}`);
    log:printInfo("Interview service endpoints:");
    log:printInfo("  - GET /health");
    log:printInfo("  - POST /api/interview");
    log:printInfo("Prediction service endpoints:");
    log:printInfo("  - POST /prediction/predict");

    // Keep the main function running - wait for termination
    runtime:sleep(9223372036854775807); // Max int64 value to keep running
}