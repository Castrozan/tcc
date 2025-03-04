# Notes

## 04/03/2025

### Theme

like these applications, i want to do my tcc (trabalho de conclusão de curso) in this field of applications. An AI powered chat that has context based on business systems that are relatively small to median where, the end-user is able to instead of using the UI provided, just reach the data and get insights directly from the AI.

The AI should be getting data from (here's a bunch of possible ways i think of to gather data from a existing system):

1. Connecting the AI directly to the database:
   A separate AI application would be set to connect to a bunch of databases with data to be queryed from the chat and with this data (and probably metadata configuration inputed in the AI system by the company to explain details of the systems and setting restrictions) the IA can listen to user requests of information, them reason about how to gather the information from que database (relaying on the metadata) generate querys to get the respective data and analise it to answer the user.

2. Connecting the AI with a ORM from a specific programming language and distributing this as a plugin
   With this, a library can be develop to enable devs to set models from a application that uses a ORM, so annotating the properties and setting up restrictions for the modules. In this way the AI service can be handled and ran directly from the company's applications meaning a more cost effective solution and infrastructure intense solution for the AI feature. This solution is more restrictive because only a number of languages and ORMs can be implemented to support the AI plugin. For a business perspective this solution is harder to make money of.

3. Connecting the AI with a swagger like structure to receive data as a comum UI application
   Gathering data directly from the database can be rather complex implying the necessity of generating sql querys for relational databases and non relational databases, as well is comum practice that not all of the data is persisted to databases, as for mathematics calculations that are done in the backend services that originally connect to such databases and have their business rules to process data. Using AI to consume a distinctly and structured metadata definition of access to APIs via swagger like structures can be a viable solution to gather data to respond to a user answer, but this implies some drawbacks like, low speeds via doing multiple http requests to multiple services on the company's infrastructure. Doing in this way the AI application is not embedded into a existing application, so it has to be its own thing. Another, is that metadata and restrictions should be handled by the AI application as well

With this, give me more reason to each possible solutions or thesis, and your take on this systems, its practical do-ability and reasoning. i'm accepting more suggestions that follow this line o thought

https://chatgpt.com/share/67c681a8-e160-800e-a038-3db6941aea63
