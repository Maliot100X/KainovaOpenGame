# Contributing to KAINOVA Agent Grid

First off, thank you for considering contributing to KAINOVA Agent Grid! It's people like you that make this project great.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Run tests and ensure code quality:
   ```bash
   npm run lint
   npm run type-check
   ```
5. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 22.11.0+
- npm or yarn
- Git

### Setup Steps

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in your environment variables
5. Start the development server:
   ```bash
   npm run dev
   ```

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Use strict type checking

### React

- Use functional components with hooks
- Use `use client` directive for client components
- Keep components focused and modular

### Styling

- Use Tailwind CSS for styling
- Use custom colors from the KAINOVA theme
- Ensure responsive design

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally after the first line

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test on both desktop and mobile views

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for functions
- Update API documentation if you change endpoints

## Questions?

Feel free to open an issue with your question or contact us on Farcaster.

Thank you for contributing! 🚀
