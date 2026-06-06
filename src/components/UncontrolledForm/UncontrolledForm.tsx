import { useState, type FormEvent } from 'react';
import Modal from '../Modal/Modal';
import { formSchema } from '../../validation/formSchema';
import { useFormStore, type FormInputData } from '../../store/formStore';
import { convertToBase64, getPasswordStrength } from '../../utils/formUtils';

interface UncontrolledFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function UncontrolledForm({ isOpen, onClose }: UncontrolledFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const addSubmission = useFormStore((s) => s.addSubmission);
  const countries = useFormStore((s) => s.countries);

  const resetForm = () => {
    setErrors({});
    setImagePreview(null);
    setPasswordStrength('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const genderValue = formData.get('gender') as string;
    const validGenders = ['male', 'female', 'other'];

    const formValues: FormInputData = {
      name: (formData.get('name') as string) || '',
      age: parseInt(formData.get('age') as string, 10) || 0,
      email: (formData.get('email') as string) || '',
      gender: validGenders.includes(genderValue)
        ? (genderValue as FormInputData['gender'])
        : 'male',
      terms: formData.get('terms') === 'on',
      image: (formData.get('image') as File) || null,
      country: (formData.get('country') as string) || '',
      password: (formData.get('password') as string) || '',
      confirmPassword: (formData.get('confirmPassword') as string) || '',
    };

    const result = formSchema.safeParse(formValues);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!countries.includes(result.data.country)) {
      setErrors({ country: 'Selected country is not in the list' });
      return;
    }

    setErrors({});
    let base64Image: string | null = null;
    if (formValues.image && formValues.image.size > 0) {
      base64Image = await convertToBase64(formValues.image);
    }

    addSubmission({
      ...result.data,
      image: base64Image,
    });

    form.reset();
    resetForm();
    onClose();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordStrength(getPasswordStrength(e.target.value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertToBase64(file).then(setImagePreview).catch(console.error);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Uncontrolled Form">
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-name">Name:</label>
          <input id="uc-name" name="name" type="text" />
          {errors.name && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-age">Age:</label>
          <input id="uc-age" name="age" type="number" />
          {errors.age && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.age}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-email">Email:</label>
          <input id="uc-email" name="email" type="email" />
          {errors.email && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-gender">Gender:</label>
          <select id="uc-gender" name="gender" defaultValue="">
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.gender}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-image">Image:</label>
          <input
            id="uc-image"
            name="image"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '200px', display: 'block', marginTop: '8px' }}
            />
          )}
          {errors.image && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.image}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-country">Country:</label>
          <input id="uc-country" name="country" list="uc-countries" autoComplete="off" />
          <datalist id="uc-countries">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.country && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.country}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-password">Password:</label>
          <input
            id="uc-password"
            name="password"
            type="password"
            onChange={handlePasswordChange}
          />
          {passwordStrength && (
            <p style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>
              Strength: {passwordStrength}
            </p>
          )}
          {errors.password && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.password}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="uc-confirmPassword">Confirm Password:</label>
          <input id="uc-confirmPassword" name="confirmPassword" type="password" />
          {errors.confirmPassword && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="uc-terms">
            <input id="uc-terms" name="terms" type="checkbox" /> Accept Terms and Conditions
          </label>
          {errors.terms && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.terms}
            </p>
          )}
        </div>

        <button type="submit" style={{ padding: '8px 24px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </Modal>
  );
}

export default UncontrolledForm;