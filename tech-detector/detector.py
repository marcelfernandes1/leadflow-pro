"""
Tech stack detector using regex pattern matching.
"""
import re
from typing import List, Dict, Optional
from signatures import TECH_SIGNATURES, CATEGORY_PRIORITY


def detect_technologies(
    html: str,
    headers: Optional[Dict[str, str]] = None
) -> List[Dict]:
    """
    Detect technologies from HTML content and response headers.

    Args:
        html: The HTML content of the page
        headers: Optional dict of HTTP response headers

    Returns:
        List of detected technologies with name, category, and confidence
    """
    detected = []
    seen = set()
    headers = headers or {}

    # Normalize headers to lowercase for matching
    headers_lower = {k.lower(): v.lower() for k, v in headers.items()}
    headers_str = " ".join(f"{k}: {v}" for k, v in headers_lower.items())

    for sig in TECH_SIGNATURES:
        if sig["name"] in seen:
            continue

        match_count = 0
        matched_patterns = []

        # Check HTML patterns
        for pattern in sig["patterns"]:
            try:
                if re.search(pattern, html, re.IGNORECASE):
                    match_count += 1
                    matched_patterns.append(pattern)
            except re.error:
                continue

        # Check header patterns
        for header_pattern in sig.get("headers", []):
            try:
                if re.search(header_pattern, headers_str, re.IGNORECASE):
                    match_count += 1
                    matched_patterns.append(f"header:{header_pattern}")
            except re.error:
                continue

        if match_count > 0:
            seen.add(sig["name"])

            # Calculate confidence based on number of matches
            if match_count >= 3:
                confidence = "high"
                confidence_score = 0.95
            elif match_count >= 2:
                confidence = "high"
                confidence_score = 0.85
            else:
                confidence = "medium"
                confidence_score = 0.70

            detected.append({
                "name": sig["name"],
                "category": sig["category"],
                "confidence": confidence,
                "confidence_score": confidence_score,
                "match_count": match_count,
                "patterns_matched": matched_patterns[:3],  # Limit for brevity
            })

    # Sort by category priority, then by confidence
    detected.sort(key=lambda x: (
        CATEGORY_PRIORITY.get(x["category"], 99),
        -x["confidence_score"]
    ))

    return detected


def analyze_tech_gaps(detected: List[Dict]) -> Dict:
    """
    Analyze what essential technologies are missing.

    Args:
        detected: List of detected technologies

    Returns:
        Analysis dict with missing categories and opportunities
    """
    detected_categories = {tech["category"] for tech in detected}

    # Essential categories for most businesses
    essential = {"CRM", "Analytics", "Email Marketing"}
    growth_indicators = {"Marketing Automation", "Chat", "A/B Testing"}

    missing_essential = essential - detected_categories
    missing_growth = growth_indicators - detected_categories

    opportunities = []

    # Map missing categories to service opportunities
    opportunity_map = {
        "CRM": {
            "service": "CRM Implementation",
            "pitch": "streamline sales process and close more deals",
            "monthly_value": 150,
        },
        "Analytics": {
            "service": "Analytics Setup",
            "pitch": "understand customer behavior and optimize conversions",
            "monthly_value": 50,
        },
        "Email Marketing": {
            "service": "Email Marketing",
            "pitch": "nurture leads and drive repeat purchases",
            "monthly_value": 75,
        },
        "Marketing Automation": {
            "service": "Marketing Automation",
            "pitch": "automate campaigns and scale marketing efforts",
            "monthly_value": 500,
        },
        "Chat": {
            "service": "Live Chat Implementation",
            "pitch": "provide instant support and capture more leads",
            "monthly_value": 60,
        },
        "A/B Testing": {
            "service": "Conversion Optimization",
            "pitch": "increase conversions through data-driven testing",
            "monthly_value": 200,
        },
    }

    for category in missing_essential:
        if category in opportunity_map:
            opportunities.append({
                **opportunity_map[category],
                "category": category,
                "priority": "high",
            })

    for category in missing_growth:
        if category in opportunity_map:
            opportunities.append({
                **opportunity_map[category],
                "category": category,
                "priority": "medium",
            })

    # Sort by monthly value descending
    opportunities.sort(key=lambda x: -x["monthly_value"])

    return {
        "detected_categories": list(detected_categories),
        "missing_essential": list(missing_essential),
        "missing_growth": list(missing_growth),
        "opportunities": opportunities,
        "gap_score": len(missing_essential) * 15 + len(missing_growth) * 5,
    }


def get_tech_summary(detected: List[Dict]) -> Dict:
    """
    Generate a summary of detected technologies.

    Args:
        detected: List of detected technologies

    Returns:
        Summary dict grouped by category
    """
    by_category = {}

    for tech in detected:
        cat = tech["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append({
            "name": tech["name"],
            "confidence": tech["confidence"],
        })

    return {
        "total_detected": len(detected),
        "categories_found": len(by_category),
        "by_category": by_category,
        "high_confidence_count": sum(1 for t in detected if t["confidence"] == "high"),
    }
