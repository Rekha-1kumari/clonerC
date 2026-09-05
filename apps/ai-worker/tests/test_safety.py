import pytest
from app.safety import SafetyGate

def test_safety_gate_pass():
    gate = SafetyGate()
    clean_draft = "Dear Sir, we represent claim amount 150000 under IRDAI guidelines."
    claim_details = {"amount_claimed": 150000.0}
    
    status = gate.verify_draft(clean_draft, claim_details)
    assert status == "PASS"

def test_safety_gate_block_defamatory():
    gate = SafetyGate()
    bad_draft = "The insurer is a scam and fraudulent company. Claim amount 150000."
    claim_details = {"amount_claimed": 150000.0}
    
    status = gate.verify_draft(bad_draft, claim_details)
    assert status == "BLOCK"

def test_safety_gate_warning_guarantee():
    gate = SafetyGate()
    warning_draft = "We will definitely win this case and guarantee a win. Claim amount 150000."
    claim_details = {"amount_claimed": 150000.0}
    
    status = gate.verify_draft(warning_draft, claim_details)
    assert status == "WARNING"

def test_safety_gate_block_pii_leak():
    gate = SafetyGate()
    pii_draft = "Policyholder details: Aadhaar 1234 5678 9012. Claim amount 150000."
    claim_details = {"amount_claimed": 150000.0}
    
    status = gate.verify_draft(pii_draft, claim_details)
    assert status == "BLOCK"
