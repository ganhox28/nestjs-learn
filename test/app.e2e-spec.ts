//end to end test
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { describe } from 'node:test';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

const PORT = 3000
describe('App EndToEnd tests', () => {
  let app: INestApplication
  let prismaService: PrismaService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = appModule.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
    await app.listen(PORT)
    prismaService = app.get(PrismaService)
    await prismaService.cleanDatabase()
  })
  
  afterAll(async () => {
    app.close()
  })
})

describe('Test Authentication', () => {
  describe('Register', () => {
    it('empty email', () => {
      return pactum.spec().post(`http://localhost:${PORT}/auth/register`)
      .withBody({
        email: '',
        password: 'a123'
      }).expectStatus(400)
    })

    it('Should Register', () => {
      return pactum.spec().post(`http://localhost:${PORT}/auth/register`)
      .withBody({
        email: 'test01@mail.com',
        password: 'a123'
      }).expectStatus(201)
    })
  })

  describe('Login', () => {
    it('Should Login', () => {
      return pactum.spec().post(`http://localhost:${PORT}/auth/login`)
      .withBody({
        email: 'test01@mail.com',
        password: 'a123'
      }).expectStatus(201)
    })
  })
})