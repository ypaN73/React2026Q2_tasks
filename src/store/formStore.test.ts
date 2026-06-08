import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from './formStore';

const mockSubmission = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female' as const,
  terms: true,
  image: 'data:image/png;base64,abc123',
  country: 'Belarus',
  password: 'Abcdef1!',
  confirmPassword: 'Abcdef1!',
};

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  it('starts with empty submissions array', () => {
    const state = useFormStore.getState();
    expect(state.submissions).toEqual([]);
  });

  it('has pre-populated countries list', () => {
    const state = useFormStore.getState();
    expect(state.countries.length).toBeGreaterThan(0);
    expect(state.countries).toContain('Belarus');
  });

  it('adds a submission', () => {
    const { addSubmission } = useFormStore.getState();

    addSubmission(mockSubmission);

    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('Alice');
    expect(state.submissions[0].age).toBe(25);
    expect(state.submissions[0].email).toBe('alice@example.com');
    expect(state.submissions[0].gender).toBe('female');
    expect(state.submissions[0].terms).toBe(true);
    expect(state.submissions[0].image).toBe('data:image/png;base64,abc123');
    expect(state.submissions[0].country).toBe('Belarus');
  });

  it('generates id and timestamp for each submission', () => {
    const { addSubmission } = useFormStore.getState();

    addSubmission(mockSubmission);

    const state = useFormStore.getState();
    expect(state.submissions[0].id).toBeDefined();
    expect(typeof state.submissions[0].id).toBe('string');
    expect(state.submissions[0].timestamp).toBeDefined();
    expect(typeof state.submissions[0].timestamp).toBe('number');
  });

  it('marks new submissions with isNew flag', () => {
    const { addSubmission } = useFormStore.getState();

    addSubmission(mockSubmission);

    const state = useFormStore.getState();
    expect(state.submissions[0].isNew).toBe(true);
  });

  it('adds new submissions to the beginning of the array', () => {
    const { addSubmission } = useFormStore.getState();

    addSubmission({ ...mockSubmission, name: 'First' });
    addSubmission({ ...mockSubmission, name: 'Second' });

    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(2);
    expect(state.submissions[0].name).toBe('Second');
    expect(state.submissions[1].name).toBe('First');
  });

  it('markAsSeen sets isNew to false for specified submission', () => {
    const { addSubmission, markAsSeen } = useFormStore.getState();

    addSubmission(mockSubmission);
    const id = useFormStore.getState().submissions[0].id;

    markAsSeen(id);

    const state = useFormStore.getState();
    expect(state.submissions[0].isNew).toBe(false);
  });

  it('markAsSeen does not affect other submissions', () => {
    const { addSubmission, markAsSeen } = useFormStore.getState();

    addSubmission({ ...mockSubmission, name: 'First' });
    addSubmission({ ...mockSubmission, name: 'Second' });

    const firstId = useFormStore.getState().submissions[1].id;

    markAsSeen(firstId);

    const state = useFormStore.getState();
    expect(state.submissions[0].isNew).toBe(true);
    expect(state.submissions[1].isNew).toBe(false);
  });

  it('markAsSeen with non-existent id does nothing', () => {
    const { addSubmission, markAsSeen } = useFormStore.getState();

    addSubmission(mockSubmission);

    markAsSeen('non-existent-id');

    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].isNew).toBe(true);
  });
});