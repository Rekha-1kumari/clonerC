## 1. Architectural Paradigms: RESTful Services, Web APIs, & Microservices

### Representational State Transfer (REST) Architecture
REST is an architectural style designed for distributed hypermedia systems. It specifies constraints that ensure scalability, performance, and simplicity across networked communication.

#### Core Features of REST
1. **Representational State Transfer:** Clients interact with representations of abstract entities called **Resources**. A resource can be a user record, an image, or a collection of documents. The actual physical state of the data remains decoupled from how it is transferred to the client.
2. **Statelessness:** The client-server relationship is decoupled and isolated at a request level. The server retains no context or session memory concerning the client. Each incoming request must contain the comprehensive data, tokens, and parameters necessary to fully execute that operation. This drastically improves horizontal scaling since any instance of a server can handle any request.
3. **Messages:** Communication relies completely on self-descriptive HTTP messages. A typical transaction includes an HTTP request containing meta-headers and payload data, complemented by an HTTP response containing structural headers and output data.
4. **Format Agnosticism (Not Restricted to XML):** Unlike older, highly structured communication styles, REST does not dictate strict syntax rules. It natively supports **JSON (JavaScript Object Notation)**, **XML (eXtensible Markup Language)**, **HTML**, and raw binary or plain text formats. JSON has become the industry standard due to its reduced processing overhead and human-readable formatting.

---

### Conceptual Breakdown: Web Service vs. Web API
While all Web Services exposed over HTTP can technically function as interfaces for application interaction, they are fundamentally distinct in structural and architectural constraints.

| Architectural Dimension | Web Service (SOAP Paradigm) | Web API (RESTful Paradigm) |
| :--- | :--- | :--- |
| **Primary Protocol/Standard** | Relies strictly on the SOAP protocol specification. | Leverages standard, lightweight HTTP/HTTPS specifications. |
| **Data Format Restriction** | Exclusively uses highly structured XML payloads. | Format-agnostic; preferentially utilizes **JSON**, alongside XML, text, etc. |
| **Transport Layer Options** | Can execute across multiple layers (HTTP, SMTP, JMS, FTP). | Optimized and tightly coupled directly with HTTP/HTTPS. |
| **Strictness & Contracts** | Mandates strict interface contracts via WSDL files. | Uses flexible, self-describing interfaces or dynamic specs (OpenAPI/Swagger). |
| **Client Reachability** | Heavier processing footprint; less suited for resource-constrained clients. | Lightweight, highly consumable across Web, Mobile, and IoT clients. |

---

### Concept of Microservices
A **Microservice Architecture** decomposes a massive, monolithic enterprise system into a cohesive collection of specialized, loosely coupled services. 
* **Single Responsibility Principle:** Each microservice is dedicated entirely to a singular, isolated business capability (e.g., authentication, catalog parsing, processing payments).
* **Independent Evolution:** Each microservice possesses an isolated development cycle, its own database engine, independent technology stacks, and unique scaling criteria.
* **Inter-Service Communication:** Microservices exchange state or coordinate tasks using lightweight communication infrastructure, universally selecting **RESTful Web APIs** over HTTP/HTTPS or asynchronous messaging queues.

---

## 2. HTTP Protocol Mechanics: HttpRequest & HttpResponse

The foundational contract governing all Web API communications is the client-server request-response lifecycle.

### HttpRequest Structure
When a client initiates a request to an endpoint, it packages an `HttpRequest` object composed of:
1. **Request Request-Line (URI & Method):** Specifies the physical resource path along with the intent (e.g., `GET /api/v1/inventory/42`).
2. **Request Headers:** Metadata strings communicating structural context (e.g., `Accept: application/json` tells the server the client wants JSON returned, `Authorization: Bearer <token>` provides authentication).
3. **Request Body (Payload):** The explicit business data transferred to the server to manipulate state. Typically present inside write actions like `POST` and `PUT`.

### HttpResponse Structure
Upon finishing execution, the application returns an `HttpResponse` containing:
1. **Status Line:** Comprises the exact HTTP version and the matching protocol numeric status identifier (e.g., `HTTP/1.1 200 OK`).
2. **Response Headers:** Context attributes added by the host system or engine framework (e.g., `Content-Type: application/json`, `Server: Kestrel`).
3. **Response Body:** The underlying resource payload serialized into the requested format, or error descriptions.

---

## 3. HTTP Action Verbs & .NET Attribute Mapping

Web APIs leverage standard HTTP methods to achieve CRUD (Create, Read, Update, Delete) capability. .NET maps these incoming HTTP verbs to specific method blocks using **Routing Attributes**.

### 1. HttpGet
* **Intent:** Retrieves the current state of a resource or collection without modifying anything on the server.
* **Properties:** Safe and Idempotent (running the identical query 1 time or 100 times returns the exact same data state without changing backend data).
* **.NET Attribute:** `[HttpGet]` or parameterized variants like `[HttpGet("{id}")]`.

