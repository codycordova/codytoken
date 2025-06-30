# Cody Token Website

This is the official website for the $CODY Token, a digital currency on the Stellar Blockchain. The website is a modern, responsive single-page application built with Next.js and showcases information about the token, its price history, and more.

## ✨ Features

- **3D Token Visualization**: An interactive 3D model of the CODY token.
- **Dynamic Text Effects**: Graffiti-style text animations for a unique visual experience.
- **Stellar Blockchain Integration**: Displays real-time token summary and price history from Stellar.Expert.
- **Responsive Design**: Adapts to various screen sizes, from mobile devices to desktops.
- **Wallet Connectivity**: Allows users to connect their Stellar wallets.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/codycordova/codytoken.git
    cd codytoken
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org/)**: React framework for production.
- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Typed superset of JavaScript.
- **[Three.js](https://threejs.org/) / [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)**: For rendering the 3D model.
- **[Stellar Blockchain](https://www.stellar.org/)**: The decentralized network where the CODY token resides.
- **[CSS Modules](https://github.com/css-modules/css-modules)**: For modular and reusable CSS.

## ☁️ Deployment

This project is deployed on [Fly.io](https://fly.io/). To deploy your own version, you can use the `flyctl` CLI:

```bash
fly deploy
```
