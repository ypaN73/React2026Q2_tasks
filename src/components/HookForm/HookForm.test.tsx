import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HookForm from './HookForm';
import { useFormStore } from '../../store/formStore';

describe('HookForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  function renderForm(isOpen = true) {
    const onClose = vi.fn();
    const utils = render(<HookForm isOpen={isOpen} onClose={onClose} />);
    return { ...utils, onClose };
  }

  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Age:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender:')).toBeInTheDocument();
    expect(screen.getByLabelText('Image:')).toBeInTheDocument();
    expect(screen.getByLabelText('Country:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Accept Terms and Conditions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('disables submit button when form has errors', () => {
    renderForm();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('shows live validation error for name', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText('Name:'), 'a');
    await waitFor(() => {
      expect(screen.getByText('First letter must be uppercase')).toBeInTheDocument();
    });
  });

  it('shows live validation error for email', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText('Email:'), 'invalid');
    await waitFor(() => {
      expect(screen.getByText(/Email must contain one @/)).toBeInTheDocument();
    });
  });

  it('shows password strength indicator', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText('Password:'), 'Abcdef1!');
    expect(screen.getByText('Strength: Strong')).toBeInTheDocument();
  });

  it('renders country datalist options', () => {
    renderForm();

    const countryInput = screen.getByLabelText('Country:');
    const datalistId = countryInput.getAttribute('list');
    expect(datalistId).toBeTruthy();

    if (datalistId) {
      const datalist = document.getElementById(datalistId);
      expect(datalist).toBeInTheDocument();
      expect(datalist?.querySelectorAll('option').length).toBeGreaterThan(0);
    }
  });

  it('does not render when closed', () => {
    const { container } = render(<HookForm isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});