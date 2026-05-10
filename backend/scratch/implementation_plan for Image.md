# Implement Full Images Module

This plan outlines the creation of a complete Images module following the established MVC architecture of the backend.

## User Review Required

> [!IMPORTANT]
> The new module will utilize the previously optimized `ImageManager` for specialized lookups while maintaining compatibility with the `BaseModel` for standard CRUD operations.

## Proposed Changes

### [Backend Data Layer]

#### [MODIFY] [resources.js](file:///Users/mac/MyLocal/gitwork/dhtn-v2/backend/data/resources.js)
- Add `IMAGE: 'image'` to the `RESOURCES` object.

### [Backend Logic Layer]

#### [NEW] [imageValidation.js](file:///Users/mac/MyLocal/gitwork/dhtn-v2/backend/validations/imageValidation.js)
- Define validation rules for creating and updating image records.
- Required fields: `student_id`, `url`, `timestamp`.

#### [NEW] [ImageModel.js](file:///Users/mac/MyLocal/gitwork/dhtn-v2/backend/models/ImageModel.js)
- Inherit from `BaseModel`.
- Integrate `ImageManager` for:
    - `findByStudentId(studentId)`
    - `findByTimestamp(timestamp)`
    - `findByTimeRange(startDate, endDate)`

#### [NEW] [ImageController.js](file:///Users/mac/MyLocal/gitwork/dhtn-v2/backend/controllers/ImageController.js)
- Standard CRUD methods: `getAll`, `getById`, `create`, `update`, `delete`.
- Specialized methods:
    - `getImagesByStudent(req, res)`
    - `getImagesByRange(req, res)`

### [Backend API Layer]

#### [NEW] [imageRoutes.js](file:///Users/mac/MyLocal/gitwork/dhtn-v2/backend/routes/imageRoutes.js)
- Define RESTful endpoints for images.
- Apply `authorize` middleware with `RESOURCES.IMAGE`.

#### [MODIFY] [server.js](file:///Users/mac/MyLocal/gitwork/dhtn-v2/backend/server.js)
- Register `imageRoutes` under the `/images` path with authentication.

## Verification Plan

### Automated Tests
- Create `scratch/test_image_module.js` to:
    - Verify all CRUD endpoints.
    - Verify optimized filtering endpoints (Student ID, Date Range).

### Manual Verification
- Use the browser or `curl` to test the `/images` endpoints.
