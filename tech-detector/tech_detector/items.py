"""
Scrapy items for tech detection results.
"""
import scrapy


class TechDetectionItem(scrapy.Item):
    """Item representing tech detection results for a URL."""

    url = scrapy.Field()
    final_url = scrapy.Field()  # After redirects
    status_code = scrapy.Field()
    technologies = scrapy.Field()
    tech_summary = scrapy.Field()
    gap_analysis = scrapy.Field()
    response_headers = scrapy.Field()
    crawl_time = scrapy.Field()
    error = scrapy.Field()
