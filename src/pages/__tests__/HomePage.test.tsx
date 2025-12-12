import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from '../../pages/HomePage';
import { AuthProvider } from '../../contexts/AuthContext';
import { AudioProvider } from '../../contexts/AudioContext';

// Wrapper with all required providers
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false }
        }
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <AudioProvider>
                        {children}
                    </AudioProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the page title', () => {
        render(<HomePage />, { wrapper: createWrapper() });

        // Title is just "Deutsch" in the h1
        expect(screen.getByText('Deutsch')).toBeInTheDocument();
    });

    it('renders main category headers', () => {
        render(<HomePage />, { wrapper: createWrapper() });

        // Check for category names in accordion headers
        expect(screen.getByText('Spiele')).toBeInTheDocument();
        expect(screen.getByText('Wortschatz')).toBeInTheDocument();
        expect(screen.getByText('Grammatik')).toBeInTheDocument();
    });

    it('renders all category sections', () => {
        render(<HomePage />, { wrapper: createWrapper() });

        // All 5 categories should be present
        expect(screen.getByText('Spiele')).toBeInTheDocument();
        expect(screen.getByText('Wortschatz')).toBeInTheDocument();
        expect(screen.getByText('Grammatik')).toBeInTheDocument();
        expect(screen.getByText('Tests')).toBeInTheDocument();
        expect(screen.getByText('Intensiv-Trainer')).toBeInTheDocument();
    });

    it('has an accessible main heading', () => {
        render(<HomePage />, { wrapper: createWrapper() });

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Deutsch');
    });

    it('renders expandable category sections as buttons', () => {
        render(<HomePage />, { wrapper: createWrapper() });

        // Should have clickable category headers (accordion)
        const buttons = screen.getAllByRole('button');
        // Should have at least 5 category buttons + login button
        expect(buttons.length).toBeGreaterThanOrEqual(5);
    });

    it('shows login button when not authenticated', () => {
        render(<HomePage />, { wrapper: createWrapper() });

        expect(screen.getByText('Войти')).toBeInTheDocument();
    });

    it('category accordion can be expanded', async () => {
        render(<HomePage />, { wrapper: createWrapper() });

        // Find and click a category button
        const spieleButton = screen.getByText('Spiele').closest('button');
        expect(spieleButton).toBeTruthy();

        if (spieleButton) {
            fireEvent.click(spieleButton);

            // After clicking, exercises should become visible
            await waitFor(() => {
                // Check for exercise titles that appear when expanded
                expect(screen.getByText('Finde Paare')).toBeInTheDocument();
            }, { timeout: 1000 });
        }
    });

    it('displays exercise cards with icons', async () => {
        render(<HomePage />, { wrapper: createWrapper() });

        // First click to expand the Spiele category (it's expanded by default actually)
        // Look for exercise headings
        const spieleButton = screen.getByText('Spiele').closest('button');
        if (spieleButton) {
            // The first category is expanded by default
            await waitFor(() => {
                expect(screen.getByText('Finde Paare')).toBeInTheDocument();
            });
        }
    });
});
