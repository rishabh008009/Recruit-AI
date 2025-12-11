# Design Document

## Overview

The Recruit-AI Dashboard is a single-page React application built with Vite, Tailwind CSS, and TypeScript. The application follows a component-based architecture with a focus on reusability, type safety, and a Linear-inspired minimalist aesthetic. The system uses mock data stored in TypeScript files to simulate a fully functional applicant tracking system with AI-powered candidate scoring and automated workflow actions.

The application consists of three main visual layers: the Command Center (metrics), the Candidate Table (data grid), and the Detail View (slide-over panel). User interactions flow from viewing aggregate metrics, to scanning candidates in the table, to drilling into individual candidate details where automated actions can be triggered.

## Architecture

### Technology Stack

- **Build Tool:** Vite 5.x for fast development and optimized production builds
- **Framework:** React 18.x with TypeScript for type-safe component development
- **Styling:** Tailwind CSS 3.x with custom configuration for Linear-style design system
- **Icons:** Lucide-React for consistent, modern iconography
- **State Management:** React hooks (useState, useEffect) for local component state
- **Data Layer:** Static TypeScript modules exporting mock data structures

### Project Structure

```
src/
├── components/
│   ├── CommandCenter.tsx       # Metrics cards display
│   ├── ActiveJobs.tsx           # Job listings component
│   ├── CandidateTable.tsx       # Main data grid
│   ├── CandidateDetailView.tsx  # Slide-over panel
│   ├── MetricCard.tsx           # Reusable metric display
│   ├── ScoreBadge.tsx           # Color-coded score component
│   └── AutoPilotActions.tsx     # Email action buttons
├── data/
│   └── mockData.ts              # Candidate and job data
├── types/
│   └── index.ts                 # TypeScript interfaces
├── utils/
│   └── formatters.ts            # Date and number formatting
├── App.tsx                      # Root component
└── main.tsx                     # Application entry point
```

### Design System Configuration

The Tailwind configuration will be extended with:

```javascript
// tailwind.config.js
{
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',  // Indigo accent
          600: '#4f46e5',
          700: '#4338ca',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          500: '#64748b',
          700: '#334155',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
```

## Components and Interfaces

### Core Data Types

```typescript
// types/index.ts

export type CandidateStatus = 'New' | 'Interview' | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  roleApplied: string;
  appliedDate: Date;
  status: CandidateStatus;
  aiFitScore: number;
  email: string;
  aiAnalysis: string;
  resumeUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  openings: number;
  applicants: number;
}

export interface DashboardMetrics {
  candidatesProcessed: number;
  timeSaved: number;
  pendingReview: number;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}
```

### Component Specifications

#### 1. CommandCenter Component

**Purpose:** Display key recruitment metrics in card format

**Props:**
```typescript
interface CommandCenterProps {
  metrics: DashboardMetrics;
}
```

**Behavior:**
- Renders three MetricCard components in a responsive grid
- Formats numbers with appropriate units (hours for time saved)
- Uses icons from Lucide-React (Users, Clock, AlertCircle)

#### 2. MetricCard Component

**Purpose:** Reusable card for displaying a single metric

