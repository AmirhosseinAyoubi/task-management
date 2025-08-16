# Jobs API

A comprehensive REST API for job management and applications with automatic Swagger documentation.

## Features

- **Automatic API Documentation**: Swagger/OpenAPI 3.0 documentation generated from JSDoc comments
- **TypeScript**: Full TypeScript support with type safety
- **MongoDB**: MongoDB with Mongoose ODM
- **Express.js**: Fast and flexible web framework
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Comprehensive input validation
- **Error Handling**: Centralized error handling

## Swagger Documentation

The API includes comprehensive Swagger documentation that is automatically generated from JSDoc comments. You can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

### How Swagger Documentation Works

The Swagger documentation is generated dynamically from JSDoc comments in your code. Here's how it works:

#### 1. Schema Documentation (Models)

Document your Mongoose models with JSDoc comments:

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: Unique username for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 */
export interface IUser extends Document {
    username: string;
    email: string;
    // ... other properties
}
```

#### 2. API Endpoint Documentation (Controllers)

Document your API endpoints with JSDoc comments:

```typescript
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
export const getAllUsers = async (req: Request, res: Response) => {
    // Implementation
};
```

#### 3. Route Documentation (Routes)

You can also document routes directly:

```typescript
/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', (req, res) => {
    // Implementation
});
```

### Swagger Configuration

The Swagger configuration is in `src/configs/swagger.ts`:

```typescript
const options = {
    swaggerDefinition,
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/models/*.ts'
    ],
    failOnErrors: true,
    definition: {
        openapi: '3.0.0'
    }
};
```

This configuration tells swagger-jsdoc to look for JSDoc comments in:
- All TypeScript files in the `routes` directory
- All TypeScript files in the `controllers` directory  
- All TypeScript files in the `models` directory

## Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start development server
pnpm dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jobsapi
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## API Endpoints

### Users
- `GET /api/v1/users` - Get all users (with pagination and filtering)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Health Check
- `GET /api/v1/health` - API health check

## Development

### Adding New Endpoints

1. **Create the Model** (if needed):
   ```typescript
   // src/models/YourModel.ts
   /**
    * @swagger
    * components:
    *   schemas:
    *     YourModel:
    *       type: object
    *       properties:
    *         // ... define your schema
    */
   ```

2. **Create the Controller**:
   ```typescript
   // src/controllers/yourController.ts
   /**
    * @swagger
    * /api/v1/your-endpoint:
    *   get:
    *     summary: Your endpoint summary
    *     // ... define your endpoint
    */
   export const yourFunction = async (req: Request, res: Response) => {
       // Implementation
   };
   ```

3. **Create the Routes**:
   ```typescript
   // src/routes/yourRoutes.ts
   import { Router } from 'express';
   import { yourFunction } from '../controllers/yourController';
   
   const router = Router();
   router.get('/', yourFunction);
   export default router;
   ```

4. **Add to Main Routes**:
   ```typescript
   // src/routes/index.ts
   import yourRoutes from './yourRoutes';
   router.use('/your-endpoint', yourRoutes);
   ```

### Swagger Best Practices

1. **Use Descriptive Summaries**: Make your endpoint summaries clear and concise
2. **Group Related Endpoints**: Use tags to group related endpoints
3. **Document All Parameters**: Include query, path, and body parameters
4. **Provide Examples**: Include realistic examples in your schemas
5. **Document Error Responses**: Include all possible error responses
6. **Use Schema References**: Reference schemas instead of duplicating them

### Example JSDoc Structure

```typescript
/**
 * @swagger
 * /api/v1/endpoint:
 *   method:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query|path|header
 *         name: parameterName
 *         required: true|false
 *         schema:
 *           type: string|number|boolean|object|array
 *         description: Parameter description
 *     requestBody:
 *       required: true|false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchemaName'
 *     responses:
 *       200:
 *         description: Success description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 *       400:
 *         description: Error description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

## Testing the API

1. Start the server: `pnpm dev`
2. Open your browser to: `http://localhost:3000/api-docs`
3. Use the interactive Swagger UI to test your endpoints
4. You can also use tools like Postman or curl

## Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## Contributing

1. Follow the existing code structure
2. Add comprehensive JSDoc comments for Swagger documentation
3. Include proper error handling
4. Add validation where necessary
5. Test your endpoints using the Swagger UI

## License

MIT
