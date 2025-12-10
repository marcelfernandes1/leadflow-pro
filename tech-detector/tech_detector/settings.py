"""
Scrapy settings for tech_detector project.
"""

BOT_NAME = "tech_detector"

SPIDER_MODULES = ["tech_detector.spiders"]
NEWSPIDER_MODULE = "tech_detector.spiders"

# Crawl responsibly by identifying yourself
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False  # We need to access pages for tech detection

# Configure maximum concurrent requests
CONCURRENT_REQUESTS = 8

# Configure delays between requests
DOWNLOAD_DELAY = 0.5
RANDOMIZE_DOWNLOAD_DELAY = True

# Disable cookies (reduces fingerprinting)
COOKIES_ENABLED = False

# Configure timeouts
DOWNLOAD_TIMEOUT = 15

# Retry settings
RETRY_TIMES = 2
RETRY_HTTP_CODES = [500, 502, 503, 504, 408, 429]

# Disable Telnet Console
TELNETCONSOLE_ENABLED = False

# Override default request headers
DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

# Enable logging
LOG_LEVEL = "WARNING"

# Disable all extensions we don't need
EXTENSIONS = {
    "scrapy.extensions.corestats.CoreStats": None,
    "scrapy.extensions.telnet.TelnetConsole": None,
}

# Request fingerprinting
REQUEST_FINGERPRINTER_IMPLEMENTATION = "2.7"

# Twisted reactor
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"

# Feed export encoding
FEED_EXPORT_ENCODING = "utf-8"