**Props:**
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}
```

**Styling:**
- White background with subtle shadow
- Border radius of 8px
- Padding: 24px
- Icon in primary color (Indigo)

#### 3. ActiveJobs Component

**Purpose:** Display list of open positions

**Props:**
```typescript
interface ActiveJobsProps {
  jobs: Job[];
}
```

**Behavior:**
- Renders job cards in a horizontal scrollable container
- Each card shows title, department, and applicant count
- Empty state when no jobs exist

#### 4. CandidateTable Component

**Purpose:** Main data grid displaying all candidates

**Props:**
```typescript
interface CandidateTableProps {
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
}
```

**Behavior:**
- Renders table with columns: Name, Role Applied, Applied Date, Status, AI Fit Score
- Name column is clickable and triggers onCandidateClick
- Applied Date formatted as "MMM DD, YYYY"
- Status displayed as colored badge
- AI Fit Score rendered using ScoreBadge component
- Sorts candidates by appliedDate descending by default

**Styling:**
- Clean table borders (1px solid neutral-200)
- Hover state on rows (background: neutral-50)
- Header row with bold text and neutral-700 color

#### 5. ScoreBadge Component

**Purpose:** Display color-coded AI Fit Score

**Props:**
```typescript
interface ScoreBadgeProps {
  score: number;
}
```

**Behavior:**
- Determines badge color based on score:
  - score > 80: green (bg-green-100, text-green-800)
  - score 50-79: yellow (bg-yellow-100, text-yellow-800)
  - score < 50: red (bg-red-100, text-red-800)
- Displays score with "%" symbol
- Rounded badge with padding

#### 6. CandidateDetailView Component

**Purpose:** Slide-over panel showing detailed candidate information

**Props:**
```typescript
interface CandidateDetailViewProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**Behavior:**
- Slides in from right side when isOpen is true
- Displays candidate header with name, role, and ScoreBadge
- Shows AI Analysis section with formatted text
- Renders AutoPilotActions component
- Includes close button (X icon) in top-right corner
- Clicking overlay backdrop triggers onClose

**Styling:**
- Fixed position overlay with semi-transparent background
- Panel width: 600px
- Slide animation using CSS transitions
- Z-index: 50 to appear above other content

#### 7. AutoPilotActions Component

**Purpose:** Display automated email actions based on AI Fit Score

**Props:**
```typescript
interface AutoPilotActionsProps {
  candidate: Candidate;
  onActionComplete: (action: 'interview' | 'rejection') => void;
}
```

**Behavior:**
- If candidate.aiFitScore > 70:
  - Shows "Send Interview Invite" button
  - Displays pre-drafted interview email in textarea
- If candidate.aiFitScore <= 70:
  - Shows "Send Rejection" button
  - Displays pre-drafted rejection email in textarea
- Button click triggers onActionComplete callback
- Shows success toast/notification after action

**Email Templates:**
```typescript
// Interview Invite (score > 70)
Subject: Interview Invitation - [Role] at Recruit-AI
Body: Hi [Name], We were impressed by your application...

// Rejection (score <= 70)
Subject: Application Update - [Role] at Recruit-AI
Body: Hi [Name], Thank you for your interest in the [Role] position...
```

## Data Models

### Mock Data Structure

The `mockData.ts` file exports the following:

