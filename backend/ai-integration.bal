import ballerina/http;
import ballerina/log;

# This module provides the interview question generation service
#
# + port - The port number for the service
# + openRouterApiKey - The OpenRouter API key
# + return - HTTP service or error
public isolated function getService(int port, string openRouterApiKey) returns http:Service|error {
    final string OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
    final string OPENROUTER_MODEL = "mistralai/mistral-7b-instruct";
    
    // Initialize the HTTP client
    http:Client openRouterClient = check new (OPENROUTER_API_URL, {
        timeout: 30,
        httpVersion: http:HTTP_1_1
    });
    
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
        resource function options .() returns http:Ok {
            return http:OK;
        }
        
        resource function options api/interview() returns http:Ok {
            return http:OK;
        }
        
        // Health check endpoint
        resource function get health() returns string {
            return "Interview service is running";
        }
        
        // Interview questions endpoint
        resource function post api/interview(InterviewRequest request) returns InterviewResponse|http:BadRequest|http:InternalServerError {
            // Validate request
            if request.role == "" {
                return <http:BadRequest>{
                    body: {
                        "error": "Job role is required"
                    }
                };
            }
            
            // Generate interview questions
            do {
                string prompt = string `Generate 10 technical interview questions and answers for a ${request.role} job. Use bullet points.`;
               
                OpenRouterRequest openRouterRequest = {
                    model: OPENROUTER_MODEL,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 1000
                };
                
                map<string> headers = {
                    "Authorization": string `Bearer ${openRouterApiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "AI Interview Assistant"
                };
                
                OpenRouterResponse response = check openRouterClient->post("/", openRouterRequest, headers);
               
                string answer = response.choices.length() > 0 ? response.choices[0].message.content : "No response generated.";
               
                return {
                    success: true,
                    answer: answer
                };
            } on fail error err {
                log:printError("OpenRouter API Error", err);
                return <http:InternalServerError>{
                    body: {
                        "success": false,
                        "error": "Failed to generate questions. Try again later."
                    }
                };
            }
        }
    };
    
    return httpService;
}

// Type definitions
public type InterviewRequest record {
    string role;
};

public type InterviewResponse record {
    boolean success;
    string answer;
};

public type OpenRouterRequest record {
    string model;
    Message[] messages;
    int max_tokens;
};

public type Message record {
    string role;
    string content;
};

public type OpenRouterResponse record {
    Choice[] choices;
};

public type Choice record {
    MessageContent message;
};

public type MessageContent record {
    string content;
};