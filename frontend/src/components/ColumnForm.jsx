// ./frontend/src/components/ColumnForm.jsx

import { useState, useEffect } from 'react';
import '../styles/Form.css';

const ColumnForm = ({ onSubmit, initialValues = { name: '' } }) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when initialValues change
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  // Suggested column names
  const suggestions = ['To Do', 'In Progress', 'Done', 'Backlog', 'Review', 'Testing', 'Deployed'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Column name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Column name must be at least 2 characters';
    } else if (formData.name.trim().length > 30) {
      newErrors.name = 'Column name must be less than 30 characters';
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

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, name: suggestion }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: null }));
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Column Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. To Do, In Progress, Done"
          className={errors.name ? 'error' : ''}
          disabled={isSubmitting}
          autoFocus
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
        
        <div className="form-helper">
          Name your column based on the stage of your tasks in the workflow.
        </div>
        
        <div className="suggestions">
          <div className="suggestions-label">Suggestions:</div>
          <div className="suggestions-chips">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isSubmitting}
              >
                {suggestion}
              </button>
            ))}
          </div>
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
          initialValues.name ? 'Save Changes' : 'Create Column'
        )}
      </button>
    </form>
  );
};

export default ColumnForm;