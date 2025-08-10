# To-Do List for SkillSync AI - Enhancing Dynamism

This document outlines areas of the SkillSync AI application that currently rely on static or hardcoded data, and suggests paths for making them more dynamic and reflective of real-world changes.

## 1. Job Data for Rwanda

**Current State:**
The job data for Rwanda is currently hardcoded in `skillsyncAPI/app/database.py`. This means job listings are static and do not update unless the file is manually edited and the backend is redeployed.

**Task:** Implement a dynamic solution for sourcing job data.

**Approaches to Consider:**

*   **Real-time API Integration:**
    *   **Research:** Identify job boards, recruitment platforms, or government labor market data sources in Rwanda that offer APIs.
    *   **Integration:** Develop modules to connect to these APIs, handle authentication (API keys), and parse incoming job data into a consistent format.
    *   **Challenges:** API availability, rate limits, data consistency, and potential costs.

*   **Scheduled Data Pulls (Weekly/Daily):**
    *   **Strategy:** If real-time APIs are not feasible or too costly, implement a scheduled process (e.g., a cron job, a separate microservice) to pull data from available sources at regular intervals.
    *   **Sources:** This could still involve APIs, or more robust web scraping solutions if direct APIs are unavailable.
    *   **Storage:** Store the pulled data in a persistent database (e.g., PostgreSQL, MongoDB) that your `skillsyncAPI` can query.

*   **Web Scraping (Least Recommended, but an option):**
    *   **Tools:** Utilize libraries like Beautiful Soup, Scrapy, or Playwright to extract job data directly from relevant Rwandan job websites.
    *   **Challenges:** Highly susceptible to website layout changes (requiring frequent maintenance), potential legal/ethical issues, and can be resource-intensive.
    *   **Consideration:** Only as a last resort if API access is impossible.

**Action Items:**
- [ ] Research available job data APIs for Rwanda.
- [ ] Evaluate the feasibility and cost of API integration.
- [ ] If APIs are not viable, research web scraping targets and tools.
- [ ] Design a data storage solution (e.g., database schema for MongoDB, PostgreSQL, etc.) for dynamic job data.
- [ ] Implement data ingestion logic (API client or scraper).
- [ ] Integrate dynamic job data into `skillsyncAPI` (replace `database.py` usage).

---

## 2. Other Non-Dynamic Aspects (To be identified)

This section will be expanded as other static or hardcoded elements are identified during development.

*   **Market Insights Data:** While currently AI-generated, the *basis* for these insights could potentially be augmented with real-time economic indicators or industry reports if available via APIs.
*   **Skill Definitions:** The list of skills used for analysis might be static. Consider a mechanism to update or expand this list dynamically based on market trends.
*   **Learning Resources:** The `RESOURCES` dictionary in `database.py` is static. A more dynamic approach could involve integrating with online course platforms or educational content APIs.
