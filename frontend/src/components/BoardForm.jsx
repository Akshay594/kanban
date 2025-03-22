// ./frontend/src/components/BoardForm.jsx

import { useState } from 'react';
import '../styles/Form.css';

const BoardForm = ({ onSubmit, initialValues = { name: '' }, existingBoards = [] }) => {
  // Use a single state variable for name instead of a formData object
  const [name, setName] = useState(initialValues.name || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Board name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Board name must be at least 3 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Board name must be less than 50 characters';
    }
    
    // Check for duplicate board names
    const isDuplicate = existingBoards.some(
      board => board.name.toLowerCase() === name.trim().toLowerCase() && 
              board.id !== initialValues.id // Skip current board when editing
    );
    
    if (isDuplicate) {
      newErrors.name = 'A board with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setName(e.target.value);
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit({ name });
      } catch (err) {
        console.error('Form submission error:', err);
        
        // Handle API error response if needed
        if (err.response && err.response.data && err.response.data.message) {
          setErrors({ name: err.response.data.message });
        }
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
          value={name}
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