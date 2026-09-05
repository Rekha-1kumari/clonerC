# BimaNyaya API Reference Specification

Base Gateway URL: `http://localhost:8080/api/v1` (or production endpoint)

All protected endpoints require a Bearer token in the `Authorization` header:
```http
Authorization: Bearer <clerk_jwt_token>
```

---

## 1. Authentication Endpoints

### `POST /auth/request-otp` *(Development Mode)*
Generates a one-time passcode for simulated authentication.
- **Request Body**:
  ```json
  {
    "email": "user@bimanyaya.in",
    "phone": "+919876543210"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "OTP sent successfully",
    "code_preview_demo": "123456"
  }
  ```

### `POST /auth/verify-otp` *(Development Mode)*
Verifies the OTP and issues a signed JWT access token.
- **Request Body**:
  ```json
  {
    "email": "user@bimanyaya.in",
    "code": "123456"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
  ```

### `GET /auth/me`
Returns the currently authenticated user profile and assigned role.
- **Response `200 OK`**:
  ```json
  {
    "_id": "user_abc123",
    "email": "user@bimanyaya.in",
    "phone": "+919876543210",
    "role": "POLICYHOLDER",
    "status": "ACTIVE",
    "preferred_language": "en"
  }
  ```

---

## 2. Eligibility Engine

### `POST /eligibility/check`
Evaluates claim facts against IRDAI support parameters and document readiness.
- **Request Body**:
  ```json
  {
    "insurance_type": "HEALTH",
    "claim_status": "PARTIALLY_SETTLED",
    "disputed_amount": 60000.00,
    "available_documents": ["rejection_letter", "discharge_summary"],
    "user_authority": true
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "status": "CONDITIONALLY_ELIGIBLE",
    "missing_documents": ["policy_wording"],
    "manual_review_required": false,
    "reason_codes": ["MISSING_POLICY_WORDING"]
  }
  ```

---

## 3. Case Management

### `POST /cases`
Initializes a new claim dispute case.
- **Request Body**:
  ```json
  {
    "insurance_type": "HEALTH",
    "claim_category": "ROOM_RENT_DEDUCTION",
    "claim_status": "PARTIALLY_SETTLED",
    "insurer_name": "Star Health Insurance Co. Ltd.",
    "policy_number": "POL-STAR-8871",
    "claim_number": "CLM-STAR-992",
    "amount_claimed": 150000.00,
    "amount_paid": 90000.00,
    "amount_disputed": 60000.00,
    "preferred_language": "en"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "message": "Case created successfully",
    "id": "case_xyz789",
    "case_number": "BMN-2026-48201"
  }
  ```

### `GET /cases`
Retrieves cases. Policyholders only see owned cases; Reviewers/Admins see all assigned cases.

### `GET /cases/{caseId}`
Retrieves complete details for a specific case.

### `PATCH /cases/{caseId}`
Updates case metadata, state, or assigned reviewer.

### `GET /cases/{caseId}/timeline`
Fetches chronological audit state changes for the case.

---

## 4. Consents & Documents

### `POST /cases/{caseId}/consents`
Records explicit policyholder consent for document processing, legal review, and data retention.
- **Request Body**:
  ```json
  {
    "consent_version": "v1.0",
    "document_processing_consent": true,
    "reviewer_access_consent": true,
    "data_retention_consent": true,
    "authority_confirmation": true,
    "research_consent": false
  }
  ```

### `POST /cases/{caseId}/documents/upload-url`
Generates a presigned URL / reservation ID for document upload.

### `POST /cases/{caseId}/documents/complete`
Marks document upload as complete and transitions case to `PROCESSING`.

---

## 5. AI Reasoning & RAG Pipeline

### `POST /cases/{caseId}/process`
Triggers the asynchronous AI extraction, classification, and RAG analysis pipeline.

### `GET /cases/{caseId}/analysis`
Returns extracted issues, dispute summaries, and potential savings.

### `GET /cases/{caseId}/citations`
Retrieves matched IRDAI regulations and insurer policy clauses.

---

## 6. Grievance Drafts & Translations

### `POST /cases/{caseId}/drafts`
Generates a structured grievance representation letter.

### `POST /drafts/{draftId}/translate`
Translates the representation into Hindi (`hi`), Odia (`or`), or other supported regional languages.

### `GET /drafts/{draftId}/pdf`
Compiles and streams the final grievance representation letter as an IRDAI-compliant PDF document.

---

## 7. Reviewer & Admin Console

### `GET /reviewer/cases` *(Requires `REVIEWER` / `ADMIN` Role)*
Fetches cases awaiting review.

### `POST /reviewer/cases/{caseId}/claim`
Assigns the case to the current reviewer.

### `POST /reviewer/cases/{caseId}/approve`
Approves the grievance representation.

### `POST /reviewer/cases/{caseId}/escalate`
Escalates case to Senior Reviewer pool.

### `POST /admin/reviews/sla-checks` *(Requires `ADMIN` Role)*
Triggers automated SLA evaluations and escalates breached cases.
