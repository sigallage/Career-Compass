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
    http:Listener interviewListener = check new(interviewServicePort);
    http:Service interviewService = check getService(interviewServicePort, openRouterApiKey);
    check interviewListener.attach(interviewService, "/");

    // Start prediction service
    http:Listener predictionListener = check new(predictionServicePort);
    http:Service predictionService = check createService(predictionServicePort, modelServiceUrl);
    check predictionListener.attach(predictionService, "/prediction");

    // Start the listeners
    check interviewListener.'start();
    check predictionListener.'start();

    log:printInfo(string `Services running on ports ${interviewServicePort} and ${predictionServicePort}`);

    // Keep the main function running - wait for termination
    runtime:sleep(9223372036854775807); // Max int64 value to keep running
}