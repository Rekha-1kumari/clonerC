import pytest
from app.reasoning import ReasoningEngine

def test_reasoning_engine_analysis():
    engine = ReasoningEngine()
    
    claim_facts = {
        "insurer": "Star Health Insurance Co. Ltd.",
        "amount_claimed": 150000.0,
        "amount_paid": 90000.0,
        "amount_disputed": 60000.0
    }
    
    policy_citations = [
        {
            "clause_number": "1.A",
            "quoted_text": "Room, Boarding and Nursing Expenses ... 1% of the Sum Insured"
        }
    ]
    
    regulatory_citations = [
        {
            "title": "Circular on Proportionate Deduction on Room Rent limits",
            "quoted_text": "proportionate deduction can only be applied on associate medical expenses and NOT on cost of implants"
        }
    ]
    
    result = engine.analyze_claim(claim_facts, policy_citations, regulatory_citations)
    
    assert result["issue_category"] == "ROOM_RENT_DEDUCTION"
    assert result["confidence"] > 0.8
    assert result["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
    assert "details" in result
    assert result["details"]["savings_potential"] > 0
    assert len(result["supporting_facts"]) >= 2
