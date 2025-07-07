import ballerina/http;
import ballerina/log;

# This module provides the interview question generation service
#
# + port - The port number for the service
# + openRouterApiKey - The OpenRouter API key
# + return - HTTP service or error
public isolated function getInterviewService(int port, string openRouterApiKey) returns http:Service|error {
    // Test API key first
    log:printInfo("Testing OpenRouter API key...");
    string|error apiKeyTest = testOpenRouterApiKey(openRouterApiKey);
    if apiKeyTest is error {
        log:printError("OpenRouter API key test failed", apiKeyTest);
        log:printInfo("Continuing with service creation, but API calls may fail");
    } else {
        log:printInfo("OpenRouter API key test successful: " + apiKeyTest);
    }
    
    // Create and return the service
    http:Service httpService = @http:ServiceConfig {
        cors: {
            allowOrigins: ["*"],
            allowCredentials: false,
            allowHeaders: ["*"],
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    } service object {
         // Handle preflight OPTIONS requests
        resource function options .() returns http:Response {
            http:Response response = new;
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.statusCode = 200;
            return response;
        }
        
        resource function options api/interview() returns http:Response {
            http:Response response = new;
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.statusCode = 200;
            return response;
        }
        
        // Health check endpoint
        resource function get health() returns string {
            return "Interview service is running";
        }
        
        // Interview questions endpoint
        resource function post api/interview(http:Request req) returns http:Response|http:BadRequest|http:InternalServerError {
            log:printInfo("Interview questions endpoint called");
            
            // Parse JSON body
            json|error payload = req.getJsonPayload();
            if payload is error {
                log:printError("Failed to parse JSON payload", payload);
                http:BadRequest badRequest = <http:BadRequest>{
                    body: {
                        "error": "Invalid JSON payload"
                    }
                };
                return badRequest;
            }
            
            log:printInfo("Received payload: " + payload.toString());
            
            // Extract role from JSON
            json|error roleJson = payload.role;
            if roleJson is error || roleJson is () {
                log:printError("Role field missing or invalid in payload");
                http:BadRequest badRequest = <http:BadRequest>{
                    body: {
                        "error": "Job role is required"
                    }
                };
                return badRequest;
            }
            
            string role = roleJson.toString();
            if role == "" {
                log:printError("Role field is empty");
                http:BadRequest badRequest = <http:BadRequest>{
                    body: {
                        "error": "Job role is required"
                    }
                };
                return badRequest;
            }
            
            log:printInfo("Processing interview questions for role: " + role);
            
            // Generate interview questions using OpenRouter API
            string|error answer = generateInterviewQuestions(role, openRouterApiKey);
            if answer is error {
                log:printError("Failed to generate interview questions for role: " + role, answer);
                
                // Fallback to basic questions if API fails
                log:printInfo("Using fallback interview questions for role: " + role);
                answer = generateEnhancedFallbackQuestions(role);
            }
            
            log:printInfo("Successfully generated interview questions for role: " + role);
            
            http:Response httpResponse = new;
            httpResponse.setHeader("Access-Control-Allow-Origin", "*");
            httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            httpResponse.setJsonPayload({
                success: true,
                answer: answer is string ? answer : "Failed to generate questions"
            });
            return httpResponse;
        }
    };
    
    return httpService;
}

# Generate interview questions using OpenRouter API
#
# + role - The job role for which to generate questions
# + apiKey - The OpenRouter API key
# + return - Generated interview questions or error
isolated function generateInterviewQuestions(string role, string apiKey) returns string|error {
    log:printInfo("Starting interview questions generation for role: " + role);
    
    // Validate API key format
    if apiKey.length() == 0 {
        return error("API key is empty");
    }
    
    if !apiKey.startsWith("sk-or-v1-") {
        return error("Invalid API key format. OpenRouter keys should start with 'sk-or-v1-'");
    }
    
    // Log API key info (first 10 chars for security)
    string apiKeyPrefix = apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "SHORT_KEY";
    log:printInfo("Using API key: " + apiKeyPrefix + " (length: " + apiKey.length().toString() + ")");
    
    // Try with different models in case the free one is not available
    string[] modelsToTry = [
        "meta-llama/llama-3.1-8b-instruct:free",
        "google/gemma-7b-it:free",
        "mistralai/mistral-7b-instruct:free",
        "openchat/openchat-7b:free"
    ];
    
    foreach string model in modelsToTry {
        log:printInfo("Trying model: " + model);
        
        http:Client openRouterClient = check new("https://openrouter.ai/api/v1");
        
        json requestBody = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": string `Generate 10 comprehensive technical interview questions for a ${role} position. For each question, provide a detailed answer. Format the response in a clear, readable manner with bullet points for questions and indented explanations for answers.`
                }
            ],
            "max_tokens": 2000,
            "temperature": 0.7
        };
        
        map<string> headers = {
            "Authorization": "Bearer " + apiKey,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://localhost:5000",
            "X-Title": "Career Compass"
        };
        
        // Debug: Log the authorization header (safely)
        string authHeader = headers["Authorization"] ?: "";
        string authPrefix = authHeader.length() > 20 ? authHeader.substring(0, 20) + "..." : authHeader;
        log:printInfo("Authorization header: " + authPrefix);
        
        log:printInfo("Making request to OpenRouter API for role: " + role + " with model: " + model);
        
        http:Response|error response = openRouterClient->post("/chat/completions", requestBody, headers);
        
        if response is error {
            log:printError("HTTP request failed for model " + model, response);
            continue; // Try next model
        }
        
        log:printInfo("Received response from OpenRouter API with status: " + response.statusCode.toString());
        
        if response.statusCode == 200 {
            json responseBody = check response.getJsonPayload();
            log:printInfo("Response body: " + responseBody.toString());
            
            // Extract the generated text from the response
            json|error choices = responseBody.choices;
            if choices is error || choices !is json[] {
                log:printError("Invalid response format from OpenRouter API");
                continue; // Try next model
            }
            
            json[] choicesArray = <json[]>choices;
            if choicesArray.length() == 0 {
                log:printError("No choices returned from OpenRouter API");
                continue; // Try next model
            }
            
            json|error message = choicesArray[0].message;
            if message is error {
                log:printError("Invalid message format in OpenRouter response");
                continue; // Try next model
            }
            
            json|error content = message.content;
            if content is error {
                log:printError("Invalid content format in OpenRouter response");
                continue; // Try next model
            }
            
            string result = content.toString();
            log:printInfo("Successfully extracted content from OpenRouter response. Content length: " + result.length().toString());
            
            return result;
        } else {
            // Get error details from response
            json|error errorBody = response.getJsonPayload();
            string errorDetails = errorBody is json ? errorBody.toString() : "No error details";
            
            log:printError("Model " + model + " failed with status: " + response.statusCode.toString());
            log:printError("Error response body: " + errorDetails);
            
            // If it's a 401, the API key is wrong, so don't try other models
            if response.statusCode == 401 {
                return error("OpenRouter API authentication failed. Please check your API key. Status: " + response.statusCode.toString() + " - " + errorDetails);
            }
            
            // For other errors, try the next model
            continue;
        }
    }
    
    // If we get here, all models failed
    return error("All models failed to generate interview questions. Please check your OpenRouter API key and account status.");
}

