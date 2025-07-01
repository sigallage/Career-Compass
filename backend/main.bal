import ballerina/http;
import ballerina/log;
import ballerina/io;
import ballerina/lang.'string as strings;

// Configuration for the service
configurable int port = 5000;

// Sample in-memory data store for demonstration
// In a real implementation, you would load your ML model here
final map<string> rolePredictions = {
    "react,javascript,html,css": "Frontend Developer",
    "python,java,sql": "Backend Developer",
    "python,machine learning,tensorflow": "ML Engineer",
    "aws,docker,kubernetes": "DevOps Engineer"
};

final map<string[]> suggestedSkills = {
    "Frontend Developer": ["TypeScript", "Redux", "GraphQL"],
    "Backend Developer": ["Spring", "Django", "NoSQL"],
    "ML Engineer": ["PyTorch", "Scikit-learn", "Pandas"],
    "DevOps Engineer": ["Terraform", "CI/CD", "Monitoring"]
};

service / on new http:Listener(port) {

    resource function post predict(http:Caller caller, http:Request req) returns error? {
        // Extract skills from request
        json payload = check req.getJsonPayload();
        
        if !(payload is map<json>) {
            http:Response res = new;
            res.statusCode = 400;
            res.setPayload({error: "Invalid payload format"});
            return caller->respond(res);
        }

        json skillsJson = payload.skills;
        
        if !(skillsJson is json[]) {
            http:Response res = new;
            res.statusCode = 400;
            res.setPayload({error: "Skills should be an array"});
            return caller->respond(res);
        }

        // Process skills
        string[] skills = from var skill in skillsJson 
                         select skill.toString().trim().toLowerAscii();
        string skillsKey = strings:'join(",", ...skills);
        
        // Get prediction (in a real app, this would call your ML model)
        string? predictedRole = rolePredictions[skillsKey];
        string[] skillsSuggestions = [];
        
        if predictedRole is () {
            predictedRole = "Unknown Role";
            skillsSuggestions = ["Consider adding more specific skills"];
        } else {
            skillsSuggestions = suggestedSkills.get(predictedRole) ?: [];
        }

        // Prepare response
        json response = {
            predicted_role: predictedRole,
            message: "Predicted Role: " + predictedRole.toString(),
            suggested_skills: skillsSuggestions
        };

        http:Response res = new;
        res.setPayload(response);
        return caller->respond(res);
    }
}