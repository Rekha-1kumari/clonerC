package consent

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"bimanyaya/api/internal/auth"
	"bimanyaya/api/internal/config"
	"bimanyaya/api/internal/db"
)

func TestRecordConsentUnauthorized(t *testing.T) {
	cfg := &config.Config{
		Environment: "development",
		ConvexURL:   "https://test.convex.cloud",
	}
	database, _ := db.Connect(cfg)
	svc := NewService(database)

	reqPayload := RecordConsentRequest{
		ConsentVersion:            "v1.0",
		DocumentProcessingConsent: true,
		ReviewerAccessConsent:     true,
		DataRetentionConsent:      true,
		AuthorityConfirmation:     true,
		ResearchConsent:           false,
	}

	body, _ := json.Marshal(reqPayload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/cases/case_123/consents", bytes.NewReader(body))
	w := httptest.NewRecorder()

	svc.RecordConsent(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("Expected status 401 for unauthenticated request, got %d", w.Code)
	}
}

func TestRecordConsentMissingCaseID(t *testing.T) {
	cfg := &config.Config{
		Environment: "development",
		ConvexURL:   "https://test.convex.cloud",
	}
	database, _ := db.Connect(cfg)
	svc := NewService(database)

	reqPayload := RecordConsentRequest{
		ConsentVersion:            "v1.0",
		DocumentProcessingConsent: true,
	}

	body, _ := json.Marshal(reqPayload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/cases//consents", bytes.NewReader(body))
	ctx := context.WithValue(req.Context(), auth.UserKey, auth.User{
		ID:   "test_user",
		Role: "POLICYHOLDER",
	})
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	svc.RecordConsent(w, req)

	if w.Code != http.StatusBadRequest && w.Code != http.StatusNotFound {
		t.Errorf("Expected 400 or 404 for missing case ID, got %d", w.Code)
	}
}
