import { screen } from '@testing-library/dom';

test('Check for Headline in the page header', () => {
  document.body.innerHTML = `
  <h1 class="leading-snug data-testid="page-headline" tracking-tighter font-medium text-4xl" aria-description="Manage your skills" aria-label="Headline: Manage your skills">Manage your skills</h1>
  `;

  expect(screen.getByText('Manage your skills')).toBeVisible();
});

test('Check for Description in the page header', () => {
  document.body.innerHTML = `
  <h3 class="leading-snug tracking-tighter font-normal text-xl text-neutral-500" title="Add the languages you know" data-testid="page-description">Add Languages you know</h3>
  `;

  expect(screen.getByText('Add Languages you know')).toBeVisible();
});
