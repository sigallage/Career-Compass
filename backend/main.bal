import ballerina/http;
import ballerina/log;

// Configuration
configurable int interviewServicePort = 5000;
configurable int predictionServicePort = 5001;

public function main() returns error? {
    log:printInfo("Starting backend services...");
    
    // Start interview service
    http:Listener interviewListener = check new(interviewServicePort);
    _ = check interviewListener.attach(interview_service:getService());
    
    // Start prediction service
    http:Listener predictionListener = check new(predictionServicePort);
    _ = check predictionListener.attach(prediction_service:getService());
    
    log:printInfo(string `Services running on ports ${interviewServicePort} and ${predictionServicePort}`);
    
    runtime:registerListener(new object {
        public function gracefulStop() {
            log:printInfo("Shutting down services...");
        }
    });
}