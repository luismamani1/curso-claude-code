const { test, expect } = require('@playwright/test');

const unique = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

test.describe('Registro en la waitlist', () => {

  test('registro exitoso redirige al dashboard con posición numérica', async ({ page }) => {
    await page.goto('/register.html');
    await page.fill('#name', 'Ana García');
    await page.fill('#email', `${unique()}@kohi.test`);
    await page.fill('#password', 'segura123');
    await page.click('#submit-btn');

    await expect(page).toHaveURL(/dashboard\.html/);
    await expect(page.locator('#position-number')).toContainText('#');
  });

  test('registro con email ya registrado muestra error', async ({ page }) => {
    const email = `${unique()}@kohi.test`;

    await page.goto('/register.html');
    await page.fill('#name', 'Pedro Rojas');
    await page.fill('#email', email);
    await page.fill('#password', 'segura123');
    await page.click('#submit-btn');
    await page.waitForURL(/dashboard\.html/);

    await page.evaluate(() => localStorage.clear());
    await page.goto('/register.html');
    await page.fill('#name', 'Pedro Rojas Dos');
    await page.fill('#email', email);
    await page.fill('#password', 'otrapass123');
    await page.click('#submit-btn');

    await expect(page.locator('#email-error')).toContainText('registrado');
  });

  test('registro con email inválido muestra error de validación antes de enviar', async ({ page }) => {
    await page.goto('/register.html');
    await page.fill('#name', 'María López');
    await page.fill('#email', 'usuario@.com');
    await page.fill('#password', 'segura123');
    await page.click('#submit-btn');

    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page).toHaveURL(/register\.html/);
  });

  test('registro con campos vacíos no envía el formulario', async ({ page }) => {
    await page.goto('/register.html');
    await page.click('#submit-btn');

    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page).toHaveURL(/register\.html/);
  });

});
