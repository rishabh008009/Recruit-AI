# Implementation Plan

- [x] 1. Initialize React project with Vite and configure development environment
  - Create new Vite project with React and TypeScript template
  - Install dependencies: Tailwind CSS, Lucide-React, fast-check, Vitest, React Testing Library
  - Configure Tailwind with Linear-style design system (Inter font, Slate/Indigo colors, custom shadows)
  - Set up Vitest and React Testing Library for testing
  - Create project folder structure: components/, data/, types/, utils/
  - _Requirements: 10.1, 10.2, 10.5_

- [x] 2. Create TypeScript type definitions and mock data
  - Define core TypeScript interfaces in types/index.ts (Candidate, Job, DashboardMetrics, CandidateStatus, EmailTemplate)
  - Create mockData.ts with 5 realistic candidate profiles including Amit Sharma (92%), Sarah Jenkins (78%), Shubham Verma (45%), Emily Chen (88%), Michael Rodriguez (62%)
  - Create mock jobs array with "Senior Product Manager" and "Full Stack Engineer" positions
  - Create mock metrics object with candidatesProcessed: 142, timeSaved: 28, pendingReview: 5
  - Ensure each candidate has realistic AI analysis text demonstrating system capabilities
  - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [x] 3. Implement utility functions for formatting
  - Create formatters.ts with date formatting function (Date → "MMM DD, YYYY")
  - Create time formatting function that adds "hrs" unit to numeric values
  - _Requirements: 1.3, 3.3_

- [ ]* 3.1 Write property test for time formatting
  - **Property 2: Time formatting includes units**
  - **Validates: Requirements 1.3**

- [ ]* 3.2 Write property test for date formatting
  - **Property 5: Date formatting consistency**
  - **Validates: Requirements 3.3**

- [x] 4. Build ScoreBadge component with color-coded logic
  - Create ScoreBadge.tsx component that accepts score prop
  - Implement color logic: green (>80), yellow (50-79), red (<50)
  - Display score with "%" symbol
  - Apply Tailwind classes for badge styling with rounded corners and padding
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 4.1 Write property test for high score badge color
  - **Property 8: Score badge color for high scores**
  - **Validates: Requirements 4.1**

- [ ]* 4.2 Write property test for medium score badge color
  - **Property 9: Score badge color for medium scores**
  - **Validates: Requirements 4.2**

- [ ]* 4.3 Write property test for low score badge color
  - **Property 10: Score badge color for low scores**
  - **Validates: Requirements 4.3**

- [ ]* 4.4 Write property test for percentage symbol
  - **Property 11: Score percentage formatting**
  - **Validates: Requirements 4.4**

- [x] 5. Create MetricCard component for displaying dashboard metrics
  - Build MetricCard.tsx with props: title, value, icon, optional trend
  - Apply Linear-style card styling: white background, subtle shadow, 8px border radius, 24px padding
  - Display icon in primary Indigo color
  - Format value with appropriate typography
  - _Requirements: 1.1, 1.4_

- [x] 6. Build CommandCenter component with metrics display
  - Create CommandCenter.tsx that accepts DashboardMetrics prop
  - Render three MetricCard components in responsive grid layout
  - Use Lucide-React icons: Users (Candidates Processed), Clock (Time Saved), AlertCircle (Pending Review)
  - Format time saved value with "hrs" unit using formatter
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ]* 6.1 Write property test for metric updates
  - **Property 1: Metric updates trigger re-render**
  - **Validates: Requirements 1.2**

- [x] 7. Implement ActiveJobs component
  - Create ActiveJobs.tsx that accepts jobs array prop
  - Render job cards in horizontal scrollable container
  - Display job title, department, openings count, and applicants count for each job
  - Implement empty state message when jobs array is empty
  - Apply card styling consistent with design system
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 7.1 Write property test for job display completeness
  - **Property 3: Job display completeness**
  - **Validates: Requirements 2.2**

- [x] 8. Build CandidateTable component with sorting
  - Create CandidateTable.tsx with props: candidates array, onCandidateClick callback
  - Render table with columns: Name, Role Applied, Applied Date, Status, AI Fit Score
  - Make candidate names clickable elements that trigger onCandidateClick
  - Format Applied Date using date formatter
  - Display Status as colored badge
  - Render AI Fit Score using ScoreBadge component
  - Sort candidates by appliedDate in descending order
  - Apply table styling: clean borders (1px solid neutral-200), hover states on rows
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 8.1 Write property test for candidate name interactivity
  - **Property 4: Candidate names are interactive**
  - **Validates: Requirements 3.2**

