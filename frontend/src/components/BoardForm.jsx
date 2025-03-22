// ./frontend/src/components/BoardForm.jsx

import { useState, useEffect } from 'react';
import '../styles/Form.css';

const BoardForm = ({ onSubmit, initialValues = { name: '' } }) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when initialValues change
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Board name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Board name must be at least 3 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Board name must be less than 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (err) {
        console.error('Form submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Board Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Marketing Plan"
          className={errors.name ? 'error' : ''}
          disabled={isSubmitting}
          autoFocus
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
        
        <div className="form-helper">
          Give your board a clear, descriptive name to help your team understand its purpose.
        </div>
      </div>
      
      <button 
        type="submit" 
        className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            <span>Processing...</span>
          </>
        ) : (
          initialValues.name ? 'Save Changes' : 'Create Board'
        )}
      </button>
    </form>
  );
};

export default BoardForm;