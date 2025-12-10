"""
Flask API server for tech stack detection.
Exposes endpoints that can be called from the Node.js backend.
"""
import os
import json
import tempfile
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urlparse

from flask import Flask, request, jsonify
from flask_cors import CORS

from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from twisted.internet import reactor, defer
from twisted.internet.threads import deferToThread

# Import our modules
from detector import detect_technologies, analyze_tech_gaps, get_tech_summary
from tech_detector.spiders.tech_spider import TechSpider

app = Flask(__name__)
CORS(app)

# Store for results (in production, use Redis or similar)
results_store: Dict[str, Dict] = {}


def normalize_url(url: str) -> str:
    """Ensure URL has https scheme."""
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
    return url


def fetch_and_detect(url: str) -> Dict:
    """
    Simple synchronous fetch and detect for single URLs.
    Uses requests instead of Scrapy for simplicity in sync context.
    """
    import requests

    normalized_url = normalize_url(url)
    crawl_time = datetime.utcnow().isoformat()

    try:
        response = requests.get(
            normalized_url,
            timeout=15,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
            allow_redirects=True,
            verify=True,
        )

        html = response.text
        headers = dict(response.headers)

        # Detect technologies
        technologies = detect_technologies(html, headers)
        gap_analysis = analyze_tech_gaps(technologies)
        tech_summary = get_tech_summary(technologies)

        return {
            "success": True,
            "url": url,
            "final_url": response.url,
            "status_code": response.status_code,
            "technologies": technologies,
            "tech_summary": tech_summary,
            "gap_analysis": gap_analysis,
            "crawl_time": crawl_time,
            "error": None,
        }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "url": url,
            "final_url": None,
            "status_code": None,
            "technologies": [],
            "tech_summary": {"total_detected": 0, "categories_found": 0, "by_category": {}},
            "gap_analysis": analyze_tech_gaps([]),
            "crawl_time": crawl_time,
            "error": "Request timeout",
        }
    except requests.exceptions.SSLError:
        # Retry without SSL verification
        try:
            response = requests.get(
                normalized_url,
                timeout=15,
                headers={
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                },
                allow_redirects=True,
                verify=False,
            )
            html = response.text
            headers = dict(response.headers)
            technologies = detect_technologies(html, headers)
            gap_analysis = analyze_tech_gaps(technologies)
            tech_summary = get_tech_summary(technologies)

            return {
                "success": True,
                "url": url,
                "final_url": response.url,
                "status_code": response.status_code,
                "technologies": technologies,
                "tech_summary": tech_summary,
                "gap_analysis": gap_analysis,
                "crawl_time": crawl_time,
                "error": None,
            }
        except Exception as e:
            return {
                "success": False,
                "url": url,
                "final_url": None,
                "status_code": None,
                "technologies": [],
                "tech_summary": {"total_detected": 0, "categories_found": 0, "by_category": {}},
                "gap_analysis": analyze_tech_gaps([]),
                "crawl_time": crawl_time,
                "error": f"SSL error: {str(e)}",
            }
    except Exception as e:
        return {
            "success": False,
            "url": url,
            "final_url": None,
            "status_code": None,
            "technologies": [],
            "tech_summary": {"total_detected": 0, "categories_found": 0, "by_category": {}},
            "gap_analysis": analyze_tech_gaps([]),
            "crawl_time": crawl_time,
            "error": str(e),
        }


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "tech-detector",
        "timestamp": datetime.utcnow().isoformat(),
    })


@app.route("/detect", methods=["POST"])
def detect_single():
    """
    Detect tech stack for a single URL.

    Request body:
        {
            "url": "example.com"
        }

    Response:
        {
            "success": true,
            "url": "example.com",
            "technologies": [...],
            "tech_summary": {...},
            "gap_analysis": {...}
        }
    """
    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({"error": "Missing 'url' in request body"}), 400

    url = data["url"].strip()
    if not url:
        return jsonify({"error": "URL cannot be empty"}), 400

    result = fetch_and_detect(url)
    return jsonify(result)


@app.route("/detect/batch", methods=["POST"])
def detect_batch():
    """
    Detect tech stack for multiple URLs.

    Request body:
        {
            "urls": ["example1.com", "example2.com"]
        }

    Response:
        {
            "success": true,
            "results": [...]
        }
    """
    data = request.get_json()

    if not data or "urls" not in data:
        return jsonify({"error": "Missing 'urls' in request body"}), 400

    urls = data["urls"]
    if not isinstance(urls, list):
        return jsonify({"error": "'urls' must be an array"}), 400

    if len(urls) > 50:
        return jsonify({"error": "Maximum 50 URLs per request"}), 400

    results = []
    for url in urls:
        if url and isinstance(url, str):
            result = fetch_and_detect(url.strip())
            results.append(result)

    return jsonify({
        "success": True,
        "total": len(results),
        "results": results,
    })


@app.route("/analyze", methods=["POST"])
def analyze_html():
    """
    Analyze raw HTML content for technologies.
    Useful when you already have the HTML.

    Request body:
        {
            "html": "<html>...</html>",
            "headers": {"optional": "headers"}
        }

    Response:
        {
            "technologies": [...],
            "tech_summary": {...},
            "gap_analysis": {...}
        }
    """
    data = request.get_json()

    if not data or "html" not in data:
        return jsonify({"error": "Missing 'html' in request body"}), 400

    html = data["html"]
    headers = data.get("headers", {})

    technologies = detect_technologies(html, headers)
    gap_analysis = analyze_tech_gaps(technologies)
    tech_summary = get_tech_summary(technologies)

    return jsonify({
        "success": True,
        "technologies": technologies,
        "tech_summary": tech_summary,
        "gap_analysis": gap_analysis,
    })


@app.route("/signatures", methods=["GET"])
def list_signatures():
    """
    List all supported technology signatures.

    Response:
        {
            "total": 100,
            "by_category": {...}
        }
    """
    from signatures import TECH_SIGNATURES, CATEGORY_PRIORITY

    by_category = {}
    for sig in TECH_SIGNATURES:
        cat = sig["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(sig["name"])

    # Sort categories by priority
    sorted_categories = dict(
        sorted(by_category.items(), key=lambda x: CATEGORY_PRIORITY.get(x[0], 99))
    )

    return jsonify({
        "total": len(TECH_SIGNATURES),
        "categories": len(by_category),
        "by_category": sorted_categories,
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("DEBUG", "false").lower() == "true"

    print(f"Starting Tech Detector API on port {port}")
    print(f"Debug mode: {debug}")

    app.run(host="0.0.0.0", port=port, debug=debug)
