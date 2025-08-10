from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from .api import endpoints
import markdown2

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_class=JSONResponse)
async def health_check():
    return {"status": "ok"}

app.include_router(endpoints.router)

@app.get("/", response_class=HTMLResponse)
def read_root():
    """Reads the API documentation from a markdown file and returns it as a styled HTML page."""
    with open("api_docs.md", "r") as f:
        md_content = f.read()

    html_content = markdown2.markdown(
        md_content,
        extras=["fenced-code-blocks", "tables", "styling"]
    )

    # Add some professional CSS styling
    styled_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>SkillSync AI (API Docs)</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; line-height: 1.6; color: #333; max-width: 960px; margin: 20px auto; padding: 0 20px; }}
            h1, h2, h3 {{ color: #2c3e50; }}
            h1 {{ border-bottom: 2px solid #2c3e50; padding-bottom: 10px; }}
            h2 {{ border-bottom: 1px solid #eaecef; padding-bottom: 5px; }}
            code {{ background-color: #f6f8fa; padding: .2em .4em; margin: 0; font-size: 85%; border-radius: 3px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; }}
            pre code {{ display: block; padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #f6f8fa; border-radius: 3px; }}
            .markdown-body table {{ border-collapse: collapse; }}
            .markdown-body th, .markdown-body td {{ border: 1px solid #dfe2e5; padding: 6px 13px; }}
        </style>
    </head>
    <body class="markdown-body">
        {html_content}
    </body>
    </html>
    """
    return HTMLResponse(content=styled_html)