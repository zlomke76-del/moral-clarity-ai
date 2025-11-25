from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
import io
import base64

app = FastAPI()

class Payload(BaseModel):
    type: str
    title: str
    content: str

@app.post("/api/generate")
def generate(payload: Payload):
    try:
        buf = io.BytesIO()

        if payload.type == "pdf":
            styles = getSampleStyleSheet()
            doc = SimpleDocTemplate(buf, pagesize=letter)
            story = [Paragraph(payload.content.replace("\n", "<br/>"), styles["Normal"])]
            doc.build(story)

        elif payload.type == "docx":
            from docx import Document
            document = Document()
            for line in payload.content.split("\n"):
                document.add_paragraph(line)
            document.save(buf)

        elif payload.type == "csv":
            csv_bytes = payload.content.encode("utf-8")
            buf.write(csv_bytes)

        else:
            raise HTTPException(status_code=400, detail="Unsupported type")

        buf.seek(0)
        return base64.b64encode(buf.read()).decode()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
