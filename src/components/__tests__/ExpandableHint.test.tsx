import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpandableHint } from '../ExpandableHint';

describe('ExpandableHint', () => {
    it('renders title correctly', () => {
        render(
            <ExpandableHint title="Test Hint">
                <p>Hint content</p>
            </ExpandableHint>
        );

        expect(screen.getByText('Test Hint')).toBeInTheDocument();
    });

    it('is collapsed by default (defaultOpen=false)', () => {
        render(
            <ExpandableHint title="Test Hint">
                <p>Hint content</p>
            </ExpandableHint>
        );

        // Content should not be visible
        expect(screen.queryByText('Hint content')).not.toBeInTheDocument();
    });

    it('expands when clicked', async () => {
        render(
            <ExpandableHint title="Test Hint">
                <p>Hint content</p>
            </ExpandableHint>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Hint content')).toBeInTheDocument();
        });
    });

    it('can be initially expanded with defaultOpen', async () => {
        render(
            <ExpandableHint title="Test Hint" defaultOpen={true}>
                <p>Hint content</p>
            </ExpandableHint>
        );

        await waitFor(() => {
            expect(screen.getByText('Hint content')).toBeInTheDocument();
        });
    });

    it('renders custom icon', () => {
        const CustomIcon = () => <span data-testid="custom-icon">🔍</span>;

        render(
            <ExpandableHint title="Test Hint" icon={<CustomIcon />}>
                <p>Hint content</p>
            </ExpandableHint>
        );

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('shows chevron down icon when collapsed', () => {
        const { container } = render(
            <ExpandableHint title="Test Hint">
                <p>Hint content</p>
            </ExpandableHint>
        );

        // Should have ChevronDown icon (lucide icon with specific class)
        const chevronDown = container.querySelector('.lucide-chevron-down');
        expect(chevronDown).toBeTruthy();
    });

    it('applies custom className', () => {
        const { container } = render(
            <ExpandableHint title="Test" className="my-class">
                <p>Content</p>
            </ExpandableHint>
        );

        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('my-class');
    });
});
