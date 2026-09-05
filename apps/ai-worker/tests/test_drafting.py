import pytest
from app.drafting import DraftingService

def test_drafting_service_generation():
    drafter = DraftingService()
    
    claim_details = {
        "insurer": "Star Health Insurance Co. Ltd.",
        "claim_number": "CLI-9908122-A",
        "policy_number": "POL-88001928-0",
        "amount_claimed": 150000.0,
        "amount_paid": 90000.0,
        "amount_disputed": 60000.0
    }
    
    issues = [{"issue_category": "ROOM_RENT_DEDUCTION"}]
    citations = [{"source_type": "REGULATION", "clause": "6.1"}]
    
    result = drafter.generate_grievance_draft("case_test_123", claim_details, issues, citations)
    
    assert "subject" in result
    assert "content" in result
    assert "GRIEVANCE REPRESENTATION LETTER" in result["content"]
    assert "Star Health" in result["content"]
    assert "IRDAI" in result["content"]
    assert "CLI-9908122-A" in result["subject"]
