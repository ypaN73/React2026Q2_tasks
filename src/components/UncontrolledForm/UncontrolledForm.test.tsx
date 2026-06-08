import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import UncontrolledForm from './UncontrolledForm';
import { useFormStore } from '../../store/formStore';

describe('UncontrolledForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  function renderForm(isOpen = true) {
    const onClose = vi.fn();
    const utils = render(<UncontrolledForm isOpen={isOpen} onClose={onClose} />);
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

  it('displays validation errors on empty submit', async () => {
    renderForm();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('displays multiple validation errors on submit with invalid data', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText('Name:'), 'alice');
    await userEvent.type(screen.getByLabelText('Age:'), '-5');
    await userEvent.type(screen.getByLabelText('Email:'), 'invalid');

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('First letter must be uppercase')).toBeInTheDocument();
      expect(screen.getByText('Age cannot be negative')).toBeInTheDocument();
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
    const { container } = render(<UncontrolledForm isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});