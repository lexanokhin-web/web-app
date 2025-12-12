import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click</Button>);

        fireEvent.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies primary variant by default', () => {
        const { container } = render(<Button>Primary</Button>);
        const button = container.querySelector('button');

        // Primary buttons have blue background
        expect(button?.className).toContain('bg-blue-500');
    });

    it('applies secondary variant correctly', () => {
        const { container } = render(<Button variant="secondary">Secondary</Button>);
        const button = container.querySelector('button');

        // Secondary buttons have gray background
        expect(button?.className).toContain('bg-gray-500');
    });

    it('applies success variant correctly', () => {
        const { container } = render(<Button variant="success">Success</Button>);
        const button = container.querySelector('button');

        expect(button?.className).toContain('bg-green-500');
    });

    it('applies danger variant correctly', () => {
        const { container } = render(<Button variant="danger">Danger</Button>);
        const button = container.querySelector('button');

        expect(button?.className).toContain('bg-red-500');
    });

    it('can be disabled', () => {
        const handleClick = vi.fn();
        render(<Button disabled onClick={handleClick}>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
        const { container } = render(
            <Button className="custom-class">Button</Button>
        );

        const button = container.querySelector('button');
        expect(button).toHaveClass('custom-class');
    });
});
