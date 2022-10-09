export const config = (): any => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  contextPath: 'api/v1',
  enableMetaData: true,
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: ['dist/**/*.entity.js'],
    autoLoadEntities: true,
    keepConnectionAlive: true,
  },
  jwt: {
    secret: 'hard!to-guess_secret',
    accessTokenOptions: { expiresIn: '3600s' },
    refreshTokenOptions: { expiresIn: '1210000s', path: '/auth/refresh' },
    grantTypes: { accessGrant: 'access', refreshGrant: 'refresh' },
  },
  bcrypt: {
    saltRounds: 10,
  },
  swagger: {
    isEnabled: true,
    uiPath: '/swagger-ui',
    authUsers: {
      root: 'toor',
      admin: 'admin@123',
    },
  },
  session: {
    secret:
      'some-really-hard-to-guess-secret-32sdf-42gh45fs-23134234-4332-gebhj',
  },
});
