import pytest
from app.retrieval import RetrievalService, IRDAI_REGULATIONS, POLICY_TEMPLATES

def test_retrieval_service_initialization():
    service = RetrievalService()
    assert service is not None

def test_retrieval_citations_star_health():
    service = RetrievalService()
    result = service.retrieve_citations("Star Health", "room rent capping deduction applied")
    
    assert "policy_citations" in result
    assert "regulatory_citations" in result
    assert len(result["policy_citations"]) > 0
    assert len(result["regulatory_citations"]) > 0
    
    # Check IRDAI regulations
    reg_titles = [r["authority"] for r in result["regulatory_citations"]]
    assert "IRDAI" in reg_titles

def test_retrieval_regulations_content():
    service = RetrievalService()
    result = service.retrieve_citations("General", "proportionate deduction on pharmacy and implants")
    
    assert len(result["regulatory_citations"]) > 0
    clause_numbers = [r["clause_number"] for r in result["regulatory_citations"]]
    assert "6.1" in clause_numbers or "12" in clause_numbers
