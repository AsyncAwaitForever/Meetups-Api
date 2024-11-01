# Meetups API

Group examination

![Serverless_4.4.7](https://img.shields.io/badge/Serverless_4.4.7-red)

A serverless REST API built with AWS Lambda, DynamoDB, and Node.js for managing
meetup events.

## Related Projects

- [Meetups Frontend](https://github.com/AsyncAwaitForever/Meetups--Page) - React frontend application for this API

## Features

### User Authentication

- Register new account
- Login to access meetup features

### Meetups Management

- View list of upcoming meetups
- View detailed meetup information
- Search meetups by keywords
- Filter meetups by:
  - Date
  - Location
  - Category

### Registration System

- Register for meetups
- Unregister from meetups
- View registration status
- Automatic capacity management
- Prevention of registration for past events

### User Profile

- View registered meetups
- Track meetup history

### Review System

- Rate meetups (1-5 stars)
- Add text reviews
- View other users' reviews

## Technical Stack

- **Runtime**: Node.js 20.x
- **Framework**: AWS Serverless
- **Database**: Amazon DynamoDB
- **Authentication**: JWT
- **Validation**: VineJS

## Dependencies

**List of main dependencies used in the project:**

- aws-sdk/client-dynamodb: 3.679.0
- aws-sdk/lib-dynamodb: 3.679.0
- middy/core: 5.5.1
- vinejs/vine: 2.1.0
- bcryptjs: 2.4.3
- jsonwebtoken: 9.0.2
- uuid: 11.0.1

## API Endpoints

**Meetups**

- **GET `/meetups`:** List all meetups
  
- **GET `/meetups/search?keyword={keyword}`:** Search meetups
```bash Query Parameters: 
- keyword (string): Search term for title or description
```

- **GET `//meetups/filter?date={date}&category={category}&location={location}`:** Filter meetups
```bash Query Parameters:
  - date (string, YYYY-MM-DD): "2024-11-01"
  - category (string): "technology"
  - location (string): "Stockholm"
Example: /meetups/filter?date=2024-11-01&category=technology
```

- **GET `/meetups/{meetupId}`:** Get meetup details
```bash Path Parameters:
  - meetupId (string): UUID of the meetup
```

**Registrations**

- **POST `/meetups/{meetupId}/register`:** Register for meetup
```bash Path Parameters:
  - meetupId (string): UUID of the meetup
Headers:
  - Authorization: Bearer {token}
Body: None required
```

- **DELETE `/meetups/{meetupId}/unregister`:** Unregister from meetup
```bash Path Parameters:
  - meetupId (string): UUID of the meetup
Headers:
  - Authorization: Bearer {token}
Body: None required
```

**User**

- **POST `/signup`:** Create a new user account
```bash Body:
{
 "email": string,        // Valid email format
 "password": string,     // Min 3 and max 30 characters
 "username": string      // Min 2 and max 30 characters
}
```

- **POST `/login`:** Authenticate a user and receive a JWT
```bash Body:
{
 "email": string,        // Valid email format
 "password": string,     // Min 3 and max 30 characters
}
```

- **GET `/profile`:** Get user's meetup history
```bash Headers:
  - Authorization: Bearer {token}
```

**Reviews**

- **POST `/meetups/{meetupId}/ratings`:** Add review
```bash Path Parameters:
  - meetupId (string): UUID of the meetup
Headers:
  - Authorization: Bearer {token}
Body:
{
  "stars": number/string (1-5),
  "text": string
}
```

- **GET `/meetups/{meetupId}/ratings`:** Get meetup reviews
```bash Path Parameters:
 - meetupId (string): UUID of the meetup
```

## Team

- Backend Developer: [PAUL](https://github.com/ELSOLRA)
- Backend Developer: [TOBIAS](https://github.com/Tobiasa123)

- Frontend Developer: [Daniel](https://github.com/daniel-budai)
- Frontend Developer: [Emanuele](https://github.com/Emadenni)
- Frontend Developer: [Ahmed](https://github.com/Ahmed-a287)

---

Developed as part of [School/YH - Folkuniversitetet] project, 2024