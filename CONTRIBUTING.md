# Contributing to CuraGenie

First off, thank you for considering contributing to CuraGenie! It's people like you that make CuraGenie such a great tool for advancing healthcare through AI.

## Code of Conduct

This project and everyone participating in it is governed by respect, inclusivity, and professionalism. By participating, you are expected to uphold this standard.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Python version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other projects**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** as needed
5. **Commit your changes** with clear commit messages
6. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- **One feature per PR**: Keep PRs focused on a single feature or bug fix
- **Clear description**: Explain what changes you made and why
- **Link related issues**: Reference any related issue numbers
- **Update tests**: Add or update tests for your changes
- **Follow code style**: Match the existing code style
- **Update docs**: Update README or other docs if needed

## Development Setup

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload
```

## Coding Standards

### Python (Backend)

- Follow **PEP 8** style guide
- Use **type hints** where appropriate
- Write **docstrings** for functions and classes
- Keep functions **small and focused**
- Use **meaningful variable names**

```python
def calculate_prs_score(variants: List[Variant], user_id: int) -> float:
    """
    Calculate Polygenic Risk Score for a user's genetic variants.
    
    Args:
        variants: List of genetic variants
        user_id: ID of the user
        
    Returns:
        float: Calculated PRS score
    """
    # Implementation here
    pass
```

### TypeScript/React (Frontend)

- Use **TypeScript** for type safety
- Follow **React best practices**
- Use **functional components** with hooks
- Keep components **small and reusable**
- Use **meaningful component and prop names**

```typescript
interface MRIAnalysisProps {
  imageUrl: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const MRIAnalysis: React.FC<MRIAnalysisProps> = ({
  imageUrl,
  onAnalysisComplete,
}) => {
  // Implementation here
};
```

### Commit Messages

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(mri): add confidence score display
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
```

## Project Structure

```
CuraGenie/
├── frontend/           # Next.js frontend
├── backend/            # FastAPI backend
├── Brain-Tumor-Detection/  # ML module
├── docs/               # Documentation
└── README.md
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Documentation

- Update README.md if you change functionality
- Add docstrings to new functions/classes
- Update API documentation if you add/modify endpoints
- Add comments for complex logic

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special acknowledgments for major features

Thank you for contributing to CuraGenie! 🎉
