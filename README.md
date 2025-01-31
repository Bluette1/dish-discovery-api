# Dish Discovery API

This is the API site for the Dish Discovery application, designed to provide recipe data based on user preferences and dietary restrictions.

## Overview

The Dish Discovery API allows users to search for recipes using specific ingredients and filter them according to various dietary needs. It is built to support the Dish Discovery web application, enabling seamless integration and functionality.

## Technologies Used

- **Programming Language**: TypeScript
- **Backend Framework**: Node.js, Express
- **Database**: MongoDB
- **Environment Management**: dotenv for managing environment variables

## Getting Started

To get started with the Dish Discovery API, follow these instructions:

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Bluette1/dish-discovery-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd dish-discovery-api
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file based on the `.env_example` provided in the root directory.
2. Set your environment variables as needed.

### Running the Application

1. Start the server:

   ```bash
   npm start
   ```

2. The API will be available at `http://localhost:5000` .

## API Endpoints

Here are some example endpoints you can use:

- **GET /meals**: Retrieve a list of dishes.
- **GET /meals?category=categoryName**: Retrieve a list of dishes by category.
- **GET /meals?name=mealName**: Retrieve details of a specific dish by meal name.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Images courtesy of [Getty Images](https://www.gettyimages.com/)

```

