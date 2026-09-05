import pytest
from app.extraction import ExtractionService

def test_classify_document():
    service = ExtractionService()
    
    rejection_text = "We regret to inform you that your claim has been rejected due to room rent capping deduction."
    doc_type = service.classify_document(rejection_text, "rejection_notice.pdf")
    assert doc_type == "REJECTION_LETTER"
    
    discharge_text = "Discharge Summary: Patient admitted on 2024-01-10 and discharged on 2024-01-15 after treatment."
    doc_type2 = service.classify_document(discharge_text, "discharge_summary.pdf")
    assert doc_type2 == "DISCHARGE_SUMMARY"

def test_extract_fields():
    service = ExtractionService()
    sample_text = """
    Star Health Insurance Co. Ltd.
    Claim Number: CLM-123456
    Policy Number: POL-987654
    Claim Amount Claimed: Rs. 150000.00
    Amount Paid: Rs. 90000.00
    Amount Deducted: Rs. 60000.00
    """
    
    fields = service.extract_fields(sample_text)
    assert "insurer_name" in fields or "claim_number" in fields or "amount_claimed" in fields

def test_scan_for_pii():
    service = ExtractionService()
    
    clean_text = "Patient was treated for dengue fever in Apollo Hospital."
    findings = service.scan_for_pii(clean_text)
    assert len(findings) == 0
    
    pii_text = "Patient Aadhaar: 1234 5678 9012, PAN: ABCDE1234F"
    findings2 = service.scan_for_pii(pii_text)
    assert len(findings2) > 0