# Generate fallback interview questions when API is unavailable
#
# + role - The job role for which to generate questions
# + return - Basic interview questions for the role
isolated function generateFallbackQuestions(string role) returns string {
    return string `
# Technical Interview Questions for ${role} Position

## 1. Technical Fundamentals
**Question:** What are the core technologies and tools you use for ${role} development?
**Answer:** This question assesses the candidate's familiarity with essential technologies relevant to the role.

## 2. Problem-Solving Approach
**Question:** Describe your approach to debugging complex issues in ${role} projects.
**Answer:** Look for systematic thinking, use of debugging tools, and methodical problem-solving skills.

## 3. Best Practices
**Question:** What are the most important best practices you follow in ${role} development?
**Answer:** Candidates should demonstrate knowledge of code quality, testing, documentation, and industry standards.

## 4. Project Experience
**Question:** Tell me about a challenging ${role} project you've worked on recently.
**Answer:** Evaluate their experience level, technical depth, and ability to handle complexity.

## 5. Code Quality
**Question:** How do you ensure code quality and maintainability in your ${role} projects?
**Answer:** Look for mentions of code reviews, testing strategies, documentation, and refactoring practices.

## 6. Performance Optimization
**Question:** What strategies do you use to optimize performance in ${role} applications?
**Answer:** Assess their understanding of performance bottlenecks and optimization techniques.

## 7. Collaboration
**Question:** How do you work with other team members (designers, backend developers, etc.) in ${role} projects?
**Answer:** Evaluate communication skills and cross-functional collaboration experience.

## 8. Learning and Growth
**Question:** How do you stay updated with the latest trends and technologies in ${role} development?
**Answer:** Look for continuous learning mindset and engagement with the developer community.

## 9. Testing Strategy
**Question:** What is your approach to testing in ${role} development?
**Answer:** Assess knowledge of different testing levels and testing tools relevant to the role.

## 10. Technical Challenge
**Question:** Can you walk me through how you would approach building a specific feature related to ${role}?
**Answer:** This allows evaluation of technical thinking, architecture decisions, and implementation approach.

*Note: These are fallback questions generated when the AI service is unavailable. For more detailed and customized questions, please ensure the AI service is properly configured.*
`;
}

