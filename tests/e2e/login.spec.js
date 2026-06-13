const { test, expect } = require('@playwright/test');

const unique = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

test.describe('Login', () => {

  test('login exitoso redirige al dashboard', async ({ page }) => {
    const email = `${unique()}@kohi.test`;

    await page.goto('/register.html');
    await page.fill('#name', 'Carlos Méndez');
    await page.fill('#email', email);
    await page.fill('#password', 'mipass123');
    await page.click('#submit-btn');
    await page.waitForURL(/dashboard\.html/);

    await page.evaluate(() => localStorage.clear());
    await page.goto('/login.html');
    await page.fill('#email', email);
    await page.fill('#password', 'mipass123');
    await page.click('#submit-btn');

    await expect(page).toHaveURL(/dashboard\.html/);
    await expect(page.locator('#position-number')).toContainText('#');
  });

  test('login con contraseña incorrecta muestra error y permanece en login', async ({ page }) => {
    const email = `${unique()}@kohi.test`;

    await page.goto('/register.html');
    await page.fill('#name', 'Laura Quispe');
    await page.fill('#email', email);
    await page.fill('#password', 'correcta123');
    await page.click('#submit-btn');
    await page.waitForURL(/dashboard\.html/);

    await page.evaluate(() => localStorage.clear());
    await page.goto('/login.html');
    await page.fill('#email', email);
    await page.fill('#password', 'incorrecta999');
    await page.click('#submit-btn');

    await expect(page.locator('#alert')).toBeVisible();
    await expect(page.locator('#alert')).toContainText('Credenciales');
    await expect(page).toHaveURL(/login\.html/);
  });

  test('login con email no registrado muestra error', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#email', 'noexiste@kohi.test');
    await page.fill('#password', 'cualquierpass');
    await page.click('#submit-btn');

    await expect(page.locator('#alert')).toBeVisible();
    await expect(page.locator('#alert')).toContainText('Credenciales');
  });

});
