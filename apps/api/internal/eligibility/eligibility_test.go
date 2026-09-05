package eligibility

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCheckEligibility(t *testing.T) {
	svc := NewService(nil)

	tests := []struct {
		name           string
		req            CheckRequest
		expectedStatus string
		expectMissing  bool
		expectManual   bool
	}{
		{
			name: "Fully Eligible Health Claim",
			req: CheckRequest{
				InsuranceType:      "HEALTH",
				ClaimStatus:        "PARTIALLY_SETTLED",
				DisputedAmount:     60000.00,
				AvailableDocuments: []string{"rejection_letter", "discharge_summary", "policy_wording"},
				UserAuthority:      true,
			},
			expectedStatus: "ELIGIBLE",
			expectMissing:  false,
			expectManual:   false,
		},
		{
			name: "Conditionally Eligible (Missing Policy Wording)",
			req: CheckRequest{
				InsuranceType:      "HEALTH",
				ClaimStatus:        "REJECTED",
				DisputedAmount:     45000.00,
				AvailableDocuments: []string{"rejection_letter", "discharge_summary"},
				UserAuthority:      true,
			},
			expectedStatus: "CONDITIONALLY_ELIGIBLE",
			expectMissing:  true,
			expectManual:   false,
		},
		{
			name: "High Value Claim Requires Manual Review",
			req: CheckRequest{
				InsuranceType:      "HEALTH",
				ClaimStatus:        "REJECTED",
				DisputedAmount:     750000.00,
				AvailableDocuments: []string{"rejection_letter", "discharge_summary", "policy_wording"},
				UserAuthority:      true,
			},
			expectedStatus: "ELIGIBLE",
			expectMissing:  false,
			expectManual:   true,
		},
		{
			name: "Unsupported Insurance Type (Motor)",
			req: CheckRequest{
				InsuranceType:      "MOTOR",
				ClaimStatus:        "REJECTED",
				DisputedAmount:     50000.00,
				AvailableDocuments: []string{"rejection_letter"},
				UserAuthority:      true,
			},
			expectedStatus: "NOT_SUPPORTED",
			expectMissing:  false,
			expectManual:   false,
		},
		{
			name: "Missing Legal Authority",
			req: CheckRequest{
				InsuranceType:      "HEALTH",
				ClaimStatus:        "REJECTED",
				DisputedAmount:     50000.00,
				AvailableDocuments: []string{"rejection_letter"},
				UserAuthority:      false,
			},
			expectedStatus: "NOT_SUPPORTED",
			expectMissing:  false,
			expectManual:   false,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			body, _ := json.Marshal(tc.req)
			req := httptest.NewRequest(http.MethodPost, "/api/v1/eligibility/check", bytes.NewReader(body))
			w := httptest.NewRecorder()

			svc.CheckEligibility(w, req)

			if w.Code != http.StatusOK {
				t.Fatalf("Expected status code 200, got %d", w.Code)
			}

			var resp CheckResponse
			if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
				t.Fatalf("Failed to decode response: %v", err)
			}

			if resp.Status != tc.expectedStatus {
				t.Errorf("Expected status %s, got %s", tc.expectedStatus, resp.Status)
			}

			if tc.expectMissing && len(resp.MissingDocuments) == 0 {
				t.Errorf("Expected missing documents, got none")
			}

			if resp.ManualReviewRequired != tc.expectManual {
				t.Errorf("Expected manual review %v, got %v", tc.expectManual, resp.ManualReviewRequired)
			}
		})
	}
}
