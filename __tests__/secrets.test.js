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
  title: 'Life on Earth',
  description: 'I feel like aliens & ufos are ignoring me.',
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

  it('posts a new secret, when a user is signed in', async () => {
    const [agent, user] = await registerAndSignIn()

    const newSecret = await agent.post('/api/v1/secrets').send({ ...testSecret, user_id: user.id})
     console.log('-----------------newSecret-----------------',newSecret.body)

    expect(newSecret.body).toEqual({
      id: expect.any(String),
      ...testSecret,
      user_id: user.id,
      created_at: expect.any(String)
    })
  })
})
