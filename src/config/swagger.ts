import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skillbridge API",
      version: "1.0.0",
      description: "Freelance service marketplace REST API",
      contact: { name: "Skillbridge Team" },
    },
    servers: [
      { url: "http://localhost:5000", description: "Local development server" },
      { url: "http://localhost:5000/api", description: "API base path" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", minLength: 2, maxLength: 100 },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["ADMIN", "CLIENT", "FREELANCER"] },
            phone: { type: "string", nullable: true },
            profileImg: { type: "string", format: "uri", nullable: true },
            bio: { type: "string", maxLength: 500, nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
          },
        },
        RefreshTokenResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            icon: { type: "string", maxLength: 50, nullable: true },
            serviceCount: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Service: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number", format: "decimal" },
            deliveryDays: { type: "integer" },
            thumbnail: { type: "string", format: "uri", nullable: true },
            gallery: { type: "array", items: { type: "string", format: "uri" } },
            tools: { type: "array", items: { type: "string" } },
            highlights: { type: "array", items: { type: "string" } },
            whatYouGet: { type: "array", items: { type: "string" } },
            packageName: { type: "string", nullable: true },
            packageFeatures: { type: "array", items: { type: "string" } },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE", "DRAFT"],
            },
            avgRating: { type: "number", nullable: true },
            reviewCount: { type: "integer" },
            categoryId: { type: "string", format: "uuid" },
            category: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                icon: { type: "string", nullable: true },
              },
            },
            freelancerId: { type: "string", format: "uuid" },
            freelancer: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                profileImg: { type: "string", nullable: true },
                bio: { type: "string", nullable: true },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            status: {
              type: "string",
              enum: ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            },
            totalPrice: { type: "number", format: "decimal" },
            requirement: { type: "string", nullable: true },
            clientId: { type: "string", format: "uuid" },
            client: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                profileImg: { type: "string", nullable: true },
                email: { type: "string" },
              },
            },
            serviceId: { type: "string", format: "uuid" },
            service: { $ref: "#/components/schemas/ServiceSummary" },
            review: {
              type: "object",
              properties: {
                id: { type: "string" },
                rating: { type: "integer" },
              },
              nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ServiceSummary: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            price: { type: "number" },
            thumbnail: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE", "DRAFT"],
            },
            category: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                icon: { type: "string", nullable: true },
              },
            },
            freelancer: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                profileImg: { type: "string", nullable: true },
              },
            },
          },
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", maxLength: 500, nullable: true },
            clientId: { type: "string", format: "uuid" },
            client: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                profileImg: { type: "string", nullable: true },
              },
            },
            serviceId: { type: "string", format: "uuid" },
            service: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
              },
            },
            orderId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 42 },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: {},
            meta: { $ref: "#/components/schemas/PaginationMeta" },
          },
        },
        ErrorSource: {
          type: "object",
          properties: {
            path: { type: "string" },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errorSources: {
              type: "array",
              items: { $ref: "#/components/schemas/ErrorSource" },
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", minLength: 2, maxLength: 100 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            role: { type: "string", enum: ["CLIENT", "FREELANCER"] },
            phone: { type: "string", minLength: 7, maxLength: 20, nullable: true },
            bio: { type: "string", maxLength: 500, nullable: true },
            profileImg: { type: "string", format: "uri", nullable: true },
          },
          example: {
            name: "Rakib Hasan",
            email: "rakib@example.com",
            password: "StrongPass123!",
            role: "FREELANCER",
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 1 },
          },
          example: {
            email: "rakib@example.com",
            password: "StrongPass123!",
          },
        },
        RefreshTokenRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" },
          },
          example: {
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2, maxLength: 100 },
            phone: { type: "string", minLength: 7, maxLength: 20 },
            bio: { type: "string", maxLength: 500 },
            profileImg: { type: "string", format: "uri" },
          },
        },
        CreateServiceRequest: {
          type: "object",
          required: ["title", "description", "price", "deliveryDays", "categoryId"],
          properties: {
            title: { type: "string", minLength: 5, maxLength: 200 },
            description: { type: "string", minLength: 10, maxLength: 2000 },
            price: { type: "number", exclusiveMinimum: 0 },
            deliveryDays: { type: "integer", minimum: 1, maximum: 365 },
            categoryId: { type: "string", format: "uuid" },
            thumbnail: { type: "string", format: "uri", nullable: true },
            gallery: { type: "array", items: { type: "string", format: "uri" }, maxItems: 10 },
            tools: { type: "array", items: { type: "string", maxLength: 50 }, maxItems: 20 },
            highlights: {
              type: "array",
              items: { type: "string", maxLength: 100 },
              maxItems: 20,
            },
            whatYouGet: {
              type: "array",
              items: { type: "string", maxLength: 100 },
              maxItems: 20,
            },
            packageName: { type: "string", maxLength: 100, nullable: true },
            packageFeatures: {
              type: "array",
              items: { type: "string", maxLength: 100 },
              maxItems: 20,
            },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE", "DRAFT"] },
          },
          example: {
            title: "I will build a responsive React website",
            description: "Full responsive website using React + Tailwind",
            price: 4500,
            deliveryDays: 5,
            categoryId: "550e8400-e29b-41d4-a716-446655440001",
            thumbnail: "https://example.com/thumb.png",
          },
        },
        CreateOrderRequest: {
          type: "object",
          required: ["serviceId"],
          properties: {
            serviceId: { type: "string", format: "uuid" },
            requirement: { type: "string", maxLength: 2000, nullable: true },
          },
          example: {
            serviceId: "550e8400-e29b-41d4-a716-446655440001",
            requirement: "I need a portfolio site with 5 pages",
          },
        },
        UpdateOrderStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            },
          },
          example: {
            status: "ACCEPTED",
          },
        },
        CreateReviewRequest: {
          type: "object",
          required: ["orderId", "serviceId", "rating"],
          properties: {
            orderId: { type: "string", format: "uuid" },
            serviceId: { type: "string", format: "uuid" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", maxLength: 500, nullable: true },
          },
          example: {
            orderId: "550e8400-e29b-41d4-a716-446655440002",
            serviceId: "550e8400-e29b-41d4-a716-446655440001",
            rating: 5,
            comment: "Great work, delivered on time!",
          },
        },
        UpdateReviewRequest: {
          type: "object",
          properties: {
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", maxLength: 500 },
          },
        },
      },
    },
  },
  apis: [
    "./src/app.ts",
    "./src/routes/auth.routes.ts",
    "./src/routes/user.routes.ts",
    "./src/routes/category.routes.ts",
    "./src/routes/service.routes.ts",
    "./src/routes/order.routes.ts",
    "./src/routes/review.routes.ts",
    "./src/services/auth/auth.controller.ts",
    "./src/services/user/user.controller.ts",
    "./src/services/category/category.controller.ts",
    "./src/services/serviceListing/service.controller.ts",
    "./src/services/order/order.controller.ts",
    "./src/services/review/review.controller.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