```typescript
// data/mockData.ts

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    roleApplied: 'Senior Product Manager',
    appliedDate: new Date('2024-01-15'),
    status: 'New',
    aiFitScore: 92,
    email: 'amit.sharma@email.com',
    aiAnalysis: 'Exceptional match for the Senior Product Manager role. Candidate demonstrates 8+ years of product leadership experience with a strong track record in B2B SaaS. Expertise in roadmap planning, stakeholder management, and data-driven decision making aligns perfectly with job requirements. Led 3 successful product launches generating $10M+ ARR. Strong technical background with engineering degree. Only minor gap: limited experience with healthcare domain, but transferable skills are excellent.',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    roleApplied: 'Full Stack Engineer',
    appliedDate: new Date('2024-01-14'),
    status: 'New',
    aiFitScore: 78,
    email: 'sarah.jenkins@email.com',
    aiAnalysis: 'Strong candidate for Full Stack Engineer position. Solid 5 years of experience with React, Node.js, and PostgreSQL - all core requirements. Demonstrated ability to build scalable applications and work in agile teams. GitHub profile shows consistent contributions and clean code practices. Gap identified: No AWS certification or production cloud deployment experience mentioned. However, shows self-learning capability and could quickly acquire cloud skills with proper onboarding.',
  },
  {
    id: '3',
    name: 'Shubham Verma',
    roleApplied: 'Senior Product Manager',
    appliedDate: new Date('2024-01-13'),
    status: 'New',
    aiFitScore: 45,
    email: 'shubham.verma@email.com',
    aiAnalysis: 'Limited alignment with Senior Product Manager requirements. Candidate has 2 years of experience as Associate Product Manager, which falls short of the 5+ years required for senior role. Background is primarily in e-commerce consumer apps, lacking B2B or enterprise product experience. Resume shows good analytical skills and MBA from reputable institution, but insufficient evidence of strategic product leadership, P&L ownership, or cross-functional team management at scale. Better suited for mid-level PM roles.',
  },
  {
    id: '4',
    name: 'Emily Chen',
    roleApplied: 'Full Stack Engineer',
    appliedDate: new Date('2024-01-12'),
    status: 'Interview',
    aiFitScore: 88,
    email: 'emily.chen@email.com',
    aiAnalysis: 'Outstanding technical candidate for Full Stack Engineer role. 6 years of full-stack development with deep expertise in React, TypeScript, Node.js, and AWS. Previously worked at high-growth startups where she architected microservices handling 1M+ daily users. Strong system design skills and experience with CI/CD pipelines. Excellent communication skills based on technical blog posts. AWS Solutions Architect certified. Cultural fit appears strong based on values alignment. Highly recommended for interview.',
  },
  {
    id: '5',
    name: 'Michael Rodriguez',
    roleApplied: 'Senior Product Manager',
    appliedDate: new Date('2024-01-11'),
    status: 'Rejected',
    aiFitScore: 62,
    email: 'michael.rodriguez@email.com',
    aiAnalysis: 'Moderate fit for Senior Product Manager position. Candidate has relevant 6 years of product experience and meets the experience threshold. However, background is heavily focused on internal tools and operations products rather than customer-facing products. Limited evidence of market research, competitive analysis, or go-to-market strategy execution. Resume lacks quantifiable business impact metrics. Technical skills are adequate but not exceptional. Would be a better fit for internal product or platform PM roles rather than customer-facing senior PM position.',
  },
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Product Manager',
    department: 'Product',
    openings: 2,
    applicants: 45,
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    department: 'Engineering',
    openings: 3,
    applicants: 97,
  },
];

export const mockMetrics: DashboardMetrics = {
  candidatesProcessed: 142,
  timeSaved: 28,
  pendingReview: 5,
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Metric updates trigger re-render
*For any* DashboardMetrics object, when the metrics prop changes, the displayed values in the CommandCenter component should update to reflect the new values without requiring a page reload.
**Validates: Requirements 1.2**

### Property 2: Time formatting includes units
*For any* numeric time value passed to the time formatter, the output string should contain "hrs" or "hours" as a unit indicator.
**Validates: Requirements 1.3**

### Property 3: Job display completeness
*For any* Job object in the jobs array, the rendered output should contain the job's title and all metadata fields (department, openings, applicants).
**Validates: Requirements 2.2**

### Property 4: Candidate names are interactive
*For any* candidate in the CandidateTable, the name element should be clickable (have an onClick handler or be rendered as an interactive element).
**Validates: Requirements 3.2**

### Property 5: Date formatting consistency
*For any* valid Date object, the Applied Date formatter should output a string in human-readable format (e.g., "Jan 15, 2024" or "MMM DD, YYYY" pattern).
**Validates: Requirements 3.3**

### Property 6: Status value constraints
*For any* candidate displayed in the table, the status value should be exactly one of: "New", "Interview", or "Rejected".
**Validates: Requirements 3.4**

### Property 7: Candidate sorting by date
*For any* array of candidates, when rendered in the CandidateTable, the display order should have candidates with more recent appliedDate values appearing before those with earlier dates.
**Validates: Requirements 3.5**

### Property 8: Score badge color for high scores
*For any* AI Fit Score value greater than 80, the ScoreBadge component should render with green styling (green background and text colors).
**Validates: Requirements 4.1**

### Property 9: Score badge color for medium scores
*For any* AI Fit Score value between 50 and 79 (inclusive), the ScoreBadge component should render with yellow styling (yellow background and text colors).
**Validates: Requirements 4.2**

### Property 10: Score badge color for low scores
*For any* AI Fit Score value less than 50, the ScoreBadge component should render with red styling (red background and text colors).
**Validates: Requirements 4.3**

### Property 11: Score percentage formatting
*For any* AI Fit Score value, the rendered output in the ScoreBadge should include the "%" symbol after the numeric value.
**Validates: Requirements 4.4**

### Property 12: Detail view opens on candidate click
*For any* candidate in the CandidateTable, clicking the candidate's name should trigger the Detail View to open with isOpen state set to true.
**Validates: Requirements 5.1**

### Property 13: Detail view displays complete candidate information
*For any* candidate passed to the CandidateDetailView component, the rendered output should include the candidate's name, role, applied date, status, and AI Fit Score.
**Validates: Requirements 5.2**

### Property 14: AI Analysis section presence
*For any* candidate displayed in the Detail View, the component should render an "AI Analysis" section containing the candidate's aiAnalysis text.
**Validates: Requirements 6.1**

### Property 15: Interview invite button for high scores
*For any* candidate with aiFitScore greater than 70, the AutoPilotActions component should render a "Send Interview Invite" button.
**Validates: Requirements 7.1**

### Property 16: Interview email template presence
*For any* candidate with aiFitScore greater than 70, when the AutoPilotActions component renders, it should display a textarea containing pre-drafted interview invitation email content.
**Validates: Requirements 7.2**

### Property 17: Interview email personalization
*For any* candidate with aiFitScore greater than 70, the interview email template should include the candidate's name and the role they applied for.
**Validates: Requirements 7.4**

### Property 18: Rejection button for low scores
*For any* candidate with aiFitScore less than or equal to 70, the AutoPilotActions component should render a "Send Rejection" button.
**Validates: Requirements 8.1**

### Property 19: Rejection email template presence
*For any* candidate with aiFitScore less than or equal to 70, when the AutoPilotActions component renders, it should display a textarea containing pre-drafted rejection email content.
**Validates: Requirements 8.2**

### Property 20: Rejection email personalization
*For any* candidate with aiFitScore less than or equal to 70, the rejection email template should include the candidate's name.
**Validates: Requirements 8.4**

## Error Handling

### Component Error Boundaries

The application will implement React Error Boundaries to gracefully handle component rendering errors:

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Data Validation

All components will validate props using TypeScript types and runtime checks:

- **Candidate validation:** Ensure aiFitScore is between 0-100
- **Date validation:** Check that appliedDate is a valid Date object
- **Status validation:** Verify status is one of the allowed enum values
- **Null checks:** Handle null/undefined candidate in DetailView gracefully

### User Feedback

Error states and loading states will be communicated through:

- Empty state messages when no data is available
- Toast notifications for action confirmations
- Disabled button states during processing
- Fallback UI for missing or invalid data

## Testing Strategy

The Recruit-AI Dashboard will employ a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage and correctness.

### Testing Framework

- **Unit Testing:** Vitest with React Testing Library
- **Property-Based Testing:** fast-check library for JavaScript/TypeScript
- **Test Runner Configuration:** Each property-based test will run a minimum of 100 iterations

### Unit Testing Approach

Unit tests will verify specific examples, edge cases, and component integration:

**Component Rendering Tests:**
- Verify CommandCenter renders with correct metric values
- Test ActiveJobs displays job cards correctly
- Confirm CandidateTable renders all columns
- Validate DetailView opens and closes properly

**Interaction Tests:**
- Test candidate name click opens detail view
- Verify close button dismisses detail view
- Test action button clicks trigger callbacks

**Edge Cases:**
- Empty candidate list displays appropriate message
- Empty jobs list shows empty state
- Null candidate in DetailView renders gracefully

**Example Unit Test:**
```typescript
describe('ScoreBadge', () => {
  it('renders green badge for score 92', () => {
    render(<ScoreBadge score={92} />);
    const badge = screen.getByText('92%');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });
});
```

### Property-Based Testing Approach

Property-based tests will verify universal properties across all valid inputs using fast-check generators:

**Score Badge Color Properties:**
- **Feature: recruit-ai-dashboard, Property 8:** For any score > 80, badge is green
- **Feature: recruit-ai-dashboard, Property 9:** For any score 50-79, badge is yellow
- **Feature: recruit-ai-dashboard, Property 10:** For any score < 50, badge is red

**Data Formatting Properties:**
- **Feature: recruit-ai-dashboard, Property 2:** Time values always include unit suffix
- **Feature: recruit-ai-dashboard, Property 5:** Dates format to readable strings
- **Feature: recruit-ai-dashboard, Property 11:** Scores always include "%" symbol

**Conditional Rendering Properties:**
- **Feature: recruit-ai-dashboard, Property 15:** High scores show interview button
- **Feature: recruit-ai-dashboard, Property 18:** Low scores show rejection button
- **Feature: recruit-ai-dashboard, Property 17:** Interview emails include candidate name
- **Feature: recruit-ai-dashboard, Property 20:** Rejection emails include candidate name

**Example Property-Based Test:**
```typescript
import fc from 'fast-check';

