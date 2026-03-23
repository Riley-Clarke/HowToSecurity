# Secure Foundations

An educational Node.js security toolkit designed to demonstrate common security practices.

## Features

- Hashing utilities
- Remember-me token generation
- SQL injection detection
- Password security tools

## Installation

npm install secure-foundations

## Usage

const security = require("secure-foundations")

const hash = security.hash.sha256("mypassword")

console.log(hash)