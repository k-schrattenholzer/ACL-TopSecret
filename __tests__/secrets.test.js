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

const testSecret = {
  title: 'Centipedes',
  description: 'Shoot - that lil dude sure knows how to wiggle.'
}

const registerAndSignIn = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password

  const agent = request.agent(app)

  const user = await UserService.create({ ...testUser, ...userProps })

  const { email } = user

  await agent.post('/api/v1/users/sessions').send({ email, password })

  return [agent, user]
}

describe('backend secret routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('should post a new secret, only when a user is signed in', async () => {
    const [agent, user] = await registerAndSignIn()

    const newSecret = await agent.post('/api/v1/secrets').send({ ...testSecret, user_id: user.id})

    expect(newSecret.body).toEqual({
      id: expect.any(String),
      ...testSecret,
      user_id: user.id,
      created_at: expect.any(String)
    })
  })

  it('should error when a user tries to post a secret & is not logged in', async () => {

    const fraudSecret = await request(app).post('/api/v1/secrets').send({ ...testSecret, user_id: 6})
   
    expect(fraudSecret.body).toEqual({ status: 401, message: 'You must be signed in to continue' })
  })

  it('should return a list of secrets for a logged in user', async () => {
    const [agent, user] = await registerAndSignIn()

    const newSecret = await agent.post('/api/v1/secrets').send({ ...testSecret, user_id: user.id})
    
    const allSecrets = await agent.get('/api/v1/secrets')

    expect(allSecrets.body).toEqual(expect.arrayContaining([{
      id: expect.any(String),
      ...testSecret,
      user_id: user.id,
      created_at: expect.any(String)
    }]))
  })
})
