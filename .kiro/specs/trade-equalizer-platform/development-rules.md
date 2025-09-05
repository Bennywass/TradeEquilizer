# Development Rules & Guidelines

## Core Development Principles

### 1. Simplicity & Lightweight Architecture
- Keep the application as simple and lightweight as possible to enable quick pivots after customer demos
- Prioritize minimal viable implementations over complex, feature-rich solutions
- Use straightforward patterns and avoid over-engineering
- Focus on core functionality that directly serves user needs

### 2. Task Completion & Testing Protocol
- Each task must produce a detailed `.md` file overview of what was accomplished and how to test it
- All manual testing will be conducted after development completion
- Tasks cannot be marked as complete until they pass manual testing and review
- The application must build successfully before being passed for testing

### 3. Testing Strategy (Simplified)
- **Remove all requirements for linting and unit tests** to accelerate development
- Focus on integration and automation test scripts at the end of development cycle
- Prioritize end-to-end functionality over granular unit test coverage
- Manual testing will validate all functionality before release

### 4. Early Feedback Loop
- Enable local browser testing ASAP to gather design and UX feedback early
- Prioritize getting a working prototype running locally for immediate feedback
- Focus on look, feel, and user experience validation before feature completion
- Allow for design corrections and iterations based on early testing

## Task Documentation Requirements

### Task Completion Report Format
Each completed task must include a `task-[number]-completion.md` file with:

```markdown
# Task [Number] Completion Report

## What Was Accomplished
- Detailed list of implemented features
- Code files created/modified
- Database changes made
- API endpoints added

## How to Test
- Step-by-step manual testing instructions
- Expected behaviors and outcomes
- Test data requirements
- Browser/device testing notes

## Build Instructions
- Commands to build the application
- Environment setup requirements
- Dependencies installed

## Known Issues
- Any limitations or incomplete features
- Temporary workarounds implemented
- Future improvements needed

## Files Changed
- List of all files created or modified
- Brief description of changes made
```

## Development Workflow

### 1. Task Execution
- Focus on one task at a time
- Implement minimal viable solution
- Ensure application builds successfully
- Create comprehensive testing documentation

### 2. Testing Handoff
- Generate task completion report
- Verify application builds and runs locally
- Document all testing procedures
- Mark task as ready for review (not complete)

### 3. Review Process
- Manual testing conducted based on completion report
- Feedback provided for any issues or improvements
- Task marked as complete only after successful review
- Iterate if changes are needed

## Technical Guidelines

### Code Quality
- Prioritize readable, maintainable code over complex optimizations
- Use consistent naming conventions and file organization
- Include necessary comments for complex business logic
- Keep functions and components focused and single-purpose

### Performance Considerations
- Optimize for mobile-first experience
- Ensure fast local development and testing
- Minimize bundle size and loading times
- Use efficient database queries and caching where appropriate

### Error Handling
- Implement graceful error handling for user-facing features
- Provide clear error messages for debugging
- Log errors appropriately without exposing sensitive data
- Handle edge cases that could break the application

## Integration & Automation Testing (End of Cycle)

### Integration Test Suite
- End-to-end user workflows
- API integration testing
- Database operation validation
- External service integration verification

### Automation Scripts
- Deployment automation
- Database migration scripts
- Environment setup automation
- Monitoring and health check scripts

## Local Development Requirements

### Environment Setup
- Ensure quick local setup and development
- Provide clear documentation for running locally
- Minimize external dependencies for development
- Enable hot reloading and fast iteration

### Browser Testing
- Prioritize Chrome/Safari mobile testing
- Ensure responsive design works across devices
- Test PWA functionality locally
- Validate offline capabilities

## Pivot Readiness

### Modular Architecture
- Keep features loosely coupled for easy modification
- Use configuration-driven approaches where possible
- Maintain clear separation of concerns
- Document architectural decisions for future reference

### Data Flexibility
- Design database schema to accommodate changes
- Use flexible data models where appropriate
- Maintain data migration capabilities
- Keep external integrations configurable

## Success Criteria

### Task Completion
- Application builds without errors
- All implemented features work as documented
- Testing documentation is comprehensive and accurate
- Code is clean, readable, and maintainable

### Review Readiness
- Local environment runs smoothly
- All features are testable through the browser
- Performance is acceptable for demo purposes
- User experience meets basic usability standards