import { render, screen } from '@testing-library/react';
import { Menu } from '../../Components';


describe('Testeo Menu', () => {
  test('encontrar el cafe latte en la lista', async () => {
    render(<Menu />);
    expect(await screen.findByText(/Latte/i)).toBeInTheDocument();
  });
});