describe('ScoreBadge Properties', () => {
  /**
   * Feature: recruit-ai-dashboard, Property 8: Score badge color for high scores
   * Validates: Requirements 4.1
   */
  it('renders green badge for any score > 80', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 81, max: 100 }),
        (score) => {
          const { container } = render(<ScoreBadge score={score} />);
          const badge = container.querySelector('[class*="bg-green"]');
          expect(badge).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Generators

Custom fast-check generators will be created for domain objects:

```typescript
// Candidate generator
const candidateArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.fullName(),
  roleApplied: fc.constantFrom('Senior Product Manager', 'Full Stack Engineer'),
  appliedDate: fc.date(),
  status: fc.constantFrom('New', 'Interview', 'Rejected'),
  aiFitScore: fc.integer({ min: 0, max: 100 }),
  email: fc.emailAddress(),
  aiAnalysis: fc.lorem({ maxCount: 50 }),
});

// Score generator for different ranges
const highScoreArbitrary = fc.integer({ min: 81, max: 100 });
const mediumScoreArbitrary = fc.integer({ min: 50, max: 79 });
const lowScoreArbitrary = fc.integer({ min: 0, max: 49 });
```

### Test Coverage Goals

- **Unit Test Coverage:** 80%+ line coverage for all components
- **Property Test Coverage:** All 20 correctness properties implemented as property-based tests
- **Integration Coverage:** Key user flows tested end-to-end (view candidate → open detail → trigger action)

### Continuous Testing

Tests will be integrated into the development workflow:
- Run on every file save during development
- Execute full suite before commits
- Automated testing in CI/CD pipeline
- Property tests run with 100 iterations minimum to catch edge cases

## Implementation Notes

### Performance Considerations

- **Memoization:** Use React.memo for MetricCard and ScoreBadge to prevent unnecessary re-renders
- **Virtual Scrolling:** If candidate list grows beyond 100 items, implement virtual scrolling with react-window
- **Lazy Loading:** Code-split DetailView component to reduce initial bundle size

### Accessibility

- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **ARIA Labels:** Proper labels for buttons, tables, and form elements
- **Focus Management:** Trap focus in DetailView when open, return focus on close
- **Color Contrast:** Ensure all badge colors meet WCAG AA standards

### Future Enhancements

- **Real Backend Integration:** Replace mock data with API calls to Supabase
- **Search and Filtering:** Add candidate search and filter by status/score
- **Bulk Actions:** Select multiple candidates for batch operations
- **Real-time Updates:** WebSocket integration for live candidate updates
- **Export Functionality:** Download candidate data as CSV/PDF
- **Advanced Analytics:** Charts and graphs for recruitment metrics over time
