const pool = require('../lib/utils/pool')
const setup = require('../data/setup')
const request = require('supertest')
const app = require('../lib/app')
const UserService = require('../lib/services/UserService')


const testUser = {
  firstName: 'Dinky',
  lastName: 'Kong',
  email: 'dinky@kong.com',
  password: '12345',
}

const registerAndSignIn = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password

  const agent = request.agent(app)

  const user = await UserService.create({ ...testUser, ...userProps })

  const { email } = user

  await agent.post('/api/v1/users/sessions').send({ email, password })

  return [agent, user]
};


describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(testUser)
    const { firstName, lastName, email } = testUser

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    })
  })

  it('returns the current user', async () => {
    const [agent, user] = await registerAndSignIn()

    const me = await agent.get('/api/v1/users/me')

    console.log("ME", me.body)

    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    })
  })

  it('should return a 401 when signed out and listing all users', async () => {
    const res = await request(app).get('/api/v1/users')

    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    })
  })

  it('should return a 403 when signed in but not admin and listing all users', async () => {
    const [agent] = await registerAndSignIn();

    const res = await agent.get('/api/v1/users');

    expect(res.body).toEqual({
      message: 'You do not have access to view this page',
      status: 403,
    });
  });

  /////////////////// new tests above ///////////////////
})
