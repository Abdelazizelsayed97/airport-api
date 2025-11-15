const http = require('http');

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

// Store test results
const results = {
  passed: [],
  failed: []
};

// Test user credentials
let authToken = '';
let testUserId = '';
let testAirLineId = '';
let testFlightId = '';
let testBookId = '';
let testEmployeeId = '';
let testRoleId = '';
let testNotificationId = '';
let testFightStaffId = '';

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testQuery(name, query, variables = {}) {
  console.log(`\nTesting: ${name}`);
  try {
    const result = await makeGraphQLRequest(query, variables);
    if (result.errors) {
      console.log(`❌ FAILED: ${name}`);
      console.log('Errors:', JSON.stringify(result.errors, null, 2));
      results.failed.push({ name, errors: result.errors });
      return null;
    } else {
      console.log(`✅ PASSED: ${name}`);
      results.passed.push(name);
      return result.data;
    }
  } catch (error) {
    console.log(`❌ FAILED: ${name}`);
    console.log('Error:', error.message);
    results.failed.push({ name, error: error.message });
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting GraphQL API Tests...\n');
  console.log('=' .repeat(60));

  // ========== AUTH MUTATIONS ==========
  console.log('\n📝 AUTHENTICATION MUTATIONS');
  console.log('=' .repeat(60));

  const registerResult = await testQuery(
    'Register User',
    `mutation Register($input: RegisterInput!) {
      register(registerInput: $input) {
        id
        email
        name
        token
      }
    }`,
    {
      input: {
        email: `test${Date.now()}@test.com`,
        password: 'Test123!@#',
        name: 'Test User',
        passportNumber: `PASS${Date.now()}`,
        role: 'user',
        fcmToken: 'test-fcm-token'
      }
    }
  );

  if (registerResult && registerResult.register) {
    testUserId = registerResult.register.id;
    authToken = registerResult.register.token;
  }

  const loginResult = await testQuery(
    'Login User',
    `mutation Login($input: SignInDto!) {
      login(loginInput: $input) {
        id
        email
        token
      }
    }`,
    {
      input: {
        email: registerResult?.register?.email || 'test@test.com',
        password: 'Test123!@#',
        fcmToken: 'test-fcm-token'
      }
    }
  );

  if (loginResult && loginResult.login) {
    authToken = loginResult.login.token;
  }

  // ========== USER QUERIES ==========
  console.log('\n👥 USER QUERIES');
  console.log('=' .repeat(60));

  await testQuery(
    'Get Current User (me)',
    `query Me {
      me {
        id
        email
        name
      }
    }`
  );

  await testQuery(
    'Get Users List',
    `query Users($paginate: PaginationInput) {
      users(paginate: $paginate) {
        id
        email
        name
      }
    }`,
    { paginate: { page: 1, limit: 10 } }
  );

  if (testUserId) {
    await testQuery(
      'Get User By ID',
      `query GetUser($id: String!) {
        getUserById(id: $id) {
          id
          email
          name
        }
      }`,
      { id: testUserId }
    );
  }

  // ========== ROLE MUTATIONS & QUERIES ==========
  console.log('\n🎭 ROLE MUTATIONS & QUERIES');
  console.log('=' .repeat(60));

  const roleResult = await testQuery(
    'Create Role',
    `mutation CreateRole($input: CreateRoleInput!) {
      createRole(createRoleInput: $input) {
        id
        name
        permissions
      }
    }`,
    {
      input: {
        name: `TestRole${Date.now()}`,
        permissions: ['view', 'create']
      }
    }
  );

  if (roleResult && roleResult.createRole) {
    testRoleId = roleResult.createRole.id;
  }

  await testQuery(
    'Fetch All Roles',
    `query FetchRoles {
      fetchRoles {
        id
        name
        permissions
      }
    }`
  );

  if (testRoleId) {
    await testQuery(
      'Get Role',
      `query GetRole {
        getRole {
          id
          name
          permissions
        }
      }`
    );

    await testQuery(
      'Remove Role',
      `query RemoveRole {
        removeRole
      }`
    );
  }

  // ========== AIRLINE MUTATIONS & QUERIES ==========
  console.log('\n✈️  AIRLINE MUTATIONS & QUERIES');
  console.log('=' .repeat(60));

  const airlineResult = await testQuery(
    'Create Airline',
    `mutation CreateAirline($input: CreateAirLineInput!) {
      createAirLine(createAirLineInput: $input) {
        id
        name
        country
      }
    }`,
    {
      input: {
        name: `Test Airline ${Date.now()}`,
        country: 'USA'
      }
    }
  );

  if (airlineResult && airlineResult.createAirLine) {
    testAirLineId = airlineResult.createAirLine.id;
  }

  await testQuery(
    'Get All Airlines',
    `query GetAirlines($pagination: PaginationInput) {
      airLines(paginationInput: $pagination) {
        id
        name
        country
      }
    }`,
    { pagination: { page: 1, limit: 10 } }
  );

  if (testAirLineId) {
    await testQuery(
      'Get Airline By ID',
      `query GetAirline($id: String!) {
        airLine(id: $id) {
          id
          name
          country
        }
      }`,
      { id: testAirLineId }
    );

    await testQuery(
      'Update Airline',
      `mutation UpdateAirline($input: UpdateAirLineInput!) {
        updateAirLine(updateAirLineInput: $input) {
          id
          name
          country
        }
      }`,
      {
        input: {
          id: testAirLineId,
          name: 'Updated Airline'
        }
      }
    );
  }

  // ========== EMPLOYEE MUTATIONS & QUERIES ==========
  console.log('\n👔 EMPLOYEE MUTATIONS & QUERIES');
  console.log('=' .repeat(60));

  if (testUserId) {
    const employeeResult = await testQuery(
      'Assign Employee',
      `mutation AssignEmployee($input: CreateEmployeeInput!) {
        assignEmployee(assignToFlightInput: $input) {
          id
          role
        }
      }`,
      {
        input: {
          user_id: testUserId,
          role: 'pilot'
        }
      }
    );

    if (employeeResult && employeeResult.assignEmployee) {
      testEmployeeId = employeeResult.assignEmployee.id;
    }
  }

  await testQuery(
    'Get All Employees',
    `query GetEmployees {
      employees {
        id
        role
      }
    }`
  );

  if (testEmployeeId) {
    await testQuery(
      'Get Employee By ID',
      `query GetEmployee($id: String!) {
        employee(id: $id) {
          id
          role
        }
      }`,
      { id: testEmployeeId }
    );

    await testQuery(
      'Update Employee',
      `mutation UpdateEmployee($input: UpdateEmployeeInput!) {
        updateEmployee(updateEmployeeInput: $input) {
          id
          role
        }
      }`,
      {
        input: {
          id: testEmployeeId,
          role: 'crew'
        }
      }
    );
  }

  // ========== FLIGHT MUTATIONS & QUERIES ==========
  console.log('\n🛫 FLIGHT MUTATIONS & QUERIES');
  console.log('=' .repeat(60));

  const flightResult = await testQuery(
    'Create Flight',
    `mutation CreateFlight($input: CreateFlightMangementInput!) {
      createFlight(createFlightMangementInput: $input) {
        id
        flight_number
        departure_airport
        destination_airport
      }
    }`,
    {
      input: {
        flight_number: `FL${Date.now()}`,
        airline: testAirLineId || 'Test Airline',
        departure_airport: 'JFK',
        destination_airport: 'LAX',
        departure_time: Date.now(),
        arrival_time: Date.now() + 3600000,
        available_seats: 150,
        flight_status: 'on_time'
      }
    }
  );

  if (flightResult && flightResult.createFlight) {
    testFlightId = flightResult.createFlight.id;
  }

  await testQuery(
    'Get All Flights',
    `query GetFlights($pagination: PaginationInput, $filter: FlightsFilterInput) {
      getAllFlights(pagination: $pagination, filter: $filter) {
        id
        flight_number
        departure_airport
        destination_airport
      }
    }`,
    { pagination: { page: 1, limit: 10 } }
  );

  if (testFlightId) {
    await testQuery(
      'Get Flight By ID',
      `query GetFlight($id: String!) {
        flightMangementById(id: $id) {
          id
          flight_number
          departure_airport
          destination_airport
        }
      }`,
      { id: testFlightId }
    );

    await testQuery(
      'Update Flight',
      `mutation UpdateFlight($input: UpdateFlightMangementInput!) {
        updateFlightMangement(updateFlightMangementInput: $input) {
          id
          flight_status
        }
      }`,
      {
        input: {
          id: testFlightId,
          flight_status: 'delayed'
        }
      }
    );
  }

  // ========== FLIGHT STAFF MUTATIONS & QUERIES ==========
  console.log('\n👨‍✈️ FLIGHT STAFF MUTATIONS & QUERIES');
  console.log('=' .repeat(60));

  if (testFlightId && testEmployeeId) {
    const staffResult = await testQuery(
      'Create Flight Staff',
      `mutation CreateFightStaff($input: CreateFightStaffInput!) {
        createFightStaff(createFightStaffInput: $input) {
          id
          name
        }
      }`,
      {
        input: {
          fight_id: testFlightId,
          name: 'Test Crew',
          role: 'crew',
          employeeIds: [testEmployeeId]
        }
      }
    );

    if (staffResult && staffResult.createFightStaff) {
      testFightStaffId = staffResult.createFightStaff.id;
    }
  }

  if (testFightStaffId) {
    await testQuery(
      'Get Flight Staff By ID',
      `query GetFightStaff($id: String!) {
        fightStaff(id: $id) {
          id
          name
        }
      }`,
      { id: testFightStaffId }
    );

    await testQuery(
      'Update Flight Staff',
      `mutation UpdateFightStaff($input: UpdateFightStaffInput!) {
        updateFightStaff(updateFightStaffInput: $input) {
          id
          name
        }
      }`,
      {
        input: {
          id: testFightStaffId,
          name: 'Updated Crew'
        }
      }
    );
  }

  // ========== BOOKING MUTATIONS & QUERIES ==========
  console.log('\n📖 BOOKING MUTATIONS & QUERIES');
  console.log('=' .repeat(60));

  if (testUserId && testFlightId) {
    const bookResult = await testQuery(
      'Create Booking',
      `mutation CreateBook($input: CreateBookInput!) {
        createBook(createBookInput: $input) {
          id
          flightNumber
          seatNumber
        }
      }`,
      {
        input: {
          userId: testUserId,
          flightNumber: flightResult?.createFlight?.flight_number || 'FL123',
          seatNumber: '12A'
        }
      }
    );

    if (bookResult && bookResult.createBook) {
      testBookId = bookResult.createBook.id;
    }
  }

  if (testBookId) {
    await testQuery(
      'Get Booking By ID',
      `query GetBook($id: String!) {
        book(id: $id) {
          id
          flightNumber
          seatNumber
        }
      }`,
      { id: testBookId }
    );

    await testQuery(
      'Update Booking',
      `mutation UpdateBook($input: UpdateBookInput!) {
        updateBook(updateBookInput: $input) {
          id
          seatNumber
        }
      }`,
      {
        input: {
          id: testBookId,
          seatNumber: '13B'
        }
      }
    );
  }

  // ========== NOTIFICATION MUTATIONS & QUERIES ==========
  console.log('\n🔔 NOTIFICATION MUTATIONS & QUERIES');
  console.log('=' .repeat(60));

  if (testUserId) {
    const notifResult = await testQuery(
      'Create Notification',
      `mutation CreateNotification($input: CreateNotifcationInput!) {
        createNotifcation(createNotifcationInput: $input) {
          id
          title
          body
        }
      }`,
      {
        input: {
          user_id: testUserId,
          title: 'Test Notification',
          body: 'This is a test notification',
          type: 'info',
          image: 'https://example.com/image.jpg'
        }
      }
    );

    if (notifResult && notifResult.createNotifcation) {
      testNotificationId = notifResult.createNotifcation.id;
    }
  }

  if (testUserId) {
    await testQuery(
      'Get All User Notifications',
      `query GetNotifications($userId: String!) {
        allNotifcation(user_id: $userId) {
          id
          title
          body
          isRead
        }
      }`,
      { userId: testUserId }
    );
  }

  if (testNotificationId) {
    await testQuery(
      'Get Notification By ID',
      `query GetNotification($id: String!) {
        notifcation(id: $id) {
          id
          title
          body
        }
      }`,
      { id: testNotificationId }
    );

    await testQuery(
      'Update Notification',
      `mutation UpdateNotification($input: UpdateNotifcationInput!) {
        updateNotifcation(updateNotifcationInput: $input) {
          id
          title
        }
      }`,
      {
        input: {
          id: testNotificationId,
          title: 'Updated Notification'
        }
      }
    );
  }

  // ========== FCM MUTATIONS ==========
  console.log('\n📱 FCM MUTATIONS');
  console.log('=' .repeat(60));

  if (testUserId) {
    await testQuery(
      'Register FCM Token',
      `mutation RegisterFcm($input: CreateFcmInput!) {
        registerFcmToken(input: $input) {
          id
          token
          isActive
        }
      }`,
      {
        input: {
          user_id: testUserId,
          token: `fcm_token_${Date.now()}`,
          isActive: true,
          deviceInfo: 'Test Device'
        }
      }
    );

    await testQuery(
      'Remove FCM Token',
      `mutation RemoveFcm($token: String!) {
        removeFcmToken(token: $token)
      }`,
      { token: `fcm_token_${Date.now()}` }
    );
  }

  // ========== DELETE MUTATIONS ==========
  console.log('\n🗑️  DELETE MUTATIONS');
  console.log('=' .repeat(60));

  if (testBookId) {
    await testQuery(
      'Delete Booking',
      `mutation RemoveBook($id: String!) {
        removeBook(id: $id) {
          id
        }
      }`,
      { id: testBookId }
    );
  }

  if (testNotificationId) {
    await testQuery(
      'Delete Notification',
      `mutation RemoveNotification($id: String!) {
        removeNotifcation(id: $id) {
          id
        }
      }`,
      { id: testNotificationId }
    );
  }

  if (testFightStaffId) {
    await testQuery(
      'Delete Flight Staff',
      `mutation RemoveFightStaff($id: String!) {
        removeFightStaff(id: $id) {
          id
        }
      }`,
      { id: testFightStaffId }
    );
  }

  if (testEmployeeId) {
    await testQuery(
      'Delete Employee',
      `mutation RemoveEmployee($id: String!) {
        removeEmployee(id: $id) {
          id
        }
      }`,
      { id: testEmployeeId }
    );
  }

  if (testFlightId) {
    await testQuery(
      'Delete Flight',
      `mutation RemoveFlight($id: String!) {
        removeFlightMangement(id: $id) {
          id
        }
      }`,
      { id: testFlightId }
    );
  }

  if (testAirLineId) {
    await testQuery(
      'Delete Airline',
      `mutation RemoveAirline($id: String!) {
        removeAirLine(id: $id) {
          id
        }
      }`,
      { id: testAirLineId }
    );
  }

  if (testUserId) {
    await testQuery(
      'Delete User',
      `mutation DeleteUser($id: String!) {
        deleteUser(id: $id) {
          id
        }
      }`,
      { id: testUserId }
    );
  }

  // USER UPDATE
  if (testUserId) {
    await testQuery(
      'Update User',
      `mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(updateUserInput: $input) {
          id
          name
        }
      }`,
      {
        input: {
          id: testUserId,
          name: 'Updated Test User'
        }
      }
    );
  }

  // ========== SUMMARY ==========
  console.log('\n');
  console.log('=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📈 Total: ${results.passed.length + results.failed.length}`);
  console.log('=' .repeat(60));

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS LOG:');
    console.log('=' .repeat(60));
    results.failed.forEach((failure, index) => {
      console.log(`\n${index + 1}. ${failure.name}`);
      if (failure.errors) {
        console.log('   Errors:', JSON.stringify(failure.errors, null, 2));
      } else if (failure.error) {
        console.log('   Error:', failure.error);
      }
    });
  }

  console.log('\n✅ PASSED TESTS:');
  console.log('=' .repeat(60));
  results.passed.forEach((test, index) => {
    console.log(`${index + 1}. ${test}`);
  });
}

// Run all tests
runTests().catch(console.error);
