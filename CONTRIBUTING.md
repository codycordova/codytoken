# Contributing to CODY Token

Thank you for your interest in contributing to the CODY Token project! This document provides guidelines and information for contributors.

## 🎯 Project Overview

CODY Token is a Stellar-based utility token created by music artist Cody Cordova. It supports merch, tickets, games, and digital community tools. This repository contains the official website and smart contract implementations.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Rust](https://rustup.rs/) (for smart contract development)
- [Git](https://git-scm.com/)

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/codytoken.git
   cd codytoken
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) to view the app.**

## 🛠 Development Guidelines

### Code Style

- **TypeScript:** Use strict TypeScript with proper type annotations
- **React:** Follow functional component patterns with hooks
- **CSS:** Use CSS Modules for component-specific styling
- **Naming:** Use descriptive names for variables, functions, and components

### File Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── context/            # React context providers
├── types/              # TypeScript type definitions
└── globals.css         # Global styles
```

### Git Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** with a clear description of your changes.

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 🧪 Testing

### Frontend Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Build the project
npm run build
```

### Smart Contract Testing

```bash
# Navigate to contracts directory
cd contracts

# Run tests
cargo test

# Run with verbose output
cargo test --verbose
```

## 📝 Pull Request Guidelines

### Before Submitting

1. **Ensure your code builds successfully:**
   ```bash
   npm run build
   ```

2. **Run linting and fix any issues:**
   ```bash
   npm run lint
   ```

3. **Test your changes thoroughly**

4. **Update documentation if needed**

### PR Description Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
- [ ] Manual testing completed
- [ ] Unit tests added/updated
- [ ] Build passes successfully

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors or warnings
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment details:**
   - Operating System
   - Browser version
   - Node.js version

2. **Steps to reproduce:**
   - Clear, step-by-step instructions
   - Expected vs actual behavior

3. **Additional context:**
   - Screenshots if applicable
   - Console errors
   - Network tab information

### Feature Requests

For feature requests, please:

1. **Describe the feature** in detail
2. **Explain the use case** and benefits
3. **Provide examples** of how it would work
4. **Consider implementation** complexity

## 🤝 Community Guidelines

- **Be respectful** and inclusive in all interactions
- **Help others** by answering questions and reviewing PRs
- **Share knowledge** and best practices
- **Follow the Code of Conduct**

## 📚 Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎉 Recognition

Contributors will be recognized in:

- Project README.md
- Release notes
- Community shoutouts

## 📞 Contact

- **Discord:** [Join our community](https://discord.gg/codytoken)
- **Email:** mgmt@codycordova.com
- **Twitter:** [@realcodycordova](https://twitter.com/realcodycordova)

Thank you for contributing to CODY Token! 🚀 