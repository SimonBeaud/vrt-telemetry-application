
const { addSession } = require('../DataBase/Database');

// Mockez le module 'electron'
jest.mock('electron', () => ({
    app: {
        getPath: jest.fn().mockReturnValue('/mocked/path/to/userData'),
    },
}));

// Mockez le module 'sqlite3'
jest.mock('sqlite3', () => ({
    Database: jest.fn().mockImplementation(function () {
        return {
            serialize: jest.fn(),
            run: jest.fn(),
            all: jest.fn(),
            get: jest.fn(),
        };
    }),
}));

// Cas de test
test('addSession should add a new session', async () => {
    const session = await addSession('Test Session', 'Test Pilot', '2023-07-11');
    expect(session).toBeTruthy();
});

