"""
Technology signatures for detecting tech stacks from HTML.
Each signature contains patterns that identify specific technologies.
"""

TECH_SIGNATURES = [
    # ============== CRM ==============
    {
        "name": "HubSpot",
        "category": "CRM",
        "patterns": [
            r"js\.hsforms\.net",
            r"js\.hs-scripts\.com",
            r"js\.hs-analytics\.net",
            r"js\.hubspot\.com",
            r"hbspt\.forms\.create",
            r"_hsp\s*=",
            r"hubspot",
        ],
        "headers": ["x-hs-hub-id"],
    },
    {
        "name": "Salesforce",
        "category": "CRM",
        "patterns": [
            r"salesforce\.com",
            r"force\.com",
            r"salesforceliveagent\.com",
            r"sfdc\.com",
        ],
        "headers": [],
    },
    {
        "name": "Pipedrive",
        "category": "CRM",
        "patterns": [
            r"pipedrive\.com",
            r"leadbooster-chat\.pipedrive",
            r"pipedriveWebForms",
        ],
        "headers": [],
    },
    {
        "name": "Zoho CRM",
        "category": "CRM",
        "patterns": [
            r"zoho\.com/crm",
            r"salesiq\.zoho",
            r"zohocrm",
            r"zohopublic\.com",
        ],
        "headers": [],
    },
    {
        "name": "Freshsales",
        "category": "CRM",
        "patterns": [
            r"freshsales\.io",
            r"freshworks\.com",
            r"myfreshworks\.com",
        ],
        "headers": [],
    },
    {
        "name": "Copper",
        "category": "CRM",
        "patterns": [
            r"copper\.com",
            r"prosperworks\.com",
        ],
        "headers": [],
    },

    # ============== Analytics ==============
    {
        "name": "Google Analytics",
        "category": "Analytics",
        "patterns": [
            r"google-analytics\.com/analytics",
            r"googletagmanager\.com/gtag",
            r"gtag\s*\(\s*['\"]config['\"]",
            r"UA-\d{4,10}-\d{1,4}",
            r"G-[A-Z0-9]{10,}",
            r"ga\s*\(\s*['\"]create['\"]",
            r"GoogleAnalyticsObject",
        ],
        "headers": [],
    },
    {
        "name": "Google Tag Manager",
        "category": "Analytics",
        "patterns": [
            r"googletagmanager\.com/gtm\.js",
            r"GTM-[A-Z0-9]{6,}",
            r"dataLayer\.push",
        ],
        "headers": [],
    },
    {
        "name": "Hotjar",
        "category": "Analytics",
        "patterns": [
            r"static\.hotjar\.com",
            r"hotjar\.com",
            r"_hjSettings",
            r"_hjid",
        ],
        "headers": [],
    },
    {
        "name": "Mixpanel",
        "category": "Analytics",
        "patterns": [
            r"mixpanel\.com",
            r"cdn\.mxpnl\.com",
            r"mixpanel\.init",
        ],
        "headers": [],
    },
    {
        "name": "Amplitude",
        "category": "Analytics",
        "patterns": [
            r"amplitude\.com",
            r"cdn\.amplitude\.com",
            r"amplitude\.getInstance",
        ],
        "headers": [],
    },
    {
        "name": "Segment",
        "category": "Analytics",
        "patterns": [
            r"cdn\.segment\.com",
            r"segment\.com/analytics",
            r"analytics\.load",
            r"analytics\.track",
        ],
        "headers": [],
    },
    {
        "name": "Heap",
        "category": "Analytics",
        "patterns": [
            r"heap\.io",
            r"heapanalytics\.com",
            r"heap\.load",
        ],
        "headers": [],
    },
    {
        "name": "Plausible",
        "category": "Analytics",
        "patterns": [
            r"plausible\.io",
            r"plausible\.js",
        ],
        "headers": [],
    },
    {
        "name": "Fathom",
        "category": "Analytics",
        "patterns": [
            r"usefathom\.com",
            r"cdn\.usefathom\.com",
        ],
        "headers": [],
    },
    {
        "name": "PostHog",
        "category": "Analytics",
        "patterns": [
            r"posthog\.com",
            r"app\.posthog\.com",
            r"posthog\.init",
        ],
        "headers": [],
    },
    {
        "name": "FullStory",
        "category": "Analytics",
        "patterns": [
            r"fullstory\.com",
            r"fs\.com",
            r"FullStory\.init",
        ],
        "headers": [],
    },
    {
        "name": "Lucky Orange",
        "category": "Analytics",
        "patterns": [
            r"luckyorange\.com",
            r"d10lpsik1i8c69\.cloudfront\.net",
        ],
        "headers": [],
    },
    {
        "name": "Clarity",
        "category": "Analytics",
        "patterns": [
            r"clarity\.ms",
            r"microsoft\.com/clarity",
        ],
        "headers": [],
    },

    # ============== Chat/Support ==============
    {
        "name": "Intercom",
        "category": "Chat",
        "patterns": [
            r"widget\.intercom\.io",
            r"intercom\.com",
            r"intercomSettings",
            r"Intercom\s*\(",
        ],
        "headers": [],
    },
    {
        "name": "Zendesk",
        "category": "Chat",
        "patterns": [
            r"zdassets\.com",
            r"zendesk\.com",
            r"ze-snippet",
            r"zESettings",
        ],
        "headers": [],
    },
    {
        "name": "Drift",
        "category": "Chat",
        "patterns": [
            r"js\.driftt\.com",
            r"drift\.com",
            r"drift\.load",
        ],
        "headers": [],
    },
    {
        "name": "Crisp",
        "category": "Chat",
        "patterns": [
            r"client\.crisp\.chat",
            r"crisp\.chat",
            r"\$crisp",
            r"CRISP_WEBSITE_ID",
        ],
        "headers": [],
    },
    {
        "name": "Tidio",
        "category": "Chat",
        "patterns": [
            r"tidio\.co",
            r"code\.tidio\.co",
            r"tidioChatCode",
        ],
        "headers": [],
    },
    {
        "name": "LiveChat",
        "category": "Chat",
        "patterns": [
            r"livechatinc\.com",
            r"cdn\.livechatinc\.com",
            r"__lc\s*=",
        ],
        "headers": [],
    },
    {
        "name": "Tawk.to",
        "category": "Chat",
        "patterns": [
            r"tawk\.to",
            r"embed\.tawk\.to",
            r"Tawk_API",
        ],
        "headers": [],
    },
    {
        "name": "Freshdesk",
        "category": "Chat",
        "patterns": [
            r"freshdesk\.com",
            r"widget\.freshworks\.com",
            r"FreshworksWidget",
        ],
        "headers": [],
    },
    {
        "name": "HelpScout",
        "category": "Chat",
        "patterns": [
            r"beacon-v2\.helpscout\.net",
            r"helpscout\.net",
            r"Beacon\s*\(",
        ],
        "headers": [],
    },
    {
        "name": "Olark",
        "category": "Chat",
        "patterns": [
            r"olark\.com",
            r"static\.olark\.com",
            r"olark\.identify",
        ],
        "headers": [],
    },

    # ============== Email Marketing ==============
    {
        "name": "Mailchimp",
        "category": "Email Marketing",
        "patterns": [
            r"mailchimp\.com",
            r"list-manage\.com",
            r"chimpstatic\.com",
            r"mc\.us\d+\.list-manage",
        ],
        "headers": [],
    },
    {
        "name": "Klaviyo",
        "category": "Email Marketing",
        "patterns": [
            r"static\.klaviyo\.com",
            r"klaviyo\.com",
            r"_learnq",
        ],
        "headers": [],
    },
    {
        "name": "SendGrid",
        "category": "Email Marketing",
        "patterns": [
            r"sendgrid\.com",
            r"sendgrid\.net",
        ],
        "headers": [],
    },
    {
        "name": "Constant Contact",
        "category": "Email Marketing",
        "patterns": [
            r"constantcontact\.com",
            r"ctctcdn\.com",
        ],
        "headers": [],
    },
    {
        "name": "ConvertKit",
        "category": "Email Marketing",
        "patterns": [
            r"convertkit\.com",
            r"convertkit-mail",
            r"ck\.page",
        ],
        "headers": [],
    },
    {
        "name": "ActiveCampaign",
        "category": "Email Marketing",
        "patterns": [
            r"activecampaign\.com",
            r"trackcmp\.net",
            r"activehosted\.com",
        ],
        "headers": [],
    },
    {
        "name": "Drip",
        "category": "Email Marketing",
        "patterns": [
            r"getdrip\.com",
            r"drip\.com",
            r"_dcq",
        ],
        "headers": [],
    },
    {
        "name": "AWeber",
        "category": "Email Marketing",
        "patterns": [
            r"aweber\.com",
            r"forms\.aweber\.com",
        ],
        "headers": [],
    },
    {
        "name": "GetResponse",
        "category": "Email Marketing",
        "patterns": [
            r"getresponse\.com",
            r"gr8\.com",
        ],
        "headers": [],
    },
    {
        "name": "Sendinblue",
        "category": "Email Marketing",
        "patterns": [
            r"sendinblue\.com",
            r"sibautomation\.com",
            r"brevo\.com",
        ],
        "headers": [],
    },

    # ============== Marketing Automation ==============
    {
        "name": "Marketo",
        "category": "Marketing Automation",
        "patterns": [
            r"marketo\.com",
            r"mktoresp\.com",
            r"marketo\.net",
            r"munchkin",
        ],
        "headers": [],
    },
    {
        "name": "Pardot",
        "category": "Marketing Automation",
        "patterns": [
            r"pardot\.com",
            r"pi\.pardot\.com",
            r"go\.pardot\.com",
        ],
        "headers": [],
    },
    {
        "name": "Eloqua",
        "category": "Marketing Automation",
        "patterns": [
            r"eloqua\.com",
            r"elqcfg",
            r"elqtrack",
        ],
        "headers": [],
    },
    {
        "name": "HubSpot Marketing",
        "category": "Marketing Automation",
        "patterns": [
            r"hbspt\.forms",
            r"hs-scripts\.com",
            r"forms\.hubspot\.com",
        ],
        "headers": [],
    },

    # ============== E-commerce ==============
    {
        "name": "Shopify",
        "category": "Ecommerce",
        "patterns": [
            r"cdn\.shopify\.com",
            r"myshopify\.com",
            r"Shopify\.theme",
            r"shopify-checkout",
            r"/cart\.js",
        ],
        "headers": ["x-shopify-stage"],
    },
    {
        "name": "WooCommerce",
        "category": "Ecommerce",
        "patterns": [
            r"woocommerce",
            r"wc-ajax",
            r"wp-content.*woocommerce",
            r"wc_add_to_cart",
        ],
        "headers": [],
    },
    {
        "name": "BigCommerce",
        "category": "Ecommerce",
        "patterns": [
            r"bigcommerce\.com",
            r"cdn\d+\.bigcommerce\.com",
            r"bigcommerce/",
        ],
        "headers": [],
    },
    {
        "name": "Magento",
        "category": "Ecommerce",
        "patterns": [
            r"magento",
            r"mage/",
            r"Mage\.Cookies",
            r"static/version",
        ],
        "headers": ["x-magento-"],
    },
    {
        "name": "PrestaShop",
        "category": "Ecommerce",
        "patterns": [
            r"prestashop",
            r"presta",
            r"/modules/ps_",
        ],
        "headers": [],
    },
    {
        "name": "Squarespace Commerce",
        "category": "Ecommerce",
        "patterns": [
            r"squarespace.*commerce",
            r"static\d*\.squarespace\.com.*commerce",
        ],
        "headers": [],
    },
    {
        "name": "Stripe",
        "category": "Ecommerce",
        "patterns": [
            r"js\.stripe\.com",
            r"stripe\.com",
            r"Stripe\s*\(",
        ],
        "headers": [],
    },
    {
        "name": "PayPal",
        "category": "Ecommerce",
        "patterns": [
            r"paypal\.com/sdk",
            r"paypalobjects\.com",
            r"paypal-button",
        ],
        "headers": [],
    },

    # ============== CMS ==============
    {
        "name": "WordPress",
        "category": "CMS",
        "patterns": [
            r"wp-content",
            r"wp-includes",
            r"wp-json",
            r'<meta[^>]*generator[^>]*WordPress',
            r"wordpress\.org",
        ],
        "headers": ["x-powered-by: wordpress"],
    },
    {
        "name": "Webflow",
        "category": "CMS",
        "patterns": [
            r"webflow\.com",
            r"assets\.website-files\.com",
            r'<meta[^>]*generator[^>]*Webflow',
            r"wf-page",
        ],
        "headers": [],
    },
    {
        "name": "Wix",
        "category": "CMS",
        "patterns": [
            r"wix\.com",
            r"wixstatic\.com",
            r"parastorage\.com",
            r"static\.wixstatic\.com",
        ],
        "headers": ["x-wix-"],
    },
    {
        "name": "Squarespace",
        "category": "CMS",
        "patterns": [
            r"squarespace\.com",
            r"static\d*\.squarespace\.com",
            r"squarespace-cdn\.com",
        ],
        "headers": [],
    },
    {
        "name": "Drupal",
        "category": "CMS",
        "patterns": [
            r"drupal",
            r'<meta[^>]*generator[^>]*Drupal',
            r"sites/default/files",
            r"Drupal\.settings",
        ],
        "headers": ["x-generator: drupal", "x-drupal-"],
    },
    {
        "name": "Joomla",
        "category": "CMS",
        "patterns": [
            r"joomla",
            r'<meta[^>]*generator[^>]*Joomla',
            r"/media/jui/",
            r"/components/com_",
        ],
        "headers": [],
    },
    {
        "name": "Ghost",
        "category": "CMS",
        "patterns": [
            r"ghost\.io",
            r"ghost\.org",
            r'<meta[^>]*generator[^>]*Ghost',
        ],
        "headers": ["x-ghost-"],
    },
    {
        "name": "Contentful",
        "category": "CMS",
        "patterns": [
            r"contentful\.com",
            r"ctfassets\.net",
            r"images\.ctfassets\.net",
        ],
        "headers": [],
    },
    {
        "name": "Sanity",
        "category": "CMS",
        "patterns": [
            r"sanity\.io",
            r"cdn\.sanity\.io",
        ],
        "headers": [],
    },
    {
        "name": "Framer",
        "category": "CMS",
        "patterns": [
            r"framer\.com",
            r"framerusercontent\.com",
            r"framer-motion",
        ],
        "headers": [],
    },

    # ============== Advertising ==============
    {
        "name": "Google Ads",
        "category": "Advertising",
        "patterns": [
            r"googleads\.g\.doubleclick\.net",
            r"googleadservices\.com",
            r"googlesyndication\.com",
            r"adsbygoogle",
            r"AW-\d+",
        ],
        "headers": [],
    },
    {
        "name": "Facebook Pixel",
        "category": "Advertising",
        "patterns": [
            r"connect\.facebook\.net",
            r"fbevents\.js",
            r"fbq\s*\(",
            r"facebook\.com/tr",
        ],
        "headers": [],
    },
    {
        "name": "LinkedIn Insight",
        "category": "Advertising",
        "patterns": [
            r"snap\.licdn\.com",
            r"linkedin\.com/insight",
            r"_linkedin_partner_id",
        ],
        "headers": [],
    },
    {
        "name": "Twitter Pixel",
        "category": "Advertising",
        "patterns": [
            r"static\.ads-twitter\.com",
            r"analytics\.twitter\.com",
            r"twq\s*\(",
        ],
        "headers": [],
    },
    {
        "name": "TikTok Pixel",
        "category": "Advertising",
        "patterns": [
            r"analytics\.tiktok\.com",
            r"tiktok\.com/i18n/pixel",
            r"ttq\.load",
        ],
        "headers": [],
    },
    {
        "name": "Pinterest Tag",
        "category": "Advertising",
        "patterns": [
            r"pintrk",
            r"pinterest\.com/ct\.html",
            r"s\.pinimg\.com",
        ],
        "headers": [],
    },
    {
        "name": "Reddit Pixel",
        "category": "Advertising",
        "patterns": [
            r"redditmedia\.com",
            r"reddit\.com/pixel",
            r"rdt\s*\(",
        ],
        "headers": [],
    },
    {
        "name": "Bing Ads",
        "category": "Advertising",
        "patterns": [
            r"bat\.bing\.com",
            r"UET",
        ],
        "headers": [],
    },
    {
        "name": "Snapchat Pixel",
        "category": "Advertising",
        "patterns": [
            r"sc-static\.net/scevent",
            r"snapkit\.com",
        ],
        "headers": [],
    },

    # ============== A/B Testing ==============
    {
        "name": "Optimizely",
        "category": "A/B Testing",
        "patterns": [
            r"optimizely\.com",
            r"cdn\.optimizely\.com",
            r"optimizelySdk",
        ],
        "headers": [],
    },
    {
        "name": "VWO",
        "category": "A/B Testing",
        "patterns": [
            r"vwo\.com",
            r"visualwebsiteoptimizer\.com",
            r"_vwo",
        ],
        "headers": [],
    },
    {
        "name": "Google Optimize",
        "category": "A/B Testing",
        "patterns": [
            r"optimize\.google\.com",
            r"googleoptimize\.com",
        ],
        "headers": [],
    },
    {
        "name": "AB Tasty",
        "category": "A/B Testing",
        "patterns": [
            r"abtasty\.com",
            r"try\.abtasty\.com",
        ],
        "headers": [],
    },
    {
        "name": "LaunchDarkly",
        "category": "A/B Testing",
        "patterns": [
            r"launchdarkly\.com",
            r"clientsdk\.launchdarkly",
        ],
        "headers": [],
    },

    # ============== Forms/Surveys ==============
    {
        "name": "Typeform",
        "category": "Forms",
        "patterns": [
            r"typeform\.com",
            r"embed\.typeform\.com",
        ],
        "headers": [],
    },
    {
        "name": "JotForm",
        "category": "Forms",
        "patterns": [
            r"jotform\.com",
            r"cdn\.jotfor\.ms",
        ],
        "headers": [],
    },
    {
        "name": "SurveyMonkey",
        "category": "Forms",
        "patterns": [
            r"surveymonkey\.com",
            r"widget\.surveymonkey\.com",
        ],
        "headers": [],
    },
    {
        "name": "Google Forms",
        "category": "Forms",
        "patterns": [
            r"docs\.google\.com/forms",
        ],
        "headers": [],
    },

    # ============== Scheduling ==============
    {
        "name": "Calendly",
        "category": "Scheduling",
        "patterns": [
            r"calendly\.com",
            r"assets\.calendly\.com",
        ],
        "headers": [],
    },
    {
        "name": "Acuity Scheduling",
        "category": "Scheduling",
        "patterns": [
            r"acuityscheduling\.com",
            r"squareup\.com/appointments",
        ],
        "headers": [],
    },
    {
        "name": "Cal.com",
        "category": "Scheduling",
        "patterns": [
            r"cal\.com",
            r"app\.cal\.com",
        ],
        "headers": [],
    },

    # ============== CDN/Hosting ==============
    {
        "name": "Cloudflare",
        "category": "CDN",
        "patterns": [
            r"cdnjs\.cloudflare\.com",
            r"__cf_bm",
            r"cloudflare",
        ],
        "headers": ["cf-ray", "cf-cache-status", "server: cloudflare"],
    },
    {
        "name": "Fastly",
        "category": "CDN",
        "patterns": [
            r"fastly\.net",
        ],
        "headers": ["x-served-by", "x-cache: hit", "fastly"],
    },
    {
        "name": "Akamai",
        "category": "CDN",
        "patterns": [
            r"akamai",
            r"akamaized\.net",
        ],
        "headers": ["x-akamai-"],
    },
    {
        "name": "AWS CloudFront",
        "category": "CDN",
        "patterns": [
            r"cloudfront\.net",
        ],
        "headers": ["x-amz-cf-"],
    },
    {
        "name": "Vercel",
        "category": "Hosting",
        "patterns": [
            r"vercel\.app",
            r"vercel\.com",
            r"now\.sh",
        ],
        "headers": ["x-vercel-"],
    },
    {
        "name": "Netlify",
        "category": "Hosting",
        "patterns": [
            r"netlify\.app",
            r"netlify\.com",
        ],
        "headers": ["x-nf-"],
    },

    # ============== Frameworks (bonus detection) ==============
    {
        "name": "React",
        "category": "Framework",
        "patterns": [
            r"react",
            r"__REACT_DEVTOOLS",
            r"reactroot",
            r"data-reactroot",
        ],
        "headers": [],
    },
    {
        "name": "Next.js",
        "category": "Framework",
        "patterns": [
            r"_next/static",
            r"__NEXT_DATA__",
            r"next\.js",
        ],
        "headers": ["x-nextjs-"],
    },
    {
        "name": "Vue.js",
        "category": "Framework",
        "patterns": [
            r"vue\.js",
            r"vue\.min\.js",
            r"__vue__",
            r"data-v-",
        ],
        "headers": [],
    },
    {
        "name": "Nuxt.js",
        "category": "Framework",
        "patterns": [
            r"_nuxt/",
            r"__NUXT__",
        ],
        "headers": [],
    },
    {
        "name": "Angular",
        "category": "Framework",
        "patterns": [
            r"ng-version",
            r"angular\.js",
            r"ng-app",
            r"ng-controller",
        ],
        "headers": [],
    },
    {
        "name": "Svelte",
        "category": "Framework",
        "patterns": [
            r"svelte",
            r"__svelte",
        ],
        "headers": [],
    },
    {
        "name": "jQuery",
        "category": "Framework",
        "patterns": [
            r"jquery",
            r"jQuery",
        ],
        "headers": [],
    },
    {
        "name": "Bootstrap",
        "category": "Framework",
        "patterns": [
            r"bootstrap\.min\.css",
            r"bootstrap\.min\.js",
            r"cdn\.jsdelivr\.net.*bootstrap",
        ],
        "headers": [],
    },
    {
        "name": "Tailwind CSS",
        "category": "Framework",
        "patterns": [
            r"tailwindcss",
            r"tailwind\.css",
        ],
        "headers": [],
    },
]

# Categorize technologies by their primary use case
CATEGORY_PRIORITY = {
    "CRM": 1,
    "Marketing Automation": 2,
    "Email Marketing": 3,
    "Chat": 4,
    "Analytics": 5,
    "Advertising": 6,
    "Ecommerce": 7,
    "A/B Testing": 8,
    "CMS": 9,
    "Forms": 10,
    "Scheduling": 11,
    "CDN": 12,
    "Hosting": 13,
    "Framework": 14,
}