# Alternative AI service using Hugging Face (free tier)
#
# + role - The job role for which to generate questions
# + return - Generated interview questions or error
isolated function generateInterviewQuestionsAlternative(string role) returns string|error {
    log:printInfo("Using alternative AI service for role: " + role);
    
    // For now, return enhanced fallback questions
    // You can integrate with other AI APIs here (like Hugging Face, OpenAI, etc.)
    return generateEnhancedFallbackQuestions(role);
}

# Generate enhanced fallback questions with more detail
#
# + role - The job role for which to generate questions
# + return - Enhanced interview questions for the role
isolated function generateEnhancedFallbackQuestions(string role) returns string {
    string roleSpecific = "";
    
    // Add role-specific questions
    if role.toLowerAscii().includes("frontend") || role.toLowerAscii().includes("ui") {
        roleSpecific = string `
## Frontend-Specific Questions:
**Q11:** What's the difference between let, const, and var in JavaScript?
**A11:** var is function-scoped, let and const are block-scoped. const cannot be reassigned.

**Q12:** How do you handle state management in React applications?
**A12:** Using useState for local state, useContext for shared state, or libraries like Redux for complex state.

**Q13:** What are CSS Grid and Flexbox, and when would you use each?
**A13:** Flexbox is for 1D layouts, Grid is for 2D layouts. Use Flexbox for navigation bars, Grid for page layouts.

**Q14:** How do you optimize website performance?
**A14:** Minify CSS/JS, optimize images, use CDN, lazy loading, code splitting, etc.

**Q15:** What is the Virtual DOM in React?
**A15:** A JavaScript representation of the real DOM that enables efficient updates through diffing.
`;
    } else if role.toLowerAscii().includes("backend") || role.toLowerAscii().includes("server") {
        roleSpecific = string `
## Backend-Specific Questions:
**Q11:** What's the difference between SQL and NoSQL databases?
**A11:** SQL databases are relational with fixed schema, NoSQL are non-relational with flexible schema.

**Q12:** How do you handle database connections in production?
**A12:** Use connection pooling, prepared statements, proper error handling, and monitoring.

**Q13:** What are RESTful APIs and their HTTP methods?
**A13:** REST uses HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove).

**Q14:** How do you implement authentication and authorization?
**A14:** Use JWT tokens, OAuth, session management, and role-based access control.

**Q15:** What are microservices and their advantages?
**A15:** Independent services that communicate via APIs, offering scalability and technology diversity.
`;
    } else if role.toLowerAscii().includes("fullstack") || role.toLowerAscii().includes("full-stack") {
        roleSpecific = string `
## Full-Stack Questions:
**Q11:** How do you handle communication between frontend and backend?
**A11:** RESTful APIs, GraphQL, WebSockets, or gRPC depending on requirements.

**Q12:** What's your approach to database design?
**A12:** Normalize for consistency, consider performance, index frequently queried fields.

**Q13:** How do you deploy full-stack applications?
**A13:** Use containerization (Docker), CI/CD pipelines, cloud platforms like AWS/Azure.

**Q14:** How do you handle errors across the full stack?
**A14:** Proper error boundaries in frontend, structured error responses from backend, logging.

**Q15:** What's your testing strategy for full-stack applications?
**A15:** Unit tests, integration tests, end-to-end tests, and API testing.
`;
    } else {
        roleSpecific = string `
## ${role} Specific Questions:
**Q11:** What are the key technologies used in ${role} development?
**A11:** This depends on the specific role and company technology stack.

**Q12:** How do you stay updated with trends in ${role}?
**A12:** Follow industry blogs, attend conferences, participate in communities, continuous learning.

**Q13:** What's your approach to code documentation in ${role} projects?
**A13:** Write clear comments, maintain README files, use self-documenting code practices.

**Q14:** How do you handle version control in ${role} projects?
**A14:** Use Git with proper branching strategies, meaningful commit messages, and pull requests.

**Q15:** What's your debugging process for ${role} applications?
**A15:** Reproduce the issue, use debugging tools, check logs, isolate the problem, and test fixes.
`;
    }
    
    return string `
# Technical Interview Questions for ${role} Position

## Core Technical Questions:

**Q1:** What are the most important programming principles you follow?
**A1:** SOLID principles, DRY (Don't Repeat Yourself), KISS (Keep It Simple), separation of concerns.

**Q2:** How do you approach debugging a complex issue?
**A2:** Reproduce the issue, check logs, use debugging tools, isolate the problem, and test systematically.

**Q3:** What's your experience with version control systems?
**A3:** Git is essential - branching strategies, merge vs rebase, conflict resolution, and collaboration workflows.

**Q4:** How do you ensure code quality in your projects?
**A4:** Code reviews, automated testing, linting, consistent formatting, and following coding standards.

**Q5:** What's your approach to learning new technologies?
**A5:** Official documentation, tutorials, hands-on practice, community resources, and building projects.

**Q6:** How do you handle tight deadlines while maintaining quality?
**A6:** Prioritize features, communicate with stakeholders, use time management techniques, and avoid technical debt.

**Q7:** What's your experience with testing strategies?
**A7:** Unit testing, integration testing, end-to-end testing, and test-driven development practices.

**Q8:** How do you collaborate with other developers?
**A8:** Code reviews, pair programming, clear communication, documentation, and knowledge sharing.

**Q9:** What's your approach to performance optimization?
**A9:** Profile first, identify bottlenecks, optimize algorithms, use caching, and measure improvements.

**Q10:** How do you handle security in your applications?
**A10:** Input validation, authentication, authorization, secure communication, and regular security audits.

${roleSpecific}

## Behavioral Questions:

**Q16:** Describe a challenging project you worked on.
**A16:** Look for problem-solving approach, technical decisions, and lessons learned.

**Q17:** How do you handle disagreements with team members?
**A17:** Professional communication, focus on technical merits, and collaborative problem-solving.

**Q18:** What motivates you in software development?
**A18:** Problem-solving, learning new technologies, building useful solutions, and team collaboration.

**Q19:** How do you prioritize tasks in a busy project?
**A19:** Consider business impact, technical dependencies, deadlines, and stakeholder needs.

**Q20:** What's your approach to continuous learning?
**A20:** Regular reading, online courses, practice projects, and staying engaged with the developer community.

---
*Generated by Career Compass AI Interview Assistant*
*Note: These questions are designed to assess both technical skills and problem-solving abilities.*
`;
}

# Test OpenRouter API key validity
#
# + apiKey - The API key to test
# + return - Success message or error
isolated function testOpenRouterApiKey(string apiKey) returns string|error {
    log:printInfo("Testing OpenRouter API key...");
    
    http:Client openRouterClient = check new("https://openrouter.ai/api/v1");
    
    // Simple request to test authentication
    json requestBody = {
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
            {
                "role": "user", 
                "content": "Hello"
            }
        ],
        "max_tokens": 10
    };
    
    map<string> headers = {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localhost:5000",
        "X-Title": "Career Compass"
    };
    
    http:Response response = check openRouterClient->post("/chat/completions", requestBody, headers);
    
    if response.statusCode == 200 {
        return "API key is valid";
    } else {
        json|error errorBody = response.getJsonPayload();
        string errorDetails = errorBody is json ? errorBody.toString() : "No error details";
        return error("API key test failed. Status: " + response.statusCode.toString() + " - " + errorDetails);
    }
}