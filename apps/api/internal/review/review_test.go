package review

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

func TestGetReviewerCasesRoleCheck(t *testing.T) {
	cfg := &config.Config{
		Environment: "development",
		ConvexURL:   "https://test.convex.cloud",
	}
	database, _ := db.Connect(cfg)
	svc := NewService(database)

	// Policyholder role should be forbidden from accessing reviewer queue
	req := httptest.NewRequest(http.MethodGet, "/api/v1/reviewer/cases", nil)
	ctx := context.WithValue(req.Context(), auth.UserKey, auth.User{
		ID:   "ph_user",
		Role: "POLICYHOLDER",
	})
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	svc.GetReviewerCases(w, req)

	if w.Code != http.StatusForbidden {
		t.Errorf("Expected status 403 Forbidden for POLICYHOLDER, got %d", w.Code)
	}

	// REVIEWER role should be allowed
	req2 := httptest.NewRequest(http.MethodGet, "/api/v1/reviewer/cases", nil)
	ctx2 := context.WithValue(req2.Context(), auth.UserKey, auth.User{
		ID:   "rev_user",
		Role: "REVIEWER",
	})
	req2 = req2.WithContext(ctx2)

	w2 := httptest.NewRecorder()
	svc.GetReviewerCases(w2, req2)

	if w2.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK for REVIEWER, got %d", w2.Code)
	}
}

func TestAddReviewCommentValidation(t *testing.T) {
	cfg := &config.Config{
		Environment: "development",
		ConvexURL:   "https://test.convex.cloud",
	}
	database, _ := db.Connect(cfg)
	svc := NewService(database)

	// Empty comment should fail with 400
	reqBody, _ := json.Marshal(map[string]string{"comment_text": ""})
	req := httptest.NewRequest(http.MethodPost, "/api/v1/reviewer/cases/case_123/comments", bytes.NewReader(reqBody))
	ctx := context.WithValue(req.Context(), auth.UserKey, auth.User{
		ID:   "rev_user",
		Role: "REVIEWER",
	})
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	svc.AddReviewComment(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 for empty comment, got %d", w.Code)
	}
}
