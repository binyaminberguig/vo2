describe('Project API', () => {
  const userData = {
    name: 'Binyamin',
    email: 'binyamin@test.com',
    password: '123456',
  };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(userData.email);

    const userInDb = await User.findOne({ email: userData.email });
    expect(userInDb).not.toBeNull();
  });

  it('should not register a user with an existing email', async () => {
    await User.create(userData);

    const res = await request(app).post('/api/auth/register').send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/exists/i);
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/register').send(userData);

    const res = await request(app).post('/api/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(userData.email);
  });

  it('should reject invalid credentials', async () => {
    await request(app).post('/api/auth/register').send(userData);

    const res = await request(app).post('/api/auth/login').send({
      email: userData.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });
});
