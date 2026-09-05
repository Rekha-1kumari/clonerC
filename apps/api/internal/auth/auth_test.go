package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"bimanyaya/api/internal/config"
	"bimanyaya/api/internal/db"
)

func TestRequireRoleMiddleware(t *testing.T) {
	tests := []struct {
		name           string
		userRole       string
		allowedRoles   []string
		expectedStatus int
	}{
		{
			name:           "User has required role",
			userRole:       "REVIEWER",
			allowedRoles:   []string{"REVIEWER", "ADMIN"},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "User does not have required role",
			userRole:       "POLICYHOLDER",
			allowedRoles:   []string{"REVIEWER", "ADMIN"},
			expectedStatus: http.StatusForbidden,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			handler := RequireRole(tc.allowedRoles...)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("OK"))
			}))

			req := httptest.NewRequest(http.MethodGet, "/test", nil)
			ctx := context.WithValue(req.Context(), UserKey, User{
				ID:   "test_user",
				Role: tc.userRole,
			})
			req = req.WithContext(ctx)

			w := httptest.NewRecorder()
			handler.ServeHTTP(w, req)

			if w.Code != tc.expectedStatus {
				t.Errorf("Expected status %d, got %d", tc.expectedStatus, w.Code)
			}
		})
	}
}

func TestRequestAndVerifyOTP(t *testing.T) {
	cfg := &config.Config{
		Environment:    "development",
		ClerkSecretKey: "test_secret_key_32_bytes_long_12345",
		ClerkJWTIssuer: "https://test.clerk.accounts.dev",
		ConvexURL:      "https://test.convex.cloud",
	}
	database, _ := db.Connect(cfg)
	authSvc := NewAuthService(database, cfg)

	// Step 1: Request OTP
	reqBody, _ := json.Marshal(OTPRequest{Email: "policyholder@bimanyaya.in"})
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/request-otp", bytes.NewReader(reqBody))
	w := httptest.NewRecorder()

	authSvc.RequestOTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected OTP request status 200, got %d", w.Code)
	}

	var otpResp map[string]string
	json.NewDecoder(w.Body).Decode(&otpResp)
	code := otpResp["code_preview_demo"]
	if code == "" {
		t.Fatalf("Expected preview demo code in development mode, got empty")
	}

	// Step 2: Verify OTP
	verifyBody, _ := json.Marshal(OTPVerifyRequest{
		Email: "policyholder@bimanyaya.in",
		Code:  code,
	})
	verifyReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/verify-otp", bytes.NewReader(verifyBody))
	verifyW := httptest.NewRecorder()

	authSvc.VerifyOTP(verifyW, verifyReq)

	if verifyW.Code != http.StatusOK {
		t.Fatalf("Expected OTP verify status 200, got %d (body: %s)", verifyW.Code, verifyW.Body.String())
	}

	var tokenResp map[string]interface{}
	json.NewDecoder(verifyW.Body).Decode(&tokenResp)
	if tokenResp["access_token"] == nil {
		t.Errorf("Expected access_token in response")
	}
}
