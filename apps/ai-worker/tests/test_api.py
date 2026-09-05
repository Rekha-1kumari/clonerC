import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_process_case_endpoint():
    payload = {
        "case_id": "test_case_999",
        "insurer": "Star Health Insurance Co. Ltd.",
        "claim_number": "CLM-STAR-992",
        "amount_claimed": 150000.0,
        "amount_paid": 90000.0,
        "amount_disputed": 60000.0,
        "documents": []
    }
    response = client.post("/process-case", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "issues" in data
    assert "citations" in data
    assert "evidence_checklist" in data
    assert len(data["issues"]) > 0

def test_generate_draft_endpoint():
    payload = {
        "case_id": "test_case_999",
        "language": "en"
    }
    response = client.post("/generate-draft", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "subject" in data
    assert "content" in data
    assert data["safety_status"] in ["PASS", "WARNING", "BLOCK"]

def test_translate_endpoint():
    payload = {
        "text": "GRIEVANCE REPRESENTATION LETTER for Summary of Dispute",
        "subject": "Representation against underpayment",
        "target_language": "hi"
    }
    response = client.post("/translate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "translated_subject" in data
    assert "शिकायत" in data["translated_text"] or len(data["translated_text"]) > 0

def test_generate_pdf_endpoint():
    payload = {
        "subject": "Test PDF Grievance",
        "html_content": "<h2>Test Header</h2><p>This is a test grievance content.</p>"
    }
    response = client.post("/generate-pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF")
