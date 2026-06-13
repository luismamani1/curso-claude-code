const { test, expect } = require('@playwright/test');

const unique = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

async function registerUser(page, name, email, password = 'pass1234') {
  await page.goto('/register.html');
  await page.fill('#name', name);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('#submit-btn');
  await page.waitForURL(/dashboard\.html/);
}

test.describe('Dashboard', () => {

  test('acceso sin JWT redirige a login', async ({ page }) => {
    await page.goto('/dashboard.html');
    await expect(page).toHaveURL(/login\.html/);
  });

  test('muestra posición en cola y QR tras registro', async ({ page }) => {
    const email = `${unique()}@kohi.test`;
    await registerUser(page, 'Sofía Torres', email);

    await expect(page.locator('#dashboard-content')).toBeVisible();
    await expect(page.locator('#position-number')).toContainText('#');
    await expect(page.locator('#qr-canvas')).toBeVisible();
    await expect(page.locator('#invite-code-text')).toContainText('Código:');
  });

  test('dos usuarios registrados en secuencia tienen posiciones 1 y 2', async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const email1 = `${unique()}@kohi.test`;
    const email2 = `${unique()}@kohi.test`;

    await registerUser(page1, 'Primer Usuario', email1);
    await registerUser(page2, 'Segundo Usuario', email2);

    const pos1 = await page1.locator('#position-number').textContent();
    const pos2 = await page2.locator('#position-number').textContent();

    const n1 = parseInt(pos1.replace('#', ''));
    const n2 = parseInt(pos2.replace('#', ''));

    expect(n2).toBeGreaterThan(n1);

    await ctx1.close();
    await ctx2.close();
  });

  test('cerrar sesión redirige al inicio y borra el token', async ({ page }) => {
    const email = `${unique()}@kohi.test`;
    await registerUser(page, 'Diego Paredes', email);

    await page.click('#logout-btn');
    await expect(page).toHaveURL(/\//);

    const token = await page.evaluate(() => localStorage.getItem('kohi_token'));
    expect(token).toBeNull();
  });

  test('el canvas del QR existe y tiene dimensiones', async ({ page }) => {
    const email = `${unique()}@kohi.test`;
    await registerUser(page, 'Valentina Cruz', email);

    const canvas = page.locator('#qr-canvas');
    await expect(canvas).toBeVisible();

    const width = await canvas.evaluate(el => el.width);
    expect(width).toBeGreaterThan(0);
  });

});