### 2. HttpPost
* **Intent:** Requests that a new entity be created and attached to the existing resource collection.
* **Properties:** Neither safe nor idempotent. Running multiple identical execution commands creates duplicate independent records.
* **.NET Attribute:** `[HttpPost]`.

### 3. HttpPut
* **Intent:** Replaces the targeted resource completely with an updated version, or creates the resource if it does not yet exist.
* **Properties:** Idempotent. Re-sending an identical replacement entity multiple times results in the exact same state as the first call.
* **.NET Attribute:** `[HttpPut("{id}")]`.

### 4. HttpDelete
* **Intent:** Erases the designated target resource permanently from the persistent storage system.
* **Properties:** Idempotent. Deleting an entry once removes it; subsequent deletes will fail or indicate absence, but the state remains deleted.
* **.NET Attribute:** `[HttpDelete("{id}")]`.

---

## 4. HTTP Status Codes & .NET Action Results

Status codes are separated into numeric blocks to tell clients how a request was processed. In .NET, these are returned cleanly using helper wrappers derived from `ActionResult`.

### 200 OK
* **Semantic Meaning:** The action processed perfectly without any hitches; data payload is enclosed in the response body.
* **.NET Framework Method:** `Ok()` or `Ok(data Object)`.

### 400 Bad Request
* **Semantic Meaning:** The server failed to parse or validate the incoming payload due to client-side structural errors or missing mandatory parameters.
* **.NET Framework Method:** `BadRequest()` or `BadRequest(ModelState)`.

### 401 Unauthorized
* **Semantic Meaning:** The identity verification parameters are absent, malformed, or rejected. The client must supply valid credentials.
* **.NET Framework Method:** `Unauthorized()`.

### 500 Internal Server Error
* **Semantic Meaning:** A runtime anomaly or unhandled exception broke execution flow on the server. It represents an internal operational crash.
* **.NET Framework Method:** `StatusCode(StatusCodes.Status500InternalServerError)` or `Problem()`.

---

## 5. Web API Architecture & Component Lifecycle

### Controller Structure and Inheritance Hierarchies
* **Modern .NET Core Ecosystem:** High-performance RESTful API controllers inherit from `ControllerBase`. This specialized class omits heavy, legacy view-rendering mechanics (like Razor layouts) to focus exclusively on handling raw JSON/XML data.
* **Legacy .NET Framework 4.5 System:** API classes inherited strictly from `ApiController`, separating standard MVC controllers from stateless endpoint APIs.

### Enhancing Actions with the `[ApiController]` Attribute
Applying the `[ApiController]` attribute to a controller class activates several built-in behaviors:
1. **Automatic Model Validation (400 Bad Request):** If standard validation model attributes fail (e.g., `[Required]`), the execution pipeline instantly aborts and returns an automated structural validation error back to the client before executing any custom code.
2. **Implicit Binding Source Inferences:** Automatically infers whether inbound variables should resolve out of the URI query string, parameters, or incoming Body data (e.g., `[FromBody]`).
3. **Attribute Routing Requirement:** Enforces attribute-based route structures on every action instead of relying on generic global route tables.

---

## 6. Configuration Ecosystem: Evolution Across .NET Versions

Configuration systems have changed significantly between modern .NET Core and legacy frameworks.

### Modern .NET Core Architectural Configurations (Cross-Platform)

#### 1. Startup.cs / Program.cs (Ecosystem Consolidation)
In traditional .NET Core implementations, lifecycle setup was split across `Program.cs` and `Startup.cs`. Modern .NET Core unifies this into a single `Program.cs` file using top-level statements:
* **Dependency Injection (DI) Container Engine:** Registers services, application contexts, operational configurations, and singletons into the application via a built-in Service Provider.
* **HTTP Middleware Pipeline Construction:** Builds the step-by-step request pipeline using methods like `app.UseRouting()`, `app.UseAuthentication()`, and `app.UseAuthorization()`.

#### 2. appSettings.json
A clean JSON file used to store hierarchical environment parameters. It manages items such as database connection strings, logging configurations, and feature flags.

#### 3. launchSettings.json
A development-only settings file located in the `Properties/` folder. It manages environment profiles, specific application ports, and environment flags (`ASPNETCORE_ENVIRONMENT`). This file is ignored during production builds.

---

### Legacy .NET Framework 4.5 Structural Configuration Files

#### 1. Route.config
Designed specifically for server-side HTML rendering applications. It defines default global routes (e.g., `/{controller}/{action}/{id}`) to map structural URLs directly to specific controller methods.

#### 2. WebAPI.config
Dedicated exclusively to configuring RESTful endpoints in the legacy ecosystem. It manages API-specific configurations like formatters, filters, message handlers, and distinct routing patterns (e.g., `/api/{controller}/{id}`).
