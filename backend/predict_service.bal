import ballerina/http;
import ballerina/io;
import ballerina/os;
import ballerina/file;
import ballerina/lang.value;

// Define a type for the expected request payload
type SkillsRequest record {
    json[] skills;
};

service / on new http:Listener(5000) {
    resource function post predict(http:Caller caller, http:Request req) returns error? {
        // Get and validate JSON body
        json payload = check req.getJsonPayload();
        SkillsRequest request = check payload.cloneWithType(SkillsRequest);
        
        // Prepare input string for Python
        string input = request.skills.toJsonString();
        
        // Create a temporary file to pass input to Python
        string tempInputPath = check file:createTemp("input_", ".json");
        check io:fileWriteString(tempInputPath, input);
        
        // Prepare command execution arguments
        string[] commandArgs = ["predict.py", tempInputPath];
        
        // Execute the command
        os:Process|error execResult = os:exec({
            value: "python",
            arguments: commandArgs
        });
        
        if execResult is error {
            io:println("Failed to execute Python script:", execResult.message());
            http:Response res = new;
            res.statusCode = http:STATUS_INTERNAL_SERVER_ERROR;
            res.setJsonPayload({
                "message": "Failed to execute Python script",
                "error": execResult.message()
            });
            check caller->respond(res);
            return;
        }
        
        os:Process process = execResult;
        int exitCode = check process.waitForExit();
        byte[] stdoutBytes = check process.output(io:stdout);
        byte[] stderrBytes = check process.output(io:stderr);
        
        // Convert bytes to strings
        string stdout = check string:fromBytes(stdoutBytes);
        string stderr = check string:fromBytes(stderrBytes);
        
        // Handle Python script errors
        if exitCode != 0 {
            io:println("Python Error:", stderr);
            http:Response res = new;
            res.statusCode = http:STATUS_INTERNAL_SERVER_ERROR;
            res.setJsonPayload({
                "message": "Python script failed",
                "error": stderr
            });
            check caller->respond(res);
            return;
        }
        
        // Parse and return successful result
        json parsed = check value:fromJsonString(stdout);
        http:Response res = new;
        res.setJsonPayload(parsed);
        check caller->respond(res);
    }
}