# DriveWise - Driving School Management System

## Overview
DriveWise is a comprehensive web application designed to facilitate the management of driving schools, instructors, and clients. This project serves as a prototype that includes a variety of organized features aimed at enhancing the user experience for both instructors and clients. 

## Features
- **User Registration and Login**: Secure registration and login for clients and instructors with email validation and password hashing.
- **Role Management**: Different roles for users (clients and instructors) with specific functionalities.
- **Profile Management**: Users can manage their profiles, including personal information and contact details.
- **Search Functionality**: Clients can search for driving schools based on location, ratings, and services offered.
- **Responsive Design**: The application is designed to be responsive, ensuring a seamless experience across devices.
- **Secure Authentication**: Utilizes JWT (JSON Web Tokens) for secure user authentication and session management.
- **Email Validation**: Only authorized email addresses are accepted for registration and login.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcrypt for password hashing
- **Version Control**: Git, GitHub

## Installation
To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/drivewise.git
   cd drivewise
   ```

2. **Install dependencies**:
   For the backend:
   ```bash
   cd backend
   npm install
   ```

   For the frontend (if applicable):
   ```bash
   cd public
   # If you have a frontend build process, run it here
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `backend` directory and add your environment variables, such as:
   ```plaintext
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_uri
   ```

4. **Run the application**:
   Start the backend server:
   ```bash
   cd backend
   npm start
   ```

   The application should now be running on `http://localhost:5000`.

## Future Work
This project is currently a prototype, and we are actively working on enhancing its features and functionalities. Our goal is to develop it into a fully-fledged application that caters to a wider audience, including mobile app support.

## Contributing
We welcome contributions to improve the project. If you have suggestions or would like to contribute, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or feedback, please reach out to bonagirisanjana1116@gmail.com.
