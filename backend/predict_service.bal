import ballerina/http;
import ballerina/io;
import ballerina/lang.runtime;

service / on new http:Listener(5000) {

    resource function post predict(http:Caller caller, http:Request req) returns error? {
        json body = check req.getJsonPayload();

        if !body.hasKey("skills") {
            check caller->respond({ error: "Missing 'skills' in request body" });
            return;
        }

        // Extract skills array from JSON
        json skills = body["skills"];

        // Prepare command to run Python script
        string[] command = ["python", "predict.py"];
        string input = skills.toJsonString();  // Convert JSON to string

        // Run Python script with input and capture output
        [string output, string stderr, int exitCode] = check runtime:exec(command, input = input);

        if exitCode != 0 {
            io:println("❌ Python Error: ", stderr);
            check caller->respond({ error: "Python execution failed", details: stderr });
            return;
        }

        // Parse Python JSON output and respond
        json result = check output.fromJsonString();
        check caller->respond(result);
    }
}
