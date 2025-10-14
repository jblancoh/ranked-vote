# 🗳️ Ranked Vote

> Open-source ranked voting platform for community events and contests

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-orange.svg)](https://hacktoberfest.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/CONTRIBUTING.md)

Ranked Vote is a modern web application that allows communities to organize ranked voting for any type of event or contest. Whether you're choosing the best local dish, community representative, or cultural symbol, Ranked Vote makes it easy and transparent.

If you prefer Spanish, read this documentation in Spanish clic [here](README.md).

## ✨ Features

- 🎯 **Ranked Voting** - Voters rank their 5 favorite options by preference
- 📊 **Real-Time Results** - Live vote counting and visualization with interactive charts
- 🔒 **Vote Integrity** - One vote per person (based on IP or email verification)
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Customizable** - Easy to adapt for different events and themes
- 🌐 **Multi-event Support** - Run multiple voting campaigns simultaneously
- 📈 **Analytics Dashboard** - Track participation, trends, and voting patterns
- 🌍 **Bilingual** - Full support for English and Spanish

## 🚀 Built With

**Frontend:**
- React 18 + Vite
- TailwindCSS
- React Router v6
- Recharts
- Lucide React Icons

**Backend:**
- Node.js + Express
- Prisma ORM
- Validation with Zod
- Rate limiting and security

**Database:**
- Supabase (PostgreSQL)
- Authentication
- Real-time subscriptions

## 🎯 Use Cases

This platform was created by [Dev Night Talk](https://www.meetup.com/es-ES/dev-night-talks/) and will be implemented for the first time for the community event "Flor de Tabasco". It can be adapted for:

- 🌸 Cultural symbol selection
- 🍕 Best local food/restaurant contests
- 🏆 Community awards and recognitions
- 📚 Book club selections
- 🎬 Movie voting
- 🎨 Art and design competitions
- 🎵 Music or band contests
- And any decision that requires ranking!

## 📖 Quick Start

### 🎯 Automatic Installation (Recommended)

The easiest way to get started. You only need **Node.js 18+** installed.

```bash
# 1. Clone the repository
git clone https://github.com/jblancoh/ranked-vote.git
cd ranked-vote

# 2. Run automatic installation
./scripts/setup.sh
```

The script will guide you step by step to:

- ✅ Install all dependencies
- ✅ Configure the database (free Supabase or local PostgreSQL)
- ✅ Create configuration files
- ✅ Prepare everything to work

### 🚀 Start the Project

```bash
./scripts/start-dev.sh
```

That's it! Open your browser at:

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:5001>

### 📚 More Information

- **Complete Documentation**: [`SETUP_MULTITENANT.md`](docs/SETUP_MULTITENANT.md) - Technical details
- **Contribute**: [`CONTRIBUTING.md`](docs/CONTRIBUTING.md) - How to collaborate

📁 Project Structure

```text

ranked-vote/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── prisma/
│   └── package.json
├── shared/            # Shared types and utilities
├── docs/              # Documentation
│   ├── INSTALLATION.md
│   └── examples/
│       └── flor-tabasco/
└── package.json       # Root package with scripts
```

🤝 Contribute
We welcome contributions from developers of all levels! This project is part of Hacktoberfest 2025.
How to Contribute

- Fork the repository
- Create your feature branch (git checkout -b feature/IncredibleFeature)
- Commit your changes (git commit -m 'Add IncredibleFeature')
- Push to the branch (git push origin feature/IncredibleFeature)
- Open a Pull Request

Check our [Contribution Guide](docs/CONTRIBUTING.md) for detailed instructions.

Good First Issues
New to open source? Look for issues labeled with:

good-first-issue - Perfect for beginners
hacktoberfest - Issues ready for Hacktoberfest
documentation - Help improve our documentation
help-wanted - We need your expertise!

🌟 First Implementation: Flor de Tabasco

Our inaugural event helps the Tabasco community predict the winner of their representative flower through democratic ranked voting. This real implementation showcases the platform's capabilities.

Learn more: Case Study [Flor de Tabasco](docs/examples/flor-tabasco)

🚀 Deployment
The application can be deployed on:
Frontend:

Vercel (recommended)
Netlify
GitHub Pages

Backend:

Render (free tier)
Railway
Heroku

Database:

Supabase (free tier)

<!-- See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions. -->

📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
🙏 Acknowledgments

Created by the [Dev Night Talk](https://www.meetup.com/es-ES/dev-night-talks/) community
Special thanks to all our [contributors](https://github.com/jblancoh/ranked-vote/graphs/contributors)
Powered by open-source technologies

📞 Contact and Community

GitHub: [@jblancoh](https://github.com/jblancoh)
Issues: [Report a bug or request a feature](https://github.com/jblancoh/ranked-vote/issues)
Community: Dev Night Talk - Every Thursday 7-10 PM

🗺️ Roadmap

- Email verification for votes
- Admin dashboard
- Multiple voting methods (ranked, approval, scoring)
- Export results to PDF/CSV
- Internationalization (more languages)
- Mobile app (React Native)
- Social media sharing
- Voting deadline/scheduling

❤️ Support
If you find this project useful, please consider:

⭐ Starring the repository
🐛 Reporting bugs
💡 Suggesting new features
🤝 Contributing code
📢 Sharing with your community

Made with ❤️ by the Dev Night Talk community in Villahermosa, Tabasco 🇲🇽

