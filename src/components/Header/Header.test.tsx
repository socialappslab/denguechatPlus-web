import { render, screen } from '@testing-library/react';
import Header from '.';

describe('Render the Header Component correctly', () => {
  test('should render the Vite logo', async () => {
    render(<Header />);

    const appLogo = await screen.findByTestId('logo');

    expect(appLogo).toBeInTheDocument();
  });

  test('should render the title', async () => {
    render(<Header />);

    const header = await screen.findByText(/DengueChat/);

    expect(header).toBeInTheDocument();
  });
});
