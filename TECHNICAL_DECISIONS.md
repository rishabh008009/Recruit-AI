# Recruit AI - Technical Decisions & Trade-offs

## Overview

This document explains the architectural decisions, trade-offs made during development, failures encountered, and how we resolved them.

---

## 1. Architectural Decisions

### Decision 1: n8n Cloud vs Custom Backend

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Custom Node.js Backend | Full control, no vendor lock-in | More development time, hosting costs |
| AWS Lambda | Scalable, pay-per-use | Complex setup, cold starts |
| **n8n Cloud** ✅ | Visual workflow, fast iteration, built-in integrations | Vendor dependency, limited customization |

**Why n8n?**
- **Speed**: Built complete AI + Email workflow in 2 hours vs 2 days for custom backend
- **Visual debugging**: Can see exactly where data flows and fails
- **Built-in Gmail**: No need to configure SMTP or OAuth separately
- **Webhook support**: Easy integration with frontend

**Trade-off**: We accepted vendor dependency for faster time-to-market.

---

### Decision 2: Supabase vs Firebase vs Custom PostgreSQL

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Firebase | Real-time, Google ecosystem | NoSQL limitations, vendor lock-in |
| Custom PostgreSQL | Full control | DevOps overhead, hosting costs |
| **Supabase** ✅ | PostgreSQL + Auth + Real-time, open source | Newer platform, smaller community |

**Why Supabase?**
- **PostgreSQL**: Relational data model fits recruitment data well
- **Built-in Auth**: Google OAuth + Email auth in minutes
- **Row Level Security**: Users only see their own candidates
- **Open Source**: Can self-host if needed later

**Trade-off**: Chose managed service over self-hosted for faster development.

---

### Decision 3: Gemini 2.0 Flash Lite vs GPT-4 vs Claude

**Options Considered:**
| Model | Pros | Cons |
|-------|------|------|
| GPT-4 | Most capable, well-documented | Expensive ($0.03/1K tokens), rate limits |
| Claude | Good reasoning, longer context | API access complexity |
| **Gemini 2.0 Flash Lite** ✅ | Fast, cheap, good for structured output | Newer, less documentation |

**Why Gemini?**
- **Cost**: ~10x cheaper than GPT-4 for our use case
- **Speed**: Flash Lite optimized for quick responses (<2 seconds)
- **JSON output**: Reliable structured responses for scoring
- **Free tier**: Generous limits for development and testing

**Trade-off**: Chose speed and cost over maximum capability.

---

### Decision 4: Y-Shape Workflow vs Sequential Processing

**Original Design (Failed):**
```
Webhook → Gemini → Gmail → Respond to Webhook
```
**Problem**: Website waited for email to send before getting response (slow + errors blocked everything)

**New Design (Success):**
```
Webhook → Gemini → ┬→ Respond to Webhook (returns score)
                   └→ Gmail (sends email in parallel)
```

**Why Y-Shape?**
- **Parallel processing**: Website gets response immediately
- **Error isolation**: Email failure doesn't block score display
- **Better UX**: User sees result in <3 seconds

**Trade-off**: Email might fail silently, but user experience is prioritized.

---

## 2. Failures Encountered & Solutions

### Failure 1: "Failed to execute 'json' on 'Response'"

**What Happened:**
- Frontend called n8n webhook
- n8n processed but didn't return proper JSON
- Frontend crashed trying to parse empty response

**Root Cause:**
- n8n "Respond to Webhook" node was not connected properly
- Workflow ended at Gmail node instead of response node

**Solution:**
1. Changed workflow to Y-shape (parallel branches)
2. Connected HTTP Request directly to "Respond to Webhook"
3. Set "Respond to Webhook" to return "All Incoming Items"

**Lesson Learned**: Always ensure webhook workflows have a response path.

---

### Failure 2: "Invalid email address (item 0)"

**What Happened:**
- Gmail node failed with invalid email error
- n8n showed error in workflow execution

**Root Cause:**
- Email field was using wrong expression
- Data from webhook is nested under `body` object
- Used `{{ $json.candidateEmail }}` instead of `{{ $json.body.candidateEmail }}`

