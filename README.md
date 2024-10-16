# [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Title
GiveEasy

## Table of Contents
- [Description](#description)
- [Installations](#installations)
- [How to Use This Application](#usage)
- [Testing](#testing)
- [Contributors](#contributors)
- [Questions](#questions)
- [GitHub](#github)
- [Notes](#notes)

## Description

A platform where users can create fundraisers for charitable causes, and donors can make contributions.

### Features

- User authentication for fundraiser creators and donors.
- REST API for managing fundraisers and donations.
- Integration with Stripe for donations.
- Responsive UI to allow users to easily browse fundraisers.

### User Story: 

```md
As a compassionate user, I want to easily browse and donate to fundraisers of my choice, so that I can support causes I care about and help them reach their fundraising goals.
```

### Acceptance Criteria

```md
Given I am a visitor to the platform, when I navigate to the homepage, then I should see a list of active fundraisers, each showing a title, description, current total, and donation goal.

Given I am not logged in, when I try to create a new fundraiser or make a donation, then I should be prompted to log in or create an account.

Given I am a logged-in user, when I fill out the "Create Fundraiser" form with a title, description, goal amount, and optional image, then I should see my new fundraiser appear on the homepage.

Given I am viewing a specific fundraiser page, when I click the “Donate” button and enter an amount, then I should be directed to Stripe to complete the donation securely.

Given I am a logged-in user who has donated, when I complete my donation, then I should see my donation reflected in the fundraiser's total, and my donation history should appear in my profile.

Given I am a logged-in user, when I navigate to my profile, then I should see a list of fundraisers I have created and donations I have made.

Given I am on the platform, when I view the site on a mobile device, then I should see a responsive and mobile-friendly layout that is easy to navigate.
```

## Installations

### Backend Dependencies
```md
Express: for setting up my server.

Mongoose: To interact with my MongoDB database using models.

Jsonwebtoken: For user authentication.

Bcrypt: For password hashing and security.

Cors: To allow cross-origin requests between my frontend and backend.

Dotenv: To store sensitive data like API keys and secret tokens in environment variables.
```

### Frontend Dependencies
```md
React: The framework for building my front-end.

JWT Decode: To handle decoding JSON web tokens on the client side.

Axios: For making HTTP requests.
```

### Development & Utilities
```md
Nodemon: For automatically restarting my server during development.

Concurrently: To run both backend and frontend servers simultaneously.

ESLint: For linting and code quality checks.
```

### Authentication & Payments
```md
Stripe: For handling payments.

Stripe React Elements: For integrating the Stripe payment form in my React frontend.
```

## Usage
Fundraising

Example screenshots: 

![Login](/frontend/public/images/home1.png)

![Screenshot](/images/screenshot.png)

![Logo](/images/logo.png)

![Screenshot](/images/screenshot.png)

## Notes

Have reached MVP for now. 

To do: 
- Update Current Total when making a donation.
- Admin panel to review and approve fundraisers.
- User profiles.
- Add logout button and navigation bar.
- PWA functionality to make the site installable and usable offline.
- More...

## Testing

## Contributors
Me

## Questions
[Email Me Here](touya1313@hotmail.com)

## GitHub
[GitHub Repo](https://github.com/Gera1313)

[Deployed Site]()