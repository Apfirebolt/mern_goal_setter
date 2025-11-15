import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from '../components/Footer';

const renderWithTheme = (component, mode = 'light') => {
    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Footer Component', () => {
    test('renders footer with correct title', () => {
        renderWithTheme(<Footer />);
        expect(screen.getByText('Goals Tracker')).toBeInTheDocument();
    });

    test('renders description text', () => {
        renderWithTheme(<Footer />);
        expect(screen.getByText(/Track your goals, achieve your dreams/i)).toBeInTheDocument();
    });

    test('renders Quick Links section', () => {
        renderWithTheme(<Footer />);
        expect(screen.getByText('Quick Links')).toBeInTheDocument();
        expect(screen.getByText('About Us')).toBeInTheDocument();
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
        expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    test('renders Contact section', () => {
        renderWithTheme(<Footer />);
        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByText('support@goalstracker.com')).toBeInTheDocument();
        expect(screen.getByText('Follow us on social media')).toBeInTheDocument();
    });

    test('renders copyright with current year', () => {
        renderWithTheme(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} Goals Tracker. All rights reserved.`))).toBeInTheDocument();
    });

    test('renders as footer element', () => {
        const { container } = renderWithTheme(<Footer />);
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });
});