**Solution:**
```javascript
// Wrong
{{ $json.candidateEmail }}

// Correct
{{ $('Webhook').first().json.body.candidateEmail }}
```

**Lesson Learned**: Always check data structure in n8n - webhook data is nested.

---

### Failure 3: AI Score Always Showing 50%

**What Happened:**
- Every candidate showed 50% fit score
- Gemini was returning proper scores but frontend showed default

**Root Cause:**
- Frontend was parsing Gemini response incorrectly
- Response structure: `candidates[0].content.parts[0].text`
- Code was looking for `data.score` directly

**Solution:**
Updated `parseGeminiResponse()` function to handle nested structure:
```typescript
// Extract text from Gemini response
if (objData.candidates && Array.isArray(objData.candidates)) {
  content = candidates[0]?.content?.parts?.[0]?.text || '';
}
// Then parse JSON from text
const jsonMatch = content.match(/\{[\s\S]*\}/);
const parsed = JSON.parse(jsonMatch[0]);
return { score: parsed.score, ... };
```

**Lesson Learned**: Always log raw API responses during development.

---

### Failure 4: Gemini Model Not Found

**What Happened:**
- n8n HTTP Request to Gemini API returned 404
- Model `gemini-pro` was not available

**Root Cause:**
- Used wrong model name in API URL
- Gemini API has specific model naming conventions

**Solution:**
Changed from:
```
/models/gemini-pro:generateContent
```
To:
```
/models/gemini-2.0-flash-lite:generateContent
```

**Lesson Learned**: Always verify API endpoints and model names from official docs.

---

## 3. Trade-offs Summary

| Decision | What We Chose | What We Gave Up | Why |
|----------|---------------|-----------------|-----|
| Backend | n8n Cloud | Full control | Faster development |
| Database | Supabase | Self-hosted PostgreSQL | Managed auth + security |
| AI Model | Gemini Flash Lite | GPT-4 capability | Cost + speed |
| Workflow | Y-shape parallel | Sequential simplicity | Better UX |
| Email | Auto-send on analysis | Manual review first | Automation priority |
| Auth | Supabase Auth | Custom JWT | Built-in Google OAuth |

---

## 4. What We Would Do Differently

### If Starting Over:

1. **Start with Y-shape workflow from day 1**
   - Would have saved 3+ hours of debugging

2. **Log everything in development**
   - Add `console.log` for all API responses immediately

3. **Test n8n expressions in isolation**
   - Use n8n's expression editor to verify data paths

4. **Use TypeScript strict mode**
   - Would have caught type mismatches earlier

### Future Improvements:

1. **Add retry logic for email failures**
   - Currently emails fail silently

2. **Implement webhook signature verification**
   - Security improvement for production

3. **Add rate limiting**
   - Prevent abuse of AI analysis endpoint

4. **Cache Gemini responses**
   - Same resume shouldn't be analyzed twice

---

## 5. Key Learnings

1. **n8n webhook data is nested under `body`**
   - Always use `$json.body.fieldName` or `$('Webhook').first().json.body.fieldName`

2. **Parallel workflows are better for user experience**
   - Don't make users wait for background tasks

3. **Gemini returns text, not JSON**
   - Must parse JSON from the text response

4. **Error handling is critical**
   - Gmail "Continue on Error" prevents cascade failures

5. **Test with real data early**
   - Mock data hides integration issues

---

## 6. Architecture Evolution

### Version 1 (Initial - Failed)
```
Frontend → n8n → Gemini → Gmail → Response
Problem: Sequential, slow, errors blocked everything
```

### Version 2 (Current - Working)
```
Frontend → n8n Webhook
              ↓
           Gemini AI
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Response to         Gmail (async)
Frontend            with error handling
```

### Version 3 (Future - Planned)
```
Frontend → API Gateway → Queue
                           ↓
                    ┌──────┴──────┐
                    ↓             ↓
              AI Analysis    Email Service
                    ↓             ↓
              Database ←──────────┘
                    ↓
              WebSocket → Frontend (real-time updates)
```

---

*Document created: December 2024*
*Last updated: December 2024*
