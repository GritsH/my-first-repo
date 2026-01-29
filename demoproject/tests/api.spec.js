const { test, expect } = require('@playwright/test');

test.describe.serial('API tests for Restful-booker', () => {
    const baseUrl = 'https://restful-booker.herokuapp.com';
    let bookingId;
    let authToken;

    test.beforeAll(async ({ request }) => {
        // create booking
        const createRes = await request.post(`${baseUrl}/booking`, {
            data: {
                firstname: 'John',
                lastname: 'Doe',
                totalprice: 111,
                depositpaid: true,
                bookingdates: {
                    checkin: '2026-01-01',
                    checkout: '2027-01-01'
                },
                additionalneeds: 'Breakfast'
            }
        });

        expect(createRes.status()).toBe(200);
        const createBody = await createRes.json();

        bookingId = createBody.bookingid;
        expect(createBody.booking.firstname).toBe('John');

        // auth
        const authRes = await request.post(`${baseUrl}/auth`, {
            data: {
                username: 'admin',
                password: 'password123'
            }
        });

        const authBody = await authRes.json();
        authToken = authBody.token;
        expect(authToken).toBeTruthy();
    });

    test('Get booking', async ({ request }) => {
        const response = await request.get(`${baseUrl}/booking/${bookingId}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.firstname).toBe('John');
        expect(body.lastname).toBe('Doe');
    });

    test('Update booking', async ({ request }) => {
        const response = await request.put(`${baseUrl}/booking/${bookingId}`, {
            headers: {
                Cookie: `token=${authToken}`
            },
            data: {
                firstname: 'John',
                lastname: 'Smith',
                totalprice: 111,
                depositpaid: true,
                bookingdates: {
                    checkin: '2026-03-01',
                    checkout: '2027-01-01'
                },
                additionalneeds: 'Breakfast'
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.lastname).toBe('Smith');
        expect(body.bookingdates.checkin).toBe('2026-03-01');
    });

    test('Delete booking', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/booking/${bookingId}`, {
            headers: {
                Cookie: `token=${authToken}`
            }
        });

        expect(response.status()).toBe(201);

        const check = await request.get(`${baseUrl}/booking/${bookingId}`);
        expect(check.status()).toBe(404);
    });
});
