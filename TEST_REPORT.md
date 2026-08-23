# Test Report

Generated via 
pm test -- --coverage. 44 tests covering authentication (register/login), authorization middleware (JWT verification, admin role checks), vehicle CRUD, search filtering, and inventory purchase/restock logic including zero-stock and race-condition edge cases.

---

```
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------|---------|----------|---------|---------|-------------------
All files              |   97.64 |    80.82 |     100 |   97.64 |                   
 src                   |     100 |      100 |     100 |     100 |                   
  app.js               |     100 |      100 |     100 |     100 |                   
 src/controllers       |   95.23 |    38.88 |     100 |   95.23 |                   
  authController.js    |     100 |       50 |     100 |     100 | 9-19              
  vehicleController.js |   93.33 |    35.71 |     100 |   93.33 | 25,34             
 src/db                |     100 |       50 |     100 |     100 |                   
  database.js          |     100 |       50 |     100 |     100 | 5                 
 src/middleware        |     100 |      100 |     100 |     100 |                   
  authMiddleware.js    |     100 |      100 |     100 |     100 |                   
 src/routes            |     100 |      100 |     100 |     100 |                   
  authRoutes.js        |     100 |      100 |     100 |     100 |                   
  vehicleRoutes.js     |     100 |      100 |     100 |     100 |                   
 src/services          |   97.36 |    95.55 |     100 |   97.36 |                   
  authService.js       |   95.23 |    92.85 |     100 |   95.23 | 8                 
  vehicleService.js    |   98.18 |    96.77 |     100 |   98.18 | 6                 
 src/utils             |     100 |      100 |     100 |     100 |                   
  AppError.js          |     100 |      100 |     100 |     100 |                   
-----------------------|---------|----------|---------|---------|-------------------
```
