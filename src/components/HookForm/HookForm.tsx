import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../Modal/Modal';
import { formSchema, type FormSchemaType } from '../../validation/formSchema';
import { useFormStore } from '../../store/formStore';
import { convertToBase64, getPasswordStrength } from '../../utils/formUtils';

interface HookFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function HookForm({ isOpen, onClose }: HookFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const addSubmission = useFormStore((s) => s.addSubmission);
  const countries = useFormStore((s) => s.countries);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: undefined,
      terms: undefined,
      image: undefined,
      country: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const resetForm = () => {
    reset();
    setImagePreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data: FormSchemaType) => {
    if (!countries.includes(data.country)) {
      setError('country', {
        type: 'manual',
        message: 'Selected country is not in the list',
      });
      return;
    }

    let base64Image: string | null = null;
    if (data.image instanceof File && data.image.size > 0) {
      base64Image = await convertToBase64(data.image);
    }

    addSubmission({
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      terms: data.terms,
      image: base64Image,
      country: data.country,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    resetForm();
    onClose();
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
    <Modal isOpen={isOpen} onClose={handleClose} title="React Hook Form">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-name">Name:</label>
          <input id="rhf-name" {...register('name')} />
          {errors.name && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-age">Age:</label>
          <input id="rhf-age" type="number" {...register('age', { valueAsNumber: true })} />
          {errors.age && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.age.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-email">Email:</label>
          <input id="rhf-email" type="email" {...register('email')} />
          {errors.email && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-gender">Gender:</label>
          <select id="rhf-gender" {...register('gender')} defaultValue="">
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.gender.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-image">Image:</label>
          <input
            id="rhf-image"
            type="file"
            accept="image/png, image/jpeg"
            {...register('image')}
            onChange={(e) => {
              handleImageChange(e);
              void register('image').onChange(e);
            }}
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
              {errors.image.message?.toString()}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-country">Country:</label>
          <input
            id="rhf-country"
            list="rhf-countries"
            autoComplete="off"
            {...register('country')}
          />
          <datalist id="rhf-countries">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.country && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.country.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-password">Password:</label>
          <input id="rhf-password" type="password" {...register('password')} />
          {password && (
            <p style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>
              Strength: {getPasswordStrength(password)}
            </p>
          )}
          {errors.password && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="rhf-confirmPassword">Confirm Password:</label>
          <input id="rhf-confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="rhf-terms">
            <input id="rhf-terms" type="checkbox" {...register('terms')} /> Accept Terms and
            Conditions
          </label>
          {errors.terms && (
            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {errors.terms.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          style={{ padding: '8px 24px', cursor: 'pointer' }}
        >
          Submit
        </button>
      </form>
    </Modal>
  );
}

export default HookForm;