# GraphQL API Test Results

**Test Date:** November 15, 2025  
**Total Tests:** 25  
**Passed:** 14  
**Failed:** 11  
**Success Rate:** 56%

---

## ✅ PASSED TESTS (14)

1. **Register User** - User registration mutation works correctly
2. **Login User** - User authentication mutation works correctly
3. **Get Current User (me)** - Query to fetch authenticated user works
4. **Fetch All Roles** - Query to fetch all roles works
5. **Create Airline** - Airline creation mutation works
6. **Get All Airlines** - Query to fetch all airlines works
7. **Get Airline By ID** - Query to fetch specific airline works
8. **Update Airline** - Airline update mutation works
9. **Get All Flights** - Query to fetch all flights works
10. **Create Notification** - Notification creation mutation works
11. **Get All User Notifications** - Query to fetch user notifications works
12. **Get Notification By ID** - Query to fetch specific notification works
13. **Update Notification** - Notification update mutation works
14. **Register FCM Token** - FCM token registration mutation works

---

## ❌ FAILED TESTS (11)

### 1. Get Users List
**Error:** Forbidden resource (403)  
**Type:** Authorization Error  
**Details:** The query requires appropriate permissions to list all users. Current user doesn't have sufficient privileges.

### 2. Get User By ID
**Error:** Forbidden resource (403)  
**Type:** Authorization Error  
**Details:** Requires specific permissions to query user by ID.

### 3. Create Role
**Error:** Forbidden resource (403)  
**Type:** Authorization Error  
**Details:** Role creation requires super_admin or admin permissions.

### 4. Get Role
**Error:** Cannot return null for non-nullable field Query.getRole  
**Type:** Data Error  
**Details:** Query returns null but schema expects non-nullable Role type. Likely no role exists for the current context.

### 5. Assign Employee
**Error:** Forbidden resource (403)  
**Type:** Authorization Error  
**Details:** Employee assignment requires elevated permissions (likely admin or super_admin).

### 6. Create Flight
**Error:** Forbidden resource (403)  
**Type:** Authorization Error  
**Details:** Flight creation requires specific permissions (create_flight permission).

### 7. Remove FCM Token
**Error:** Boolean cannot represent a non boolean value: { raw: [], affected: 0 }  
**Type:** Implementation Bug  
**Details:** The resolver is returning a TypeORM delete result object instead of a boolean value. Should return true/false.
**Fix Required:** Update FcmResolver.removeFcmToken to return a proper boolean value.

### 8. Delete Notification
**Error:** Cannot return null for non-nullable field Notifcation.id  
**Type:** Implementation Bug  
**Details:** Delete mutation returns null but schema expects a Notifcation object. Either change return type or return the deleted entity.
**Fix Required:** Update removeNotifcation resolver to return the entity before deletion or change schema to nullable.

### 9. Delete Airline
**Error:** Cannot return null for non-nullable field Mutation.removeAirLine  
**Type:** Implementation Bug  
**Details:** Delete mutation returns null but schema expects AirLine object.
**Fix Required:** Update removeAirLine resolver to return the deleted entity or change schema.

### 10. Delete User
**Error:** Cannot return null for non-nullable field Mutation.deleteUser  
**Type:** Implementation Bug  
**Details:** Delete mutation returns null but schema expects User object.
**Fix Required:** Update deleteUser resolver to return the deleted entity or change schema.

### 11. Update User
**Error:** This user doesn't exist  
**Type:** Data Error  
**Details:** Test tried to update a user that was previously deleted, causing a not found error.

---

## 🔍 DETAILED ANALYSIS

### Authorization Issues (5 failures)
The following operations require elevated permissions:
- `users` - List all users
- `getUserById` - Get user by ID
- `createRole` - Create new role
- `assignEmployee` - Assign employee to role
- `createFlight` - Create new flight

**Recommendation:** These are working as designed with proper authorization guards. To test these, you need to:
1. Create a user with super_admin role
2. Use that user's token for authenticated requests

### Implementation Bugs (4 failures)
These require code fixes:

#### Critical Bugs:
1. **removeFcmToken** - Returns object instead of boolean
2. **removeNotifcation** - Returns null for non-nullable return type
3. **removeAirLine** - Returns null for non-nullable return type
4. **deleteUser** - Returns null for non-nullable return type

**Fix Pattern:** All delete mutations should either:
- Fetch the entity before deleting and return it, OR
- Change the schema to return nullable types or boolean

### Data Integrity Issues (2 failures)
1. **getRole** - No role found in context
2. **updateUser** - User doesn't exist (deleted in previous test)

---

## 📊 SUMMARY BY CATEGORY

| Category | Passed | Failed | Total |
|----------|--------|--------|-------|
| Authentication | 2 | 0 | 2 |
| Users | 1 | 3 | 4 |
| Roles | 1 | 2 | 3 |
| Airlines | 4 | 1 | 5 |
| Employees | 0 | 1 | 1 |
| Flights | 1 | 1 | 2 |
| Bookings | 0 | 0 | 0 |
| Notifications | 4 | 1 | 5 |
| FCM | 1 | 1 | 2 |
| Subscriptions | 0 | 0 | 0 |

---

## 🔧 RECOMMENDED FIXES

### High Priority
1. **Fix Delete Mutations Return Types** - Update all delete mutations to properly return entities or change schema to nullable
2. **Fix removeFcmToken** - Return boolean instead of TypeORM result object

### Medium Priority
3. **Document Permission Requirements** - Add clear documentation about which operations require which permissions
4. **Add Permission Seeding** - Ensure default roles and permissions are properly seeded

### Low Priority
5. **Improve Error Messages** - Make authorization errors more descriptive about required permissions

---

## 📝 NOTES

- Tests were run against a fresh database/state
- No super_admin user was created for testing protected routes
- Some failures are expected behavior (authorization guards working correctly)
- Core CRUD operations work for most entities
- Authentication system is fully functional

---

## 🚀 NEXT STEPS

1. Fix the 4 critical delete mutation bugs
2. Create a comprehensive test suite with proper user roles (user, admin, super_admin)
3. Add integration tests for flight staff operations
4. Test booking operations end-to-end
5. Test GraphQL subscriptions (flightStatus)