- [ ]* 8.2 Write property test for status value constraints
  - **Property 6: Status value constraints**
  - **Validates: Requirements 3.4**

- [ ]* 8.3 Write property test for candidate sorting
  - **Property 7: Candidate sorting by date**
  - **Validates: Requirements 3.5**

- [x] 9. Create AutoPilotActions component with conditional email templates
  - Build AutoPilotActions.tsx with props: candidate, onActionComplete callback
  - Implement conditional logic: if score > 70 show interview invite, else show rejection
  - Create interview email template with subject and body including candidate name and role
  - Create rejection email template with candidate name and encouraging message
  - Render "Send Interview Invite" or "Send Rejection" button based on score
  - Display pre-drafted email in textarea below button
  - Handle button click to trigger onActionComplete callback with action type
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4_

- [ ]* 9.1 Write property test for interview button display
  - **Property 15: Interview invite button for high scores**
  - **Validates: Requirements 7.1**

- [ ]* 9.2 Write property test for interview email template presence
  - **Property 16: Interview email template presence**
  - **Validates: Requirements 7.2**

- [ ]* 9.3 Write property test for interview email personalization
  - **Property 17: Interview email personalization**
  - **Validates: Requirements 7.4**

- [ ]* 9.4 Write property test for rejection button display
  - **Property 18: Rejection button for low scores**
  - **Validates: Requirements 8.1**

- [ ]* 9.5 Write property test for rejection email template presence
  - **Property 19: Rejection email template presence**
  - **Validates: Requirements 8.2**

- [ ]* 9.6 Write property test for rejection email personalization
  - **Property 20: Rejection email personalization**
  - **Validates: Requirements 8.4**

- [x] 10. Build CandidateDetailView slide-over component
  - Create CandidateDetailView.tsx with props: candidate (nullable), isOpen boolean, onClose callback
  - Implement slide-over panel that appears from right side (600px width)
  - Add semi-transparent overlay backdrop that triggers onClose when clicked
  - Display candidate header with name, role, and ScoreBadge
  - Render "AI Analysis" section with candidate's aiAnalysis text
  - Include AutoPilotActions component
  - Add close button (X icon from Lucide-React) in top-right corner
  - Implement smooth slide animation using CSS transitions
  - Set z-index: 50 for proper layering
  - Handle null candidate gracefully
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1_

- [ ]* 10.1 Write property test for detail view opening
  - **Property 12: Detail view opens on candidate click**
  - **Validates: Requirements 5.1**

- [ ]* 10.2 Write property test for complete candidate information display
  - **Property 13: Detail view displays complete candidate information**
  - **Validates: Requirements 5.2**

- [ ]* 10.3 Write property test for AI Analysis section presence
  - **Property 14: AI Analysis section presence**
  - **Validates: Requirements 6.1**

- [x] 11. Integrate all components in main App component
  - Create App.tsx as root component
  - Import mock data (candidates, jobs, metrics)
  - Set up state management for selected candidate and detail view open/close
  - Render CommandCenter with metrics
  - Render ActiveJobs with jobs data
  - Render CandidateTable with candidates and click handler
  - Render CandidateDetailView with selected candidate state
  - Implement candidate selection logic (set selected candidate on table row click)
  - Implement detail view close logic (clear selected candidate)
  - Implement action complete handler (show toast notification, update candidate status)
  - _Requirements: 1.1, 2.1, 3.1, 5.1_

- [x] 12. Add error boundaries and validation
  - Create ErrorBoundary component to catch rendering errors
  - Implement ErrorFallback component for graceful error display
  - Add runtime validation for candidate aiFitScore (0-100 range)
  - Add null/undefined checks in DetailView
  - Implement empty state handling for candidates and jobs
  - _Requirements: All (error handling)_

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Polish UI and accessibility
  - Add keyboard navigation support for all interactive elements
  - Implement ARIA labels for buttons, tables, and form controls
  - Add focus trap in DetailView when open
  - Ensure focus returns to trigger element when DetailView closes
  - Verify color contrast meets WCAG AA standards for all badge colors
  - Add hover and focus states for all interactive elements
  - Test responsive layout across different desktop screen sizes
  - _Requirements: 10.6_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
