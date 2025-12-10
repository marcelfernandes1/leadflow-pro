"""
Scrapy spider for detecting website technology stacks.
"""
import sys
import os
from datetime import datetime
from urllib.parse import urlparse

import scrapy
from scrapy import signals
from scrapy.http import Response

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from detector import detect_technologies, analyze_tech_gaps, get_tech_summary
from tech_detector.items import TechDetectionItem


class TechSpider(scrapy.Spider):
    """Spider that crawls websites and detects their technology stack."""

    name = "tech"
    custom_settings = {
        "CONCURRENT_REQUESTS": 8,
        "DOWNLOAD_TIMEOUT": 15,
    }

    def __init__(self, urls=None, *args, **kwargs):
        """
        Initialize spider with URLs to crawl.

        Args:
            urls: Comma-separated list of URLs or single URL
        """
        super().__init__(*args, **kwargs)
        self.results = []

        if urls:
            self.start_urls = [
                self.normalize_url(url.strip())
                for url in urls.split(",")
                if url.strip()
            ]
        else:
            self.start_urls = []

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        """Connect spider signals."""
        spider = super().from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        """Called when spider finishes."""
        self.logger.info(f"Spider closed. Processed {len(self.results)} URLs.")

    @staticmethod
    def normalize_url(url: str) -> str:
        """Ensure URL has a scheme."""
        if not url.startswith(("http://", "https://")):
            url = f"https://{url}"
        return url

    def start_requests(self):
        """Generate initial requests for all URLs."""
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                callback=self.parse,
                errback=self.handle_error,
                meta={
                    "original_url": url,
                    "dont_redirect": False,
                    "handle_httpstatus_list": [301, 302, 303, 307, 308, 403, 404, 500],
                },
            )

    def parse(self, response: Response):
        """
        Parse response and detect technologies.

        Args:
            response: Scrapy Response object
        """
        original_url = response.meta.get("original_url", response.url)
        crawl_time = datetime.utcnow().isoformat()

        # Extract headers as dict
        headers = {}
        for key, values in response.headers.items():
            try:
                headers[key.decode("utf-8")] = values[0].decode("utf-8")
            except (UnicodeDecodeError, AttributeError):
                pass

        # Get HTML content
        html = response.text if hasattr(response, "text") else ""

        # Detect technologies
        technologies = detect_technologies(html, headers)

        # Analyze gaps
        gap_analysis = analyze_tech_gaps(technologies)

        # Get summary
        tech_summary = get_tech_summary(technologies)

        item = TechDetectionItem(
            url=original_url,
            final_url=response.url,
            status_code=response.status,
            technologies=technologies,
            tech_summary=tech_summary,
            gap_analysis=gap_analysis,
            response_headers=headers,
            crawl_time=crawl_time,
            error=None,
        )

        self.results.append(dict(item))
        yield item

    def handle_error(self, failure):
        """Handle request failures."""
        request = failure.request
        original_url = request.meta.get("original_url", request.url)

        item = TechDetectionItem(
            url=original_url,
            final_url=None,
            status_code=None,
            technologies=[],
            tech_summary={"total_detected": 0, "categories_found": 0, "by_category": {}},
            gap_analysis={
                "detected_categories": [],
                "missing_essential": ["CRM", "Analytics", "Email Marketing"],
                "missing_growth": ["Marketing Automation", "Chat", "A/B Testing"],
                "opportunities": [],
                "gap_score": 0,
            },
            response_headers={},
            crawl_time=datetime.utcnow().isoformat(),
            error=str(failure.value),
        )

        self.results.append(dict(item))
        yield item
