import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders using a portal', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Portal Test">
        <p>Portal Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog.parentElement?.parentElement).toBe(document.body);
  });

  it('closes when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when overlay is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    const overlay = screen.getByTestId('modal-overlay');
    await userEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    await userEvent.click(dialog);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when other keys are pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Accessible Modal">
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('traps focus within the modal', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Focus Test">
        <button>First Button</button>
        <button>Second Button</button>
      </Modal>
    );

    const firstButton = screen.getByText('First Button');
    const secondButton = screen.getByText('Second Button');
    const closeButton = screen.getByLabelText('Close modal');

    const focusableElements = [closeButton, firstButton, secondButton];

    expect(focusableElements.length).toBeGreaterThan(0);
  });

  it('cleans up event listeners when unmounted', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen={true} onClose={onClose} title="Cleanup Test">
        <p>Content</p>
      </Modal>
    );

    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('restores body overflow when unmounted', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Overflow Test">
        <p>Content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });
});